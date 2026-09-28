[CmdletBinding()]
param(
    [string] $DrawioPath = 'C:\Program Files\draw.io\draw.io.exe',
    [string] $OutputDirectory
)

$ErrorActionPreference = 'Stop'
$workflowRoot = Split-Path -Parent $PSScriptRoot
$OutputDirectory = if ($OutputDirectory) { $OutputDirectory } else { Join-Path $workflowRoot 'png' }
$sourceDirectory = Join-Path $workflowRoot 'drawio'
$combinedPath = Join-Path $workflowRoot 'SaaS-Sentry-Activity-Diagrams.drawio'
$manifestPath = Join-Path $workflowRoot 'artifact-manifest.json'

if (-not (Test-Path -LiteralPath $DrawioPath -PathType Leaf)) {
    throw "draw.io Desktop was not found: $DrawioPath"
}

# draw.io Desktop 29.x writes a corrupt PNG when '-e' (embed the diagram XML) is used:
# the zTXt chunk carries a wrong CRC and the trailing IEND chunk is truncated to its
# 4-byte length field, so the file has a valid signature but no decoder can read it.
# The canonical editable sources are the .drawio files hashed in this manifest, so the
# export drops '-e' and validates every PNG before the manifest is written.
function Test-PngIntegrity([string] $Path) {
    $bytes = [IO.File]::ReadAllBytes($Path)
    $problems = @()
    $signature = [byte[]] @(137, 80, 78, 71, 13, 10, 26, 10)
    if ($bytes.Length -lt 8) { return @{ ok = $false; problems = @('file shorter than the PNG signature'); width = 0; height = 0 } }
    for ($i = 0; $i -lt 8; $i++) {
        if ($bytes[$i] -ne $signature[$i]) { $problems += 'bad PNG signature'; break }
    }
    function Read-UInt32BE([byte[]] $Buffer, [int] $Offset) {
        return ([uint32] $Buffer[$Offset] -shl 24) -bor ([uint32] $Buffer[$Offset + 1] -shl 16) -bor ([uint32] $Buffer[$Offset + 2] -shl 8) -bor ([uint32] $Buffer[$Offset + 3])
    }
    $width = 0
    $height = 0
    $sawIhdr = $false
    $sawIdat = $false
    $sawIend = $false
    $offset = 8
    while ($offset + 8 -le $bytes.Length) {
        $length = [int] (Read-UInt32BE $bytes $offset)
        $type = [Text.Encoding]::ASCII.GetString($bytes, $offset + 4, 4)
        if ($offset + 12 + $length -gt $bytes.Length) {
            $problems += "truncated chunk '$type' at offset $offset (needs $($offset + 12 + $length) bytes, file has $($bytes.Length))"
            break
        }
        $crcStored = Read-UInt32BE $bytes ($offset + 8 + $length)
        $crc = [uint32]::MaxValue
        for ($i = $offset + 4; $i -lt $offset + 8 + $length; $i++) {
            $crc = $crc -bxor [uint32] $bytes[$i]
            for ($bit = 0; $bit -lt 8; $bit++) {
                if ($crc -band 1) { $crc = (($crc -shr 1) -bxor 0xEDB88320) } else { $crc = $crc -shr 1 }
            }
        }
        $crc = $crc -bxor [uint32]::MaxValue
        if ($crc -ne $crcStored) { $problems += "CRC mismatch in chunk '$type' at offset $offset" }
        if ($type -eq 'IHDR') {
            $sawIhdr = $true
            $width = [int] (Read-UInt32BE $bytes ($offset + 8))
            $height = [int] (Read-UInt32BE $bytes ($offset + 12))
        }
        if ($type -eq 'IDAT') { $sawIdat = $true }
        if ($type -eq 'IEND') { $sawIend = $true; $offset += 12 + $length; break }
        $offset += 12 + $length
    }
    if (-not $sawIhdr) { $problems += 'no IHDR chunk' }
    if (-not $sawIdat) { $problems += 'no IDAT chunk' }
    if (-not $sawIend) { $problems += 'no valid IEND chunk' }
    if ($width -le 0 -or $height -le 0) { $problems += "non-positive dimensions ${width}x${height}" }
    return @{ ok = ($problems.Count -eq 0); problems = $problems; width = $width; height = $height }
}

$sources = @(Get-ChildItem -LiteralPath $sourceDirectory -Filter 'WF-*.drawio' -File | Sort-Object Name)
if ($sources.Count -ne 22) {
    throw "Expected exactly 22 Workflow sources; found $($sources.Count)."
}

$stageRoot = Join-Path ([IO.Path]::GetTempPath()) ("saas-sentry-workflow-export-" + [guid]::NewGuid().ToString('N'))
$stagePng = Join-Path $stageRoot 'png'
New-Item -ItemType Directory -Force -Path $stagePng | Out-Null

try {
    # The multi-page file is assembled from the 22 canonical individual sources.
    # It never imports pages from the historical ZIP.
    $combined = New-Object System.Xml.XmlDocument
    $declaration = $combined.CreateXmlDeclaration('1.0', 'UTF-8', $null)
    [void] $combined.AppendChild($declaration)
    [xml] $firstSource = Get-Content -LiteralPath $sources[0].FullName -Raw -Encoding utf8
    $mxfile = $combined.CreateElement('mxfile')
    foreach ($attribute in $firstSource.mxfile.Attributes) {
        $mxfile.SetAttribute($attribute.Name, $attribute.Value)
    }
    [void] $combined.AppendChild($mxfile)
    foreach ($source in $sources) {
        [xml] $pageSource = Get-Content -LiteralPath $source.FullName -Raw -Encoding utf8
        [void] $mxfile.AppendChild($combined.ImportNode($pageSource.mxfile.diagram, $true))
    }
    $stageCombined = Join-Path $stageRoot 'SaaS-Sentry-Activity-Diagrams.drawio'
    $writerSettings = New-Object System.Xml.XmlWriterSettings
    $writerSettings.Encoding = [Text.UTF8Encoding]::new($false)
    $writerSettings.Indent = $true
    $writer = [System.Xml.XmlWriter]::Create($stageCombined, $writerSettings)
    try { $combined.Save($writer) } finally { $writer.Dispose() }

    $commandTemplate = 'draw.io -x -f png -b 10 -s 2 -o <output.png> <input.drawio>'
    $integrityReport = @()
    foreach ($source in $sources) {
        $output = Join-Path $stagePng ($source.BaseName + '.png')
        $stdout = Join-Path $stageRoot ($source.BaseName + '.stdout.log')
        $stderr = Join-Path $stageRoot ($source.BaseName + '.stderr.log')
        $arguments = @('-x', '-f', 'png', '-b', '10', '-s', '2', '-o', $output, $source.FullName)
        $process = Start-Process -FilePath $DrawioPath -ArgumentList $arguments -Wait -PassThru -WindowStyle Hidden -RedirectStandardOutput $stdout -RedirectStandardError $stderr
        if ($process.ExitCode -ne 0 -or -not (Test-Path -LiteralPath $output -PathType Leaf)) {
            $errorText = if (Test-Path -LiteralPath $stderr) { Get-Content -LiteralPath $stderr -Raw -Encoding utf8 } else { '' }
            throw "Export of $($source.Name) failed (exit $($process.ExitCode)): $errorText"
        }
        $integrity = Test-PngIntegrity $output
        $integrityReport += [pscustomobject]@{
            page = $source.BaseName
            width = $integrity.width
            height = $integrity.height
            ok = $integrity.ok
            problems = $integrity.problems
        }
        if (-not $integrity.ok) {
            throw "Export of $($source.Name) produced an invalid PNG: $($integrity.problems -join '; ')"
        }
    }
    $failed = @($integrityReport | Where-Object { -not $_.ok })
    if ($failed.Count -gt 0) {
        throw "PNG integrity check failed for $($failed.Count) file(s); the manifest was not written."
    }

    New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
    Copy-Item -LiteralPath $stageCombined -Destination $combinedPath -Force
    Get-ChildItem -LiteralPath $stagePng -Filter '*.png' -File | ForEach-Object {
        Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $OutputDirectory $_.Name) -Force
    }

    $version = (Get-Item -LiteralPath $DrawioPath).VersionInfo.ProductVersion
    if (-not $version) {
        $helpOutput = & $DrawioPath --help 2>&1
        $version = [regex]::Match(($helpOutput -join "`n"), '(?m)^\d+\.\d+\.\d+$').Value
    }
    if (-not $version) { $version = 'not detected from local executable' }
    # Paths in the manifest are repository-relative so the file reproduces on any machine (finding DA-05).
    $docsRoot = Split-Path -Parent (Split-Path -Parent $workflowRoot)
    $repoRoot = Split-Path -Parent $docsRoot
    $repoPrefix = $repoRoot.TrimEnd('\') + '\'
    function Get-RepoRelativePath([string] $FullPath) {
        $resolved = (Resolve-Path -LiteralPath $FullPath).Path
        if ($resolved.StartsWith($repoPrefix, [StringComparison]::OrdinalIgnoreCase)) {
            $resolved = $resolved.Substring($repoPrefix.Length)
        }
        return $resolved -replace '\\', '/'
    }

    $artifacts = @(
        [pscustomobject]@{ path = (Get-RepoRelativePath $combinedPath); sha256 = (Get-FileHash -LiteralPath $combinedPath -Algorithm SHA256).Hash }
    )
    $artifacts += Get-ChildItem -LiteralPath $OutputDirectory -Filter 'WF-*.png' -File | Sort-Object Name | ForEach-Object {
        [pscustomobject]@{ path = (Get-RepoRelativePath $_.FullName); sha256 = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash }
    }
    $manifest = [pscustomobject]@{
        generatedAt = (Get-Date).ToString('o')
        drawio = [pscustomobject]@{ renderer = 'draw.io Desktop CLI'; version = $version; commandTemplate = $commandTemplate }
        sources = $sources | ForEach-Object { [pscustomobject]@{ path = (Get-RepoRelativePath $_.FullName); sha256 = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash } }
        artifacts = $artifacts
        pathConvention = 'Repository-relative, forward slashes, rooted at the parent of Docs.'
        visualReview = 'Recorded separately in Reviews; successful export does not replace visual inspection.'
        pngIntegrity = [pscustomobject]@{
            checkedAtExport = $true
            checks = 'PNG signature, per-chunk CRC, IHDR present with width/height > 0, IDAT present, valid trailing IEND.'
            embeddedXmlFlag = "Dropped on 16/09/2026: draw.io Desktop 29.x with '-e' writes a wrong zTXt CRC and truncates IEND, producing files no decoder can read (finding QĐ30-C02). The editable sources are the .drawio files listed under 'sources'."
            results = $integrityReport
        }
    }
    [IO.File]::WriteAllText($manifestPath, ($manifest | ConvertTo-Json -Depth 5), [Text.UTF8Encoding]::new($false))
    Write-Output "Exported 22 PNG files, the combined file, and manifest: $manifestPath"
}
finally {
    if (Test-Path -LiteralPath $stageRoot) {
        Remove-Item -LiteralPath $stageRoot -Recurse -Force
    }
}

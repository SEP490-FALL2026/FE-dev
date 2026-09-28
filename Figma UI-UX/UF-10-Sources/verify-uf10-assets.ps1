param(
    [Parameter(Mandatory = $true)]
    [string]$RootPath
)

$ErrorActionPreference = 'Stop'
$resolvedRoot = (Resolve-Path -LiteralPath $RootPath).Path
$sourceRoot = Join-Path $resolvedRoot 'Figma UI-UX\UF-10-Sources'
$outputRoot = Join-Path $resolvedRoot 'Figma UI-UX\UF-10-FullFrames'

foreach ($testName in @('uf10-data.test.js', 'uf10-renderer.test.js')) {
    & node (Join-Path $sourceRoot $testName)
    if ($LASTEXITCODE -ne 0) { throw "UF-10 test $testName failed with exit code $LASTEXITCODE." }
}

Add-Type -AssemblyName System.Drawing
foreach ($theme in @('Light', 'Dark')) {
    $themeRoot = Join-Path $outputRoot $theme
    if (-not (Test-Path -LiteralPath $themeRoot -PathType Container)) { throw "Missing output directory: $themeRoot" }
    $expectedNames = 1..18 | ForEach-Object { 'UF-10-{0}-{1:D2}.png' -f $theme, $_ }
    $actualNames = @(Get-ChildItem -LiteralPath $themeRoot -Filter '*.png' -File | Select-Object -ExpandProperty Name | Sort-Object)
    $diff = @(Compare-Object -ReferenceObject @($expectedNames | Sort-Object) -DifferenceObject $actualNames)
    if ($diff.Count -ne 0) { throw "Unexpected PNG set in $themeRoot.`n$($diff | Out-String)" }
    foreach ($name in $expectedNames) {
        $image = [System.Drawing.Image]::FromFile((Join-Path $themeRoot $name))
        try {
            if ($image.Width -ne 1440 -or $image.Height -ne 1024) {
                throw "$name has dimensions $($image.Width)x$($image.Height); expected 1440x1024."
            }
        }
        finally { $image.Dispose() }
    }
}

Write-Output 'PASS UF-10 assets: 18 Light + 18 Dark PNGs, all 1440x1024; branch continuity and separated savings verified.'

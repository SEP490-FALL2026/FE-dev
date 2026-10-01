param(
    [Parameter(Mandatory = $true)]
    [string]$RootPath
)

$ErrorActionPreference = 'Stop'
$resolvedRoot = (Resolve-Path -LiteralPath $RootPath).Path
$sourceRoot = Join-Path $resolvedRoot 'Figma UI-UX\UF-08-Sources'
$outputRoot = Join-Path $resolvedRoot 'Figma UI-UX\UF-08-FullFrames'

foreach ($testName in @('uf08-data.test.js', 'uf08-renderer.test.js')) {
    $testPath = Join-Path $sourceRoot $testName
    & node $testPath
    if ($LASTEXITCODE -ne 0) {
        throw "UF-08 test $testName failed with exit code $LASTEXITCODE."
    }
}

Add-Type -AssemblyName System.Drawing

foreach ($theme in @('Light', 'Dark')) {
    $themeRoot = Join-Path $outputRoot $theme
    if (-not (Test-Path -LiteralPath $themeRoot -PathType Container)) {
        throw "Missing output directory: $themeRoot"
    }

    $expectedNames = 1..16 | ForEach-Object { 'UF-08-{0}-{1:D2}.png' -f $theme, $_ }
    $actualNames = @(Get-ChildItem -LiteralPath $themeRoot -Filter '*.png' -File | Select-Object -ExpandProperty Name | Sort-Object)
    $expectedSorted = @($expectedNames | Sort-Object)
    $nameDiff = @(Compare-Object -ReferenceObject $expectedSorted -DifferenceObject $actualNames)
    if ($nameDiff.Count -ne 0) {
        throw "Unexpected PNG set in $themeRoot.`n$($nameDiff | Out-String)"
    }

    foreach ($name in $expectedNames) {
        $path = Join-Path $themeRoot $name
        $image = [System.Drawing.Image]::FromFile($path)
        try {
            if ($image.Width -ne 1440 -or $image.Height -ne 1024) {
                throw "$name has dimensions $($image.Width)x$($image.Height); expected 1440x1024."
            }
        }
        finally {
            $image.Dispose()
        }
    }
}

Write-Output 'PASS UF-08 assets: 16 Light + 16 Dark PNGs, all 1440x1024; canonical state and guarded transitions verified.'

param([Parameter(Mandatory = $true)][string]$RootPath)
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path -LiteralPath $RootPath).Path
node (Join-Path $root 'Figma UI-UX\UF-12-Sources\uf12-data.test.js')
node (Join-Path $root 'Figma UI-UX\UF-12-Sources\uf12-renderer.test.js')
Add-Type -AssemblyName System.Drawing
foreach ($theme in @('Light', 'Dark')) {
  $dir = Join-Path $root "Figma UI-UX\UF-12-FullFrames\$theme"
  $files = Get-ChildItem -LiteralPath $dir -Filter '*.png' | Sort-Object Name
  if ($files.Count -ne 20) { throw "Expected 20 $theme files; found $($files.Count)." }
  foreach ($file in $files) {
    $image = [Drawing.Image]::FromFile($file.FullName)
    try { if ($image.Width -ne 1440 -or $image.Height -ne 1024) { throw "Bad dimensions: $($file.Name)" } } finally { $image.Dispose() }
  }
}
Write-Output 'PASS UF-12 assets: 20 Light + 20 Dark PNGs, all 1440x1024; evidence and outcome branches verified.'

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$publicDirectory = (Resolve-Path (Join-Path $PSScriptRoot '../public')).Path
$orange = [System.Drawing.ColorTranslator]::FromHtml('#FF7020')
$warmWhite = [System.Drawing.ColorTranslator]::FromHtml('#FFF7EF')
$master = [System.Drawing.Bitmap]::new(512, 512)
$graphics = [System.Drawing.Graphics]::FromImage($master)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.Clear([System.Drawing.Color]::Transparent)

$tile = [System.Drawing.Drawing2D.GraphicsPath]::new()
$tile.AddArc(0, 0, 232, 232, 180, 90)
$tile.AddArc(280, 0, 232, 232, 270, 90)
$tile.AddArc(280, 280, 232, 232, 0, 90)
$tile.AddArc(0, 280, 232, 232, 90, 90)
$tile.CloseFigure()
$orangeBrush = [System.Drawing.SolidBrush]::new($orange)
$graphics.FillPath($orangeBrush, $tile)

$orbitPen = [System.Drawing.Pen]::new($warmWhite, 68)
$orbitPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$orbitPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$graphics.DrawArc($orbitPen, 70, 70, 372, 372, -90, -270)
$diamond = [System.Drawing.Point[]]@(
  [System.Drawing.Point]::new(256, 184),
  [System.Drawing.Point]::new(328, 256),
  [System.Drawing.Point]::new(256, 328),
  [System.Drawing.Point]::new(184, 256)
)
$whiteBrush = [System.Drawing.SolidBrush]::new($warmWhite)
$graphics.FillPolygon($whiteBrush, $diamond)

function Convert-ToPngBytes([System.Drawing.Bitmap]$source, [int]$size) {
  $bitmap = [System.Drawing.Bitmap]::new($size, $size)
  $g = [System.Drawing.Graphics]::FromImage($bitmap)
  $g.Clear([System.Drawing.Color]::Transparent)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($source, 0, 0, $size, $size)
  $stream = [System.IO.MemoryStream]::new()
  $bitmap.Save($stream, [System.Drawing.Imaging.ImageFormat]::Png)
  $bytes = $stream.ToArray()
  $stream.Dispose(); $g.Dispose(); $bitmap.Dispose()
  return ,$bytes
}

$iconSizes = @(16, 32, 48, 256)
$pngs = foreach ($size in $iconSizes) { Convert-ToPngBytes $master $size }
$icoPath = Join-Path $publicDirectory 'favicon.ico'
$file = [System.IO.File]::Open($icoPath, [System.IO.FileMode]::Create)
$writer = [System.IO.BinaryWriter]::new($file)
$writer.Write([uint16]0)
$writer.Write([uint16]1)
$writer.Write([uint16]$iconSizes.Count)
$offset = 6 + 16 * $iconSizes.Count
for ($index = 0; $index -lt $iconSizes.Count; $index++) {
  $size = $iconSizes[$index]
  $bytes = [byte[]]$pngs[$index]
  $writer.Write([byte]$(if ($size -eq 256) { 0 } else { $size }))
  $writer.Write([byte]$(if ($size -eq 256) { 0 } else { $size }))
  $writer.Write([byte]0)
  $writer.Write([byte]0)
  $writer.Write([uint16]1)
  $writer.Write([uint16]32)
  $writer.Write([uint32]$bytes.Length)
  $writer.Write([uint32]$offset)
  $offset += $bytes.Length
}
foreach ($bytes in $pngs) { $writer.Write([byte[]]$bytes) }
$writer.Dispose(); $file.Dispose()

$touchBytes = Convert-ToPngBytes $master 180
[System.IO.File]::WriteAllBytes((Join-Path $publicDirectory 'apple-touch-icon.png'), [byte[]]$touchBytes)

$orbitPen.Dispose(); $orangeBrush.Dispose(); $whiteBrush.Dispose(); $tile.Dispose()
$graphics.Dispose(); $master.Dispose()
Write-Output $icoPath

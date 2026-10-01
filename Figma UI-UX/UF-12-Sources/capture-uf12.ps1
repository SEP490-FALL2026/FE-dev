param(
  [Parameter(Mandatory = $true)][string]$RootPath,
  [ValidateRange(1, 20)][int[]]$Screens = (1..20)
)

$ErrorActionPreference = 'Stop'
$root = (Resolve-Path -LiteralPath $RootPath).Path
$source = (Resolve-Path -LiteralPath (Join-Path $root 'Figma UI-UX\UF-12-Sources\uf12.html')).Path
$output = [IO.Path]::GetFullPath((Join-Path $root 'Figma UI-UX\UF-12-FullFrames'))
$chrome = @('C:\Program Files\Google\Chrome\Application\chrome.exe', 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe') | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if (-not $chrome) { throw 'Google Chrome not found.' }
$tempRoot = [IO.Path]::GetFullPath([IO.Path]::GetTempPath())
$profile = [IO.Path]::GetFullPath((Join-Path $tempRoot ('uf12-capture-' + [guid]::NewGuid().ToString('N'))))
if (-not $profile.StartsWith($tempRoot, [StringComparison]::OrdinalIgnoreCase)) { throw 'Invalid temporary profile path.' }
New-Item -ItemType Directory -Path $profile | Out-Null
$count = 0
try {
  foreach ($theme in @('Light', 'Dark')) {
    $themeRoot = [IO.Path]::GetFullPath((Join-Path $output $theme))
    if (-not $themeRoot.StartsWith($output, [StringComparison]::OrdinalIgnoreCase)) { throw 'Invalid output path.' }
    New-Item -ItemType Directory -Path $themeRoot -Force | Out-Null
    foreach ($number in $Screens) {
      $screen = '{0:D2}' -f $number
      $baseUri = (New-Object System.Uri($source)).AbsoluteUri
      $uri = "$baseUri`?theme=$($theme.ToLower())&screen=$screen"
      $png = Join-Path $themeRoot ("UF-12-$theme-$screen.png")
      $args = @('--headless=new','--disable-gpu','--hide-scrollbars','--no-first-run','--force-device-scale-factor=1','--window-size=1440,1024',"--user-data-dir=$profile")
      $domFile = Join-Path $profile "preflight-$theme-$screen.html"
      $pre = Start-Process -FilePath $chrome -ArgumentList (@($args) + @('--dump-dom', $uri)) -Wait -PassThru -WindowStyle Hidden -RedirectStandardOutput $domFile
      if ($pre.ExitCode -ne 0) { throw "Chrome preflight failed: $theme $screen" }
      $dom = Get-Content -LiteralPath $domFile -Raw
      $ready = $dom -match 'data-render-ready="true"'
      $noOverflow = $dom -match 'data-overflow="false"'
      if (-not $ready -or -not $noOverflow) { throw "Render preflight failed: $theme $screen (ready=$ready; noOverflow=$noOverflow)" }
      if (Test-Path -LiteralPath $png) { Remove-Item -LiteralPath $png -Force }
      $shotArg = ('--screenshot="{0}"' -f $png)
      $shot = Start-Process -FilePath $chrome -ArgumentList (@($args) + @($shotArg, $uri)) -Wait -PassThru -WindowStyle Hidden
      if ($shot.ExitCode -ne 0 -or -not (Test-Path -LiteralPath $png)) { throw "Screenshot failed: $theme $screen" }
      $count++
      Write-Output "CAPTURED $theme $screen"
    }
  }
} finally {
  if (Test-Path -LiteralPath $profile) { Remove-Item -LiteralPath $profile -Recurse -Force }
}
Write-Output "PASS capture: $count UF-12 artboards generated."

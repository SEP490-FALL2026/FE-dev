param(
    [Parameter(Mandatory = $true)]
    [string]$RootPath,
    [switch]$Resume,
    [ValidateRange(1, 18)]
    [int[]]$Screens = (1..18)
)

$ErrorActionPreference = 'Stop'
$resolvedRoot = (Resolve-Path -LiteralPath $RootPath).Path
$sourceRoot = (Resolve-Path -LiteralPath (Join-Path $resolvedRoot 'Figma UI-UX\UF-10-Sources')).Path
$htmlPath = (Resolve-Path -LiteralPath (Join-Path $sourceRoot 'uf10.html')).Path
$outputRoot = [System.IO.Path]::GetFullPath((Join-Path $resolvedRoot 'Figma UI-UX\UF-10-FullFrames'))
$expectedOutputPrefix = $outputRoot.TrimEnd('\') + '\'

$chromeCandidates = @(
    'C:\Program Files\Google\Chrome\Application\chrome.exe',
    'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe'
)
$chrome = $chromeCandidates | Where-Object { Test-Path -LiteralPath $_ -PathType Leaf } | Select-Object -First 1
if (-not $chrome) { throw 'Google Chrome was not found in either approved installation path.' }

$tempBase = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath())
$profileRoot = [System.IO.Path]::GetFullPath((Join-Path $tempBase ('uf10-capture-' + [guid]::NewGuid().ToString('N'))))
if (-not $profileRoot.StartsWith($tempBase, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing temporary profile outside system temp: $profileRoot"
}
New-Item -ItemType Directory -Path $profileRoot | Out-Null
$capturedCount = 0
$skippedCount = 0

try {
    foreach ($theme in @('Light', 'Dark')) {
        $themeRoot = [System.IO.Path]::GetFullPath((Join-Path $outputRoot $theme))
        if (-not ($themeRoot + '\').StartsWith($expectedOutputPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
            throw "Refusing output directory outside UF-10-FullFrames: $themeRoot"
        }
        New-Item -ItemType Directory -Path $themeRoot -Force | Out-Null

        foreach ($number in $Screens) {
            $screen = '{0:D2}' -f $number
            $themeQuery = $theme.ToLowerInvariant()
            $baseUri = (New-Object System.Uri($htmlPath)).AbsoluteUri
            $pageUri = "$baseUri`?theme=$themeQuery&screen=$screen"
            $outputPath = [System.IO.Path]::GetFullPath((Join-Path $themeRoot ("UF-10-{0}-{1}.png" -f $theme, $screen)))
            if (-not $outputPath.StartsWith($expectedOutputPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
                throw "Refusing screenshot path outside UF-10-FullFrames: $outputPath"
            }
            if ($Resume -and (Test-Path -LiteralPath $outputPath -PathType Leaf)) {
                $skippedCount++
                Write-Output ("SKIPPED existing {0} screen {1}: {2}" -f $theme, $screen, $outputPath)
                continue
            }

            $commonArgs = @(
                '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
                '--disable-extensions', '--disable-background-networking', '--disable-component-update',
                '--disable-default-apps', '--disable-sync', '--metrics-recording-only', '--mute-audio',
                '--force-device-scale-factor=1', '--window-size=1440,1024', '--virtual-time-budget=1200',
                "--user-data-dir=$profileRoot"
            )

            $preflightOut = Join-Path $profileRoot ("preflight-{0}-{1}.out" -f $themeQuery, $screen)
            $preflightErr = Join-Path $profileRoot ("preflight-{0}-{1}.err" -f $themeQuery, $screen)
            $preflight = Start-Process -FilePath $chrome -ArgumentList (@($commonArgs) + @('--dump-dom', $pageUri)) -Wait -PassThru -WindowStyle Hidden -RedirectStandardOutput $preflightOut -RedirectStandardError $preflightErr
            if ($preflight.ExitCode -ne 0) {
                $details = if (Test-Path -LiteralPath $preflightErr) { Get-Content -Raw -LiteralPath $preflightErr } else { '' }
                throw "Chrome DOM preflight failed for $theme screen $screen. $details"
            }
            $domText = Get-Content -Raw -LiteralPath $preflightOut
            if ($domText -notmatch 'data-render-ready="true"') { throw "Render did not reach ready state for $theme screen $screen." }
            if ($domText -notmatch 'data-overflow="false"') { throw "Layout overflow detected for $theme screen $screen." }

            if (Test-Path -LiteralPath $outputPath -PathType Leaf) { Remove-Item -LiteralPath $outputPath -Force }
            $captureOut = Join-Path $profileRoot ("capture-{0}-{1}.out" -f $themeQuery, $screen)
            $captureErr = Join-Path $profileRoot ("capture-{0}-{1}.err" -f $themeQuery, $screen)
            $captureArgs = @($commonArgs) + @(("--screenshot=`"{0}`"" -f $outputPath), $pageUri)
            $capture = Start-Process -FilePath $chrome -ArgumentList $captureArgs -Wait -PassThru -WindowStyle Hidden -RedirectStandardOutput $captureOut -RedirectStandardError $captureErr
            if ($capture.ExitCode -ne 0 -or -not (Test-Path -LiteralPath $outputPath -PathType Leaf)) {
                $details = if (Test-Path -LiteralPath $captureErr) { Get-Content -Raw -LiteralPath $captureErr } else { '' }
                throw "Chrome screenshot failed for $theme screen $screen. $details"
            }
            $capturedCount++
            Write-Output ("CAPTURED {0} screen {1}: {2}" -f $theme, $screen, $outputPath)
        }
    }
}
finally {
    $resolvedProfile = [System.IO.Path]::GetFullPath($profileRoot)
    $safePrefix = $tempBase.TrimEnd('\') + '\uf10-capture-'
    if ($resolvedProfile.StartsWith($safePrefix, [System.StringComparison]::OrdinalIgnoreCase) -and (Test-Path -LiteralPath $resolvedProfile)) {
        Remove-Item -LiteralPath $resolvedProfile -Recurse -Force -ErrorAction SilentlyContinue
    }
}

Write-Output ("PASS capture: {0} UF-10 artboards generated, {1} existing artboards skipped." -f $capturedCount, $skippedCount)

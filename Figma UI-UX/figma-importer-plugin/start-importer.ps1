# Khởi động Figma Importer Server
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "   SaaS-Sentry Figma Importer Server (UF-07..10)       " -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""
node server.js

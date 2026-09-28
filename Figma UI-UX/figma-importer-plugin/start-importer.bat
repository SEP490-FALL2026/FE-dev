@echo off
chcp 65001 > nul
echo =======================================================
echo    SaaS-Sentry Figma Importer Server (UF-07..10)
echo =======================================================
echo.
cd /d "%~dp0"
node server.js
pause

@echo off
title Blitzball Labs - Stop Website
setlocal

set "BACKEND=G:\CMakePJ\CompanyWebsite-Backend"
set "DOCKER_BIN=C:\Program Files\Docker\Docker\resources\bin"
set "PATH=%DOCKER_BIN%;%PATH%"

echo.
echo ============================================================
echo   Stopping website...
echo ============================================================
echo.

echo [1/2] Stopping backend and database...
pushd "%BACKEND%"
docker compose down
popd
echo       Backend stopped.
echo.

echo [2/2] Stopping frontend website (port 8080)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
echo       Frontend stopped (if a black window remains, just close it).
echo.

echo ============================================================
echo   Website fully stopped. Your data is kept for next time.
echo ============================================================
echo.
pause

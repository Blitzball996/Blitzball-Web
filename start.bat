@echo off
title Blitzball Labs - Start Website
setlocal enabledelayedexpansion

set "BACKEND=G:\CMakePJ\CompanyWebsite-Backend"
set "FRONTEND=G:\CMakePJ\CompanyWebsite"
set "DOCKER_BIN=C:\Program Files\Docker\Docker\resources\bin"
set "DOCKER_DESKTOP=C:\Program Files\Docker\Docker\Docker Desktop.exe"
set "PATH=%DOCKER_BIN%;%PATH%"

echo.
echo ============================================================
echo   Blitzball Labs - Website Launcher
echo ============================================================
echo   Frontend (website) : %FRONTEND%
echo   Backend  (stats)   : %BACKEND%
echo ============================================================
echo.

REM ========== Step 1: make sure Docker engine is running ==========
echo [1/4] Checking if Docker is running...
docker info >nul 2>&1
if %errorlevel%==0 goto DOCKER_OK

echo       Docker is not running. Starting Docker Desktop for you...
start "" "%DOCKER_DESKTOP%"
echo       Waiting for Docker engine (up to ~2 min, please wait)...

set /a tries=0
:WAIT_DOCKER
timeout /t 5 >nul
docker info >nul 2>&1
if %errorlevel%==0 goto DOCKER_OK
set /a tries+=1
if !tries! geq 24 goto DOCKER_FAIL
set /a sec=!tries!*5
echo       ...still starting ^(waited !sec! sec^)
goto WAIT_DOCKER

:DOCKER_FAIL
echo.
echo   [ERROR] Docker did not start within 2 minutes.
echo   Please open "Docker Desktop" manually, wait until the whale icon
echo   in the tray turns solid (not spinning), then run this script again.
echo.
pause
exit /b 1

:DOCKER_OK
echo       Docker is OK.
echo.

REM ========== Step 2: start backend + database ==========
echo [2/4] Starting backend and database (Docker containers)...
pushd "%BACKEND%"
docker compose up -d
set "RC=%errorlevel%"
popd
if not "%RC%"=="0" goto BACKEND_FAIL
echo       Backend started: http://localhost:8090
echo.
goto START_FRONTEND

:BACKEND_FAIL
echo.
echo   [ERROR] Backend failed to start. Screenshot the error above and send it to me.
echo.
pause
exit /b 1

REM ========== Step 3: start frontend website ==========
:START_FRONTEND
echo [3/4] Starting frontend website (port 8080)...
start "Frontend - close this window to stop website" cmd /k "cd /d %FRONTEND% & echo. & echo Frontend running: http://localhost:8080 & echo Closing this window stops the website. & echo. & python -m http.server 8080"
echo       Frontend started: http://localhost:8080
echo.

REM ========== Step 4: open browser ==========
echo [4/4] Opening browser...
timeout /t 3 >nul
start "" http://localhost:8080
echo.

echo ============================================================
echo   All started!
echo ------------------------------------------------------------
echo   Website   : http://localhost:8080
echo   Analytics : http://localhost:8090/dashboard
echo               user: admin   pass: change-me-please
echo ------------------------------------------------------------
echo   To stop: double-click stop.bat in this folder
echo ============================================================
echo.
pause

@echo off
cd /d G:\CMakePJ\CompanyWebsite
echo.
echo  Blitzball Labs - Company Website Dev Server
echo  ============================================
echo  Opening http://localhost:8080 in browser...
echo  Press Ctrl+C to stop.
echo.
start "" http://localhost:8080
python -m http.server 8080

@echo off
echo Refreshing service proxies...
echo.

REM Check if NSwag is installed globally
where nswag >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing NSwag globally...
    npm install -g nswag
)

echo Generating TypeScript service proxies...
nswag run nswag.json

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Service proxies generated successfully!
    echo File location: src/app/shared/service-proxies/service-proxies.ts
) else (
    echo.
    echo ✗ Error generating service proxies!
    echo Please check your API is running and accessible.
)

echo.
pause
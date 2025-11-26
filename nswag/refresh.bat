@echo off
REM Angular Service Proxy Refresh Script using existing NSwag configuration
REM This script runs from the nswag folder and uses service.config.nswag

echo ========================================
echo Angular Service Proxy Generator (NSwag)
echo ========================================

REM Get the current directory (nswag folder)
set NSWAG_DIR=%cd%

REM Get the parent directory (project root)
set PROJECT_DIR=%cd%\..

REM Navigate to project root to check for angular.json
pushd "%PROJECT_DIR%"

REM Check if we're in an Angular project (look for angular.json in parent directory)
if not exist "angular.json" (
    echo ERROR: angular.json not found in parent directory!
    echo Expected project structure:
    echo %PROJECT_DIR%\
    echo ├── angular.json
    echo └── nswag\
    echo     ├── service.config.nswag
    echo     └── refresh.bat ^(current location^)
    echo.
    echo Current nswag directory: %NSWAG_DIR%
    echo Parent directory: %PROJECT_DIR%
    popd
    pause
    exit /b 1
)

REM Return to nswag directory
popd

REM Set the NSwag configuration file path (current directory)
set NSWAG_CONFIG_FILE=service.config.nswag

REM Check if NSwag configuration file exists in current directory
if not exist "%NSWAG_CONFIG_FILE%" (
    echo ERROR: %NSWAG_CONFIG_FILE% not found in current directory!
    echo Please ensure your NSwag configuration file exists at:
    echo %NSWAG_DIR%\%NSWAG_CONFIG_FILE%
    echo.
    echo Current directory contents:
    dir /b *.nswag 2>nul
    pause
    exit /b 1
)

echo Project Root: %PROJECT_DIR%
echo NSwag Directory: %NSWAG_DIR%
echo Configuration File: %NSWAG_CONFIG_FILE%
echo Full Config Path: %NSWAG_DIR%\%NSWAG_CONFIG_FILE%
echo.

REM Check if Node.js is available
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found in PATH!
    echo Please install Node.js or add it to your system PATH.
    pause
    exit /b 1
)

REM Check if NSwag is available globally
where nswag >nul 2>nul
if %errorlevel% neq 0 (
    echo NSwag CLI not found globally. Checking locally in project...
    
    REM Check if NSwag is installed locally in the parent project
    if exist "%PROJECT_DIR%\node_modules\.bin\nswag.cmd" (
        set NSWAG_CMD="%PROJECT_DIR%\node_modules\.bin\nswag"
        echo Using local NSwag from project: %NSWAG_CMD%
    ) else if exist "%PROJECT_DIR%\node_modules\.bin\nswag" (
        set NSWAG_CMD="%PROJECT_DIR%\node_modules\.bin\nswag"
        echo Using local NSwag from project: %NSWAG_CMD%
    ) else (
        echo NSwag not found locally either. Installing globally...
        echo Installing NSwag CLI...
        npm install -g nswag
        
        REM Verify installation
        where nswag >nul 2>nul
        if %errorlevel% neq 0 (
            echo ERROR: Failed to install NSwag CLI!
            pause
            exit /b 1
        )
        set NSWAG_CMD=nswag
    )
) else (
    set NSWAG_CMD=nswag
    echo Using global NSwag CLI
)

echo.
echo Starting service proxy generation...
echo Using configuration: %NSWAG_CONFIG_FILE%
echo.

REM Run NSwag with the configuration file from current directory
%NSWAG_CMD% run "%NSWAG_CONFIG_FILE%"

REM Check if the generation was successful
if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo ✓ Service proxy generation completed successfully!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo ✗ Service proxy generation failed!
    echo Error code: %errorlevel%
    echo ========================================
    echo.
    echo Please check:
    echo 1. Your API server is running and accessible
    echo 2. The swagger endpoint URL in %NSWAG_CONFIG_FILE% is correct
    echo 3. Network connectivity to your API server
    echo 4. NSwag configuration syntax is valid
    echo 5. Output directory paths in configuration are correct
    echo 6. Permissions for output directories
)

echo.

REM Optional: Show generated files
echo Do you want to see the generated files? (y/n)
set /p SHOW_FILES=
if /i "%SHOW_FILES%"=="y" (
    echo.
    echo Looking for generated TypeScript files in project...
    
    pushd "%PROJECT_DIR%"
    
    REM Look for common output directories
    if exist "src\app\shared\service-proxies" (
        echo Files in src\app\shared\service-proxies:
        dir "src\app\shared\service-proxies\*.ts" /b 2>nul
        echo.
    )
    if exist "src\shared\service-proxies" (
        echo Files in src\shared\service-proxies:
        dir "src\shared\service-proxies\*.ts" /b 2>nul
        echo.
    )
    if exist "src\app\services" (
        echo Files in src\app\services:
        dir "src\app\services\*.ts" /b 2>nul
        echo.
    )
    if exist "src\services" (
        echo Files in src\services:
        dir "src\services\*.ts" /b 2>nul
        echo.
    )
    
    REM Search for any service-related TypeScript files
    echo Searching for service proxy files...
    for /f "delims=" %%i in ('dir /s /b *.ts 2^>nul ^| findstr -i "service.*proxy\|proxy.*service\|api.*client\|client.*api" ^| findstr -v "node_modules"') do (
        echo Found: %%i
    )
    
    popd
)

echo.
echo Press any key to exit...
pause >nul
exit /b %errorlevel%
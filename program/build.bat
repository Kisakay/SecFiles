@echo off
echo Building SEX file handler with Bun...

REM Clean previous build
if exist sex-file-handler.exe del sex-file-handler.exeexe

REM Build the executable
bun build index.ts --compile --outfile sex-file-handler.exe --windows-icon=sexfiles.ico
@REM  --target bun-windows-x64

if %ERRORLEVEL% EQU 0 (
    echo Build successful!
    echo Executable created: sex-file-handler.exe
) else (
    echo ❌ Build failed!
    exit /b 1
)
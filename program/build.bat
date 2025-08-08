@echo off
echo Building SEX file handler with Bun...

REM Clean previous build
if exist sex-file-handler.exe del sex-file-handler.exe

REM Build the executable
bun build main.ts --compile --outfile sex-file-handler.exe --target bun-windows-x64

if %ERRORLEVEL% EQU 0 (
    echo ✅ Build successful!
    echo 📁 Executable created: sex-file-handler.exe
    dir sex-file-handler.exe
    
    REM Optional: Test the executable
    if exist test-file.sex (
        echo 🧪 Testing with test-file.sex...
        sex-file-handler.exe test-file.sex
    )
) else (
    echo ❌ Build failed!
    exit /b 1
)
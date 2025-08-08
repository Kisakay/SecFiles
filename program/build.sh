# build.sh (ou build.bat pour Windows)
#!/bin/bash

echo "Building SEX file handler with Bun..."

# Clean previous build
rm -f sex-file-handler.exe

# Build the executable
bun build main.ts --compile --outfile sex-file-handler.exe --target bun-windows-x64

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Executable created: sex-file-handler.exe"
    echo "📊 File size: $(ls -lh sex-file-handler.exe | awk '{print $5}')"
else
    echo "❌ Build failed!"
    exit 1
fi

# Optional: Test the executable
if [ -f "test-file.sex" ]; then
    echo "🧪 Testing with test-file.sex..."
    ./sex-file-handler.exe test-file.sex
fi
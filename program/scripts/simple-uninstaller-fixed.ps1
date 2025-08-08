# simple-uninstaller.ps1
Write-Host "Removing SEX file handler and context menus..." -ForegroundColor Yellow

try {
    $UserClassesRoot = "Registry::HKEY_CURRENT_USER\Software\Classes"
    $removedItems = 0
    
    # Remove .sex file association
    if (Test-Path "$UserClassesRoot\.sex") {
        Remove-Item -Path "$UserClassesRoot\.sex" -Recurse -Force
        Write-Host "Removed .sex file association" -ForegroundColor Green
        $removedItems++
    }
    
    # Remove SexFile type definition
    if (Test-Path "$UserClassesRoot\SexFile") {
        Remove-Item -Path "$UserClassesRoot\SexFile" -Recurse -Force
        Write-Host "Removed SexFile type definition" -ForegroundColor Green
        $removedItems++
    }
    
    # Remove context menu for files
    if (Test-Path "$UserClassesRoot\*\shell\SexifyFile") {
        Remove-Item -Path "$UserClassesRoot\*\shell\SexifyFile" -Recurse -Force
        Write-Host "Removed file context menu" -ForegroundColor Green
        $removedItems++
    }
    
    # Remove context menu for directories
    if (Test-Path "$UserClassesRoot\Directory\shell\SexifyDirectory") {
        Remove-Item -Path "$UserClassesRoot\Directory\shell\SexifyDirectory" -Recurse -Force
        Write-Host "Removed directory context menu" -ForegroundColor Green
        $removedItems++
    }
    
    # Remove context menu for directory background
    if (Test-Path "$UserClassesRoot\Directory\Background\shell\SexifyHere") {
        Remove-Item -Path "$UserClassesRoot\Directory\Background\shell\SexifyHere" -Recurse -Force
        Write-Host "Removed directory background context menu" -ForegroundColor Green
        $removedItems++
    }
    
    # Remove context menu for drives
    if (Test-Path "$UserClassesRoot\Drive\shell\SexifyDrive") {
        Remove-Item -Path "$UserClassesRoot\Drive\shell\SexifyDrive" -Recurse -Force
        Write-Host "Removed drive context menu" -ForegroundColor Green
        $removedItems++
    }
    
    # Remove old context menu entries
    if (Test-Path "$UserClassesRoot\*\shell\OpenWithSexHandler") {
        Remove-Item -Path "$UserClassesRoot\*\shell\OpenWithSexHandler" -Recurse -Force
        Write-Host "Removed old context menu entry" -ForegroundColor Green
        $removedItems++
    }
    
    if ($removedItems -eq 0) {
        Write-Host "No SEX file handler entries found to remove" -ForegroundColor Cyan
    } else {
        # Refresh Windows Explorer
        Write-Host "Refreshing Windows Explorer..." -ForegroundColor Yellow
        
        # Check if Shell32 type already exists
        try {
            if (-not ([System.Management.Automation.PSTypeName]"Shell32").Type) {
                Add-Type -TypeDefinition @"
                    using System;
                    using System.Runtime.InteropServices;
                    public class Shell32 {
                        [DllImport("shell32.dll", CharSet = CharSet.Auto, SetLastError = true)]
                        public static extern void SHChangeNotify(uint wEventId, uint uFlags, IntPtr dwItem1, IntPtr dwItem2);
                    }
"@
            }
            [Shell32]::SHChangeNotify(0x08000000, 0x0000, [IntPtr]::Zero, [IntPtr]::Zero)
            Write-Host "Windows Explorer refreshed" -ForegroundColor Green
        } catch {
            # Fallback - restart explorer process
            Write-Host "Using alternative refresh method..." -ForegroundColor Yellow
            Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 2
            Start-Process explorer
            Write-Host "Explorer restarted" -ForegroundColor Green
        }
        
        Write-Host "Successfully removed $removedItems item(s)!" -ForegroundColor Green
    }
    
} catch {
    Write-Error "Failed to remove context menu entries: $($_.Exception.Message)"
    exit 1
}

Write-Host "Uninstallation complete!" -ForegroundColor Green

# Version simple qui redémarre Explorer au lieu d'utiliser l'API
$UserClassesRoot = "Registry::HKEY_CURRENT_USER\Software\Classes"

# Supprimer toutes les entrées
@("\.sex", "\SexFile", "\*\shell\SexifyFile", "\Directory\shell\SexifyDirectory", "\Directory\Background\shell\SexifyHere", "\Drive\shell\SexifyDrive", "\*\shell\OpenWithSexHandler") | ForEach-Object {
    $path = "$UserClassesRoot$_"
    if (Test-Path $path) {
        Remove-Item -Path $path -Recurse -Force
        Write-Host "Removed: $_" -ForegroundColor Green
    }
}

# Redémarrer Explorer
Write-Host "Restarting Windows Explorer..." -ForegroundColor Yellow
Stop-Process -Name explorer -Force
Start-Sleep -Seconds 2
Start-Process explorer

Write-Host "Cleanup complete!" -ForegroundColor Green
# user-installer.ps1
# Install file association for current user only (no admin rights required)

param(
    [Parameter(Mandatory=$true)]
    [string]$ExecutablePath
)

# Validate that the executable exists
if (-not (Test-Path $ExecutablePath)) {
    Write-Error "Executable not found at: $ExecutablePath"
    exit 1
}

# Get the full path
$FullPath = (Resolve-Path $ExecutablePath).Path

Write-Host "Installing SEX file handler for current user..." -ForegroundColor Green
Write-Host "Executable path: $FullPath" -ForegroundColor Yellow
Write-Host "Note: This will only work for the current user account." -ForegroundColor Cyan

try {
    # Use HKEY_CURRENT_USER instead of HKEY_CLASSES_ROOT
    $UserClassesRoot = "Registry::HKEY_CURRENT_USER\Software\Classes"
    
    # Create file extension association
    New-Item -Path "$UserClassesRoot\.sex" -Force | Out-Null
    Set-ItemProperty -Path "$UserClassesRoot\.sex" -Name "(Default)" -Value "SexFile"
    Set-ItemProperty -Path "$UserClassesRoot\.sex" -Name "Content Type" -Value "application/x-sex-file"

    # Create file type definition
    New-Item -Path "$UserClassesRoot\SexFile" -Force | Out-Null
    Set-ItemProperty -Path "$UserClassesRoot\SexFile" -Name "(Default)" -Value "SEX File"

    # Set default icon
    New-Item -Path "$UserClassesRoot\SexFile\DefaultIcon" -Force | Out-Null
    Set-ItemProperty -Path "$UserClassesRoot\SexFile\DefaultIcon" -Name "(Default)" -Value "$FullPath,0"

    # Create shell commands
    New-Item -Path "$UserClassesRoot\SexFile\shell" -Force | Out-Null
    Set-ItemProperty -Path "$UserClassesRoot\SexFile\shell" -Name "(Default)" -Value "open"

    New-Item -Path "$UserClassesRoot\SexFile\shell\open" -Force | Out-Null
    Set-ItemProperty -Path "$UserClassesRoot\SexFile\shell\open" -Name "(Default)" -Value "Sexify this entry"

    New-Item -Path "$UserClassesRoot\SexFile\shell\open\command" -Force | Out-Null
    Set-ItemProperty -Path "$UserClassesRoot\SexFile\shell\open\command" -Name "(Default)" -Value "`"$FullPath`" `"%1`""

    # Add context menu entry
    New-Item -Path "$UserClassesRoot\*\shell\OpenWithSexHandler" -Force | Out-Null
    Set-ItemProperty -Path "$UserClassesRoot\*\shell\OpenWithSexHandler" -Name "(Default)" -Value "Sexify this entry"
"
    Set-ItemProperty -Path "$UserClassesRoot\*\shell\OpenWithSexHandler" -Name "Icon" -Value "$FullPath,0"

    New-Item -Path "$UserClassesRoot\*\shell\OpenWithSexHandler\command" -Force | Out-Null
    Set-ItemProperty -Path "$UserClassesRoot\*\shell\OpenWithSexHandler\command" -Name "(Default)" -Value "`"$FullPath`" `"%1`""

    Write-Host "Registration completed successfully!" -ForegroundColor Green
    Write-Host "File association created for current user only." -ForegroundColor Yellow
    
    # Refresh the shell
    Write-Host "Refreshing Windows Explorer..." -ForegroundColor Yellow
    
    # Notify Windows of the change
    Add-Type -TypeDefinition @"
        using System;
        using System.Runtime.InteropServices;
        public class Shell32 {
            [DllImport("shell32.dll", CharSet = CharSet.Auto, SetLastError = true)]
            public static extern void SHChangeNotify(uint wEventId, uint uFlags, IntPtr dwItem1, IntPtr dwItem2);
        }
"@
    
    [Shell32]::SHChangeNotify(0x08000000, 0x0000, [IntPtr]::Zero, [IntPtr]::Zero)
    
    Write-Host "Changes should take effect immediately." -ForegroundColor Green
    
} catch {
    Write-Error "Failed to register file association: $($_.Exception.Message)"
    exit 1
}

Write-Host "`nInstallation complete!" -ForegroundColor Green
Write-Host "You can now double-click .sex files to open them with your application." -ForegroundColor Yellow
Write-Host "Note: This association only works for your user account." -ForegroundColor Cyan
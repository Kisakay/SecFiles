param(
    [Parameter(Mandatory=$true)]
    [string]$ExecutablePath,
    [string]$MenuText = "Sexify this entry"
)

# Vérifier l'exécutable
if (-not (Test-Path $ExecutablePath)) {
    Write-Error "Executable not found at: $ExecutablePath"
    exit 1
}

$FullPath = (Resolve-Path $ExecutablePath).Path
Write-Host "Installing SEX file handler for current user..." -ForegroundColor Green
Write-Host "Executable path: $FullPath" -ForegroundColor Yellow
Write-Host "Note: This will only work for the current user account." -ForegroundColor Cyan

# Détection Windows 11
$WinVersion = (Get-CimInstance Win32_OperatingSystem).Version
$IsWindows11 = ($WinVersion -ge "10.0.22000")

try {
    $UserClassesRoot = "Registry::HKEY_CURRENT_USER\Software\Classes"
    
    # Association extension .sex
    New-Item -Path "$UserClassesRoot\.sex" -Force | Out-Null
    Set-ItemProperty -Path "$UserClassesRoot\.sex" -Name "(Default)" -Value "SexFile"
    Set-ItemProperty -Path "$UserClassesRoot\.sex" -Name "Content Type" -Value "application/x-sex-file"

    # Type de fichier "SexFile"
    New-Item -Path "$UserClassesRoot\SexFile" -Force | Out-Null
    Set-ItemProperty -Path "$UserClassesRoot\SexFile" -Name "(Default)" -Value "SEX File"

    # Icône par défaut
    New-Item -Path "$UserClassesRoot\SexFile\DefaultIcon" -Force | Out-Null
    Set-ItemProperty -Path "$UserClassesRoot\SexFile\DefaultIcon" -Name "(Default)" -Value "$FullPath,0"

    # Commande "open"
    New-Item -Path "$UserClassesRoot\SexFile\shell" -Force | Out-Null
    Set-ItemProperty -Path "$UserClassesRoot\SexFile\shell" -Name "(Default)" -Value "open"

    New-Item -Path "$UserClassesRoot\SexFile\shell\open" -Force | Out-Null
    Set-ItemProperty -Path "$UserClassesRoot\SexFile\shell\open" -Name "(Default)" -Value $MenuText

    New-Item -Path "$UserClassesRoot\SexFile\shell\open\command" -Force | Out-Null
    Set-ItemProperty -Path "$UserClassesRoot\SexFile\shell\open\command" -Name "(Default)" -Value "`"$FullPath`" `"%1`""

    # Menu contextuel pour fichiers
    New-Item -Path "$UserClassesRoot\*\shell\SexifyFile" -Force | Out-Null
    Set-ItemProperty -Path "$UserClassesRoot\*\shell\SexifyFile" -Name "(Default)" -Value $MenuText
    Set-ItemProperty -Path "$UserClassesRoot\*\shell\SexifyFile" -Name "Icon" -Value "$FullPath,0"
    New-Item -Path "$UserClassesRoot\*\shell\SexifyFile\command" -Force | Out-Null
    Set-ItemProperty -Path "$UserClassesRoot\*\shell\SexifyFile\command" -Name "(Default)" -Value "`"$FullPath`" `"%1`""

    # Menu contextuel pour dossiers
    New-Item -Path "$UserClassesRoot\Directory\shell\SexifyDirectory" -Force | Out-Null
    Set-ItemProperty -Path "$UserClassesRoot\Directory\shell\SexifyDirectory" -Name "(Default)" -Value $MenuText
    Set-ItemProperty -Path "$UserClassesRoot\Directory\shell\SexifyDirectory" -Name "Icon" -Value "$FullPath,0"
    New-Item -Path "$UserClassesRoot\Directory\shell\SexifyDirectory\command" -Force | Out-Null
    Set-ItemProperty -Path "$UserClassesRoot\Directory\shell\SexifyDirectory\command" -Name "(Default)" -Value "`"$FullPath`" `"%1`""

    # Si Windows 11 → tenter le hack "Position=Top"
    if ($IsWindows11) {
        Write-Host "Windows 11 detected — applying 'Position=Top' hack for main context menu..." -ForegroundColor Yellow
        Set-ItemProperty -Path "$UserClassesRoot\*\shell\SexifyFile" -Name "Position" -Value "Top"
        Set-ItemProperty -Path "$UserClassesRoot\Directory\shell\SexifyDirectory" -Name "Position" -Value "Top"
    }

    # Rafraîchir l'Explorateur
    Write-Host "Refreshing Windows Explorer..." -ForegroundColor Yellow
if (-not ("Shell32" -as [type])) {
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

    Write-Host "Installation completed successfully!" -ForegroundColor Green

Write-Host "Restarting Windows Explorer..." -ForegroundColor Yellow
Stop-Process -Name explorer -Force
Start-Process explorer.exe

} catch {
    Write-Error "Failed to register file association: $($_.Exception.Message)"
    exit 1
}

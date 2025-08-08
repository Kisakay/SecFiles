param(
    [Parameter(Mandatory=$true)]
    [string]$ExecutablePath,
    [string]$MenuText = "Sexify this file or directory"
)

if (-not (Test-Path $ExecutablePath)) {
    Write-Error "Executable not found at: $ExecutablePath"
    exit 1
}

$FullPath = (Resolve-Path $ExecutablePath).Path
Write-Host "Installing SEX file handler..." -ForegroundColor Green

try {
    $UserClassesRoot = "Registry::HKEY_CURRENT_USER\Software\Classes"
    
    # File association for .sex files
    New-Item -Path "$UserClassesRoot\.sex" -Force | Out-Null
    Set-ItemProperty -Path "$UserClassesRoot\.sex" -Name "(Default)" -Value "SexFile"
    
    New-Item -Path "$UserClassesRoot\SexFile" -Force | Out-Null
    Set-ItemProperty -Path "$UserClassesRoot\SexFile" -Name "(Default)" -Value "SEX File"
    
    New-Item -Path "$UserClassesRoot\SexFile\shell\open\command" -Force | Out-Null
    Set-ItemProperty -Path "$UserClassesRoot\SexFile\shell\open\command" -Name "(Default)" -Value "`"$FullPath`" `"%1`""
    
    # Context menu for files
    New-Item -Path "$UserClassesRoot\*\shell\SexifyFile" -Force | Out-Null
    Set-ItemProperty -Path "$UserClassesRoot\*\shell\SexifyFile" -Name "(Default)" -Value $MenuText
    New-Item -Path "$UserClassesRoot\*\shell\SexifyFile\command" -Force | Out-Null
    Set-ItemProperty -Path "$UserClassesRoot\*\shell\SexifyFile\command" -Name "(Default)" -Value "`"$FullPath`" `"%1`""
    
    # Context menu for directories
    New-Item -Path "$UserClassesRoot\Directory\shell\SexifyDirectory" -Force | Out-Null
    Set-ItemProperty -Path "$UserClassesRoot\Directory\shell\SexifyDirectory" -Name "(Default)" -Value $MenuText
    New-Item -Path "$UserClassesRoot\Directory\shell\SexifyDirectory\command" -Force | Out-Null
    Set-ItemProperty -Path "$UserClassesRoot\Directory\shell\SexifyDirectory\command" -Name "(Default)" -Value "`"$FullPath`" `"%1`""
    
    Write-Host "Installation completed successfully!" -ForegroundColor Green
    
} catch {
    Write-Error "Failed: $($_.Exception.Message)"
    exit 1
}

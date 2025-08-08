[Setup]
AppName=SexFiles
AppVersion=1.0
DefaultDirName={userappdata}\SexFiles
OutputDir=.
OutputBaseFilename=SexFilesInstaller
Compression=lzma
SolidCompression=yes
UninstallDisplayIcon={app}\sex-file-handler.exe

[Files]
Source: "sex-file-handler.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "scripts\simple_installer.ps1"; DestDir: "{app}"; DestName: "install.ps1"; Flags: ignoreversion
Source: "scripts\simple_uninstaller.ps1"; DestDir: "{app}"; DestName: "uninstaller.ps1"; Flags: ignoreversion

[Run]
; Exécution du script d'installation après l'installation
Filename: "powershell.exe"; \
    Parameters: "-ExecutionPolicy Bypass -File ""{app}\install.ps1"""; \
    StatusMsg: "Exécution du script d'installation..."; \
    Flags: runhidden runascurrentuser nowait

[UninstallRun]
; Exécution du script de désinstallation AVANT suppression des fichiers
Filename: "powershell.exe"; \
    Parameters: "-ExecutionPolicy Bypass -File ""{app}\uninstaller.ps1"""; \
    RunOnceId: "RunPS1OnUninstall"; \
    Flags: runhidden runascurrentuser

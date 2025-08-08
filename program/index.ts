// main.ts - Enhanced TypeScript application with sexsec encryption/decryption
import { readFileSync, existsSync, statSync, readdirSync, writeFileSync, unlinkSync } from 'fs';
import { basename, extname, resolve } from 'path';
import * as readline from 'readline';
import { sexsec } from 'sexsec';

class SexFileHandler {
    private rl: readline.Interface;

    constructor() {
        // Setup readline interface for user input
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // Get the path from command line arguments
        const targetPath = process.argv[2];

        if (!targetPath) {
            console.error('❌ No path provided');
            this.showUsage();
            this.pauseAndExit(1);
            return;
        }

        this.handlePath(targetPath);
    }

    private showUsage(): void {
        console.log('🔥 SEX File Handler - Secure Encryption Tool 🔥');
        console.log('Usage: sex-file-handler.exe <file_or_directory_path>');
        console.log('');
        console.log('Features:');
        console.log('  📁 Encrypt files/directories -> .sex format');
        console.log('  🔓 Decrypt .sex files with password');
        console.log('  📊 Analyze directory contents');
        console.log('');
        console.log('Examples:');
        console.log('  sex-file-handler.exe "document.txt"     # Encrypt to document.txt.sex');
        console.log('  sex-file-handler.exe "secret.pdf.sex"  # Decrypt to secret.pdf');
        console.log('  sex-file-handler.exe "C:\\my-folder"    # Encrypt entire directory');
    }

    private async handlePath(targetPath: string): Promise<void> {
        try {
            const resolvedPath = resolve(targetPath);

            // Check if path exists
            if (!existsSync(resolvedPath)) {
                console.error(`❌ Path not found: ${resolvedPath}`);
                await this.pauseAndExit(1);
                return;
            }

            // Get path statistics
            const stats = statSync(resolvedPath);

            if (stats.isFile()) {
                await this.handleFile(resolvedPath);
            } else if (stats.isDirectory()) {
                await this.handleDirectory(resolvedPath);
            } else {
                console.error(`❌ Unknown path type: ${resolvedPath}`);
                await this.pauseAndExit(1);
                return;
            }

        } catch (error) {
            console.error('❌ Error handling path:', error);
            await this.debugPause('Error in handlePath');
        } finally {
            await this.pauseAndExit(0);
        }
    }

    private async handleFile(filePath: string): Promise<void> {
        try {
            const fileName = basename(filePath);
            const fileExt = extname(filePath);

            if (fileExt.toLowerCase() === '.sex') {
                // This is an encrypted .sex file - decrypt it
                await this.decryptSexFile(filePath);
            } else {
                // This is a regular file - encrypt it
                await this.encryptFile(filePath);
            }
        } catch (error) {
            console.error('❌ Error in handleFile:', error);
            await this.debugPause('Error in handleFile');
        }
    }

    private async decryptSexFile(filePath: string): Promise<void> {
        console.log('🔓 DECRYPTING SEX FILE 🔓');
        console.log('═'.repeat(50));

        const fileName = basename(filePath);
        console.log(`🔒 Encrypted file: ${fileName}`);
        console.log(`📁 Path: ${filePath}`);

        try {
            const stats = statSync(filePath);
            console.log(`📊 Encrypted file size: ${this.formatFileSize(stats.size)}`);

            // Get password from user
            const password = await this.getPassword('🔑 Enter decryption password: ');

            if (!password) {
                console.log('❌ No password provided. Decryption cancelled.');
                return;
            }

            console.log('🔄 Setting decryption key...');
            sexsec.changeKey(password);

            console.log('🔄 Decrypting file...');

            // Use sexsec.decryptFile with the file path directly
            const decryptedFilePath = await sexsec.decryptFile(filePath);

            console.log('✅ File decrypted successfully!');
            console.log(`📄 Decrypted file: ${basename(decryptedFilePath)}`);
            console.log(`📁 Saved to: ${decryptedFilePath}`);

            // Ask if user wants to delete the encrypted file
            const deleteOriginal = await this.askYesNo('🗑️  Delete the encrypted .sex file? (y/N): ');
            if (deleteOriginal) {
                unlinkSync(filePath);
                console.log('✅ Encrypted file deleted');
            }

        } catch (error) {
            console.error('❌ Decryption failed:', (error as any).message);
            console.log('💡 Make sure you entered the correct password');
            await this.debugPause('Decryption error');
        }
    }

    private async encryptFile(filePath: string): Promise<void> {
        console.log('🔥 SEXIFYING FILE 🔥');
        console.log('═'.repeat(50));

        const fileName = basename(filePath);
        const fileExt = extname(filePath);

        console.log(`📄 File: ${fileName}`);
        console.log(`📁 Path: ${filePath}`);
        console.log(`🏷️  Extension: ${fileExt || 'none'}`);

        try {
            const stats = statSync(filePath);
            console.log(`📊 Size: ${this.formatFileSize(stats.size)}`);
            console.log(`📅 Modified: ${stats.mtime.toLocaleString()}`);

            // Get password from user
            const password = await this.getPassword('🔑 Enter encryption password: ');

            if (!password) {
                console.log('❌ No password provided. Encryption cancelled.');
                return;
            }

            // Confirm password
            const confirmPassword = await this.getPassword('🔑 Confirm password: ');

            if (password !== confirmPassword) {
                console.log('❌ Passwords do not match. Encryption cancelled.');
                return;
            }

            console.log('🔄 Setting encryption key...');
            sexsec.changeKey(password);

            console.log('🔄 Encrypting file...');

            // Use sexsec.encryptFile with the file path directly
            const encryptedFilePath = await sexsec.encryptFile(filePath);

            console.log('✅ File encrypted successfully!');
            console.log(`🔒 Encrypted file: ${basename(encryptedFilePath)}`);
            console.log(`📁 Saved to: ${encryptedFilePath}`);

            // Ask if user wants to delete the original file
            const deleteOriginal = await this.askYesNo('🗑️  Delete the original unencrypted file? (y/N): ');
            if (deleteOriginal) {
                unlinkSync(filePath);
                console.log('✅ Original file deleted');
            }

        } catch (error) {
            console.error('❌ Encryption failed:', error);
            await this.debugPause('Encryption error');
        }
    }

    private async handleDirectory(dirPath: string): Promise<void> {
        console.log('🔥 SEXIFYING DIRECTORY 🔥');
        console.log('═'.repeat(50));

        const dirName = basename(dirPath);

        console.log(`📂 Directory: ${dirName}`);
        console.log(`📁 Path: ${dirPath}`);

        try {
            const items = readdirSync(dirPath);
            console.log(`📊 Items count: ${items.length}`);

            // Count different file types
            const stats = this.analyzeDirectory(dirPath, items);

            console.log('\n📈 Directory Analysis:');
            console.log(`  📁 Subdirectories: ${stats.directories}`);
            console.log(`  📄 Files: ${stats.files}`);
            console.log(`  🔒 .sex files: ${stats.sexFiles}`);
            console.log(`  💾 Total size: ${this.formatFileSize(stats.totalSize)}`);

            if (stats.sexFiles > 0) {
                console.log('\n🔒 Found encrypted SEX files:');
                stats.sexFilesList.forEach(file => {
                    console.log(`  • ${file}`);
                });
            }

            // Ask what to do with the directory
            console.log('\n🔧 Directory Processing Options:');
            console.log('1. Encrypt all files in directory');
            console.log('2. Decrypt all .sex files in directory');
            console.log('3. Just analyze (no changes)');

            const choice = await this.getInput('Choose option (1-3): ');

            switch (choice.trim()) {
                case '1':
                    await this.encryptDirectory(dirPath, items);
                    break;
                case '2':
                    await this.decryptDirectory(dirPath, stats.sexFilesList);
                    break;
                case '3':
                default:
                    console.log('📊 Analysis complete - no changes made');
                    break;
            }

        } catch (error) {
            console.error('❌ Error reading directory:', error);
            await this.debugPause('Directory handling error');
        }
    }

    private async encryptDirectory(dirPath: string, items: string[]): Promise<void> {
        try {
            const regularFiles = items.filter(item => {
                const itemPath = resolve(dirPath, item);
                return statSync(itemPath).isFile() && !item.toLowerCase().endsWith('.sex');
            });

            if (regularFiles.length === 0) {
                console.log('ℹ️  No regular files found to encrypt');
                return;
            }

            console.log(`\n🔄 Found ${regularFiles.length} files to encrypt:`);
            regularFiles.forEach(file => console.log(`  • ${file}`));

            const proceed = await this.askYesNo('\n🔑 Proceed with encryption? (y/N): ');
            if (!proceed) {
                console.log('❌ Encryption cancelled');
                return;
            }

            // Get password once for all files
            const password = await this.getPassword('🔑 Enter encryption password for all files: ');
            if (!password) {
                console.log('❌ No password provided. Encryption cancelled.');
                return;
            }

            // Ask if user wants to delete original files after encryption
            const deleteOriginals = await this.askYesNo('🗑️  Delete original files after encryption? (y/N): ');

            console.log('🔄 Setting encryption key...');
            sexsec.changeKey(password);
            
            console.log('🔄 Encrypting directory...');
            await sexsec.encryptDir(dirPath, deleteOriginals);
            
            console.log('✅ Directory encryption completed!');
            if (deleteOriginals) {
                console.log('🗑️  Original files have been deleted');
            }

        } catch (error) {
            console.error('❌ Directory encryption failed:', error);
            await this.debugPause('Directory encryption error');
        }
    }

    private async decryptDirectory(dirPath: string, sexFiles: string[]): Promise<void> {
        try {
            if (sexFiles.length === 0) {
                console.log('ℹ️  No .sex files found to decrypt');
                return;
            }

            console.log(`\n🔓 Found ${sexFiles.length} encrypted files:`);
            sexFiles.forEach(file => console.log(`  • ${file}`));

            const proceed = await this.askYesNo('\n🔑 Proceed with decryption? (y/N): ');
            if (!proceed) {
                console.log('❌ Decryption cancelled');
                return;
            }

            const password = await this.getPassword('🔑 Enter decryption password for all files: ');
            if (!password) {
                console.log('❌ No password provided. Decryption cancelled.');
                return;
            }

            // Ask if user wants to delete encrypted files after decryption
            const deleteEncrypted = await this.askYesNo('🗑️  Delete encrypted .sex files after decryption? (y/N): ');

            console.log('🔄 Setting decryption key...');
            sexsec.changeKey(password);
            
            console.log('🔄 Decrypting directory...');
            await sexsec.decryptDir(dirPath, deleteEncrypted);
            
            console.log('✅ Directory decryption completed!');
            if (deleteEncrypted) {
                console.log('🗑️  Encrypted .sex files have been deleted');
            }

        } catch (error) {
            console.error('❌ Directory decryption failed:', error);
            await this.debugPause('Directory decryption error');
        }
    }

    private analyzeDirectory(dirPath: string, items: string[]): {
        directories: number;
        files: number;
        sexFiles: number;
        sexFilesList: string[];
        totalSize: number;
    } {
        let directories = 0;
        let files = 0;
        let sexFiles = 0;
        let totalSize = 0;
        const sexFilesList: string[] = [];

        items.forEach(item => {
            try {
                const itemPath = resolve(dirPath, item);
                const stats = statSync(itemPath);

                if (stats.isDirectory()) {
                    directories++;
                } else if (stats.isFile()) {
                    files++;
                    totalSize += stats.size;

                    if (extname(item).toLowerCase() === '.sex') {
                        sexFiles++;
                        sexFilesList.push(item);
                    }
                }
            } catch (error) {
                // Skip items that can't be accessed
                console.log(`⚠️  Warning: Could not access ${item}`);
            }
        });

        return { directories, files, sexFiles, sexFilesList, totalSize };
    }

    private formatFileSize(bytes: number): string {
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }

    // Utility functions for user input using only readline
    private async getPassword(prompt: string): Promise<string> {
        return new Promise((resolve) => {
            // For compiled executable, readline should handle password input
            // In a real terminal, you might want to use a library like 'read' for hidden input
            console.log('📝 Note: Password will be visible while typing');
            this.rl.question(prompt, (password) => {
                resolve(password.trim());
            });
        });
    }

    private async getInput(prompt: string): Promise<string> {
        return new Promise((resolve) => {
            this.rl.question(prompt, (answer) => {
                resolve(answer.trim());
            });
        });
    }

    private async askYesNo(prompt: string): Promise<boolean> {
        const answer = await this.getInput(prompt);
        return answer.toLowerCase().startsWith('y');
    }

    // Debug and pause functions
    private async debugPause(context: string): Promise<void> {
        console.log(`\n🐛 DEBUG: Error occurred in ${context}`);
        console.log('📊 Current process info:');
        console.log(`  - Working directory: ${process.cwd()}`);
        console.log(`  - Node version: ${process.version}`);
        console.log(`  - Platform: ${process.platform}`);
        
        const continueDebug = await this.askYesNo('🔍 Continue with debug info? (y/N): ');
        if (continueDebug) {
            console.log('📋 Environment variables:');
            console.log(`  - PATH exists: ${!!process.env.PATH}`);
            console.log(`  - HOME/USERPROFILE: ${process.env.HOME || process.env.USERPROFILE}`);
        }

        await this.getInput('\n⏸️  Press Enter to continue...');
    }

    private async pauseAndExit(exitCode: number = 0): Promise<void> {
        console.log('\n' + '═'.repeat(50));
        
        if (exitCode === 0) {
            console.log('✨ Operation completed! ✨');
        } else {
            console.log('❌ Operation failed!');
        }
        
        await this.getInput('\n⏸️  Press Enter to exit...');
        
        this.rl.close();
        process.exit(exitCode);
    }
}

// Initialize the application
new SexFileHandler();
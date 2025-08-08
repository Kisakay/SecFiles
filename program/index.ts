// main.ts - Enhanced TypeScript application to handle files and directories
import { readFileSync, existsSync, statSync, readdirSync } from 'fs';
import { basename, extname, resolve } from 'path';

class SexFileHandler {
    constructor() {
        // Get the path from command line arguments
        const targetPath = process.argv[2];
        
        if (!targetPath) {
            console.error('❌ No path provided');
            this.showUsage();
            process.exit(1);
        }
        
        this.handlePath(targetPath);
    }
    
    private showUsage(): void {
        console.log('Usage: sex-file-handler.exe <file_or_directory_path>');
        console.log('');
        console.log('Examples:');
        console.log('  sex-file-handler.exe "C:\\path\\to\\file.sex"');
        console.log('  sex-file-handler.exe "C:\\path\\to\\directory"');
        console.log('  sex-file-handler.exe "D:\\"');
    }
    
    private handlePath(targetPath: string): void {
        try {
            const resolvedPath = resolve(targetPath);
            
            // Check if path exists
            if (!existsSync(resolvedPath)) {
                console.error(`❌ Path not found: ${resolvedPath}`);
                return;
            }
            
            // Get path statistics
            const stats = statSync(resolvedPath);
            
            if (stats.isFile()) {
                this.handleFile(resolvedPath);
            } else if (stats.isDirectory()) {
                this.handleDirectory(resolvedPath);
            } else {
                console.error(`❌ Unknown path type: ${resolvedPath}`);
            }
            
        } catch (error) {
            console.error('❌ Error handling path:', error);
        }
    }
    
    private handleFile(filePath: string): void {
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
            
            // Special handling for .sex files
            if (fileExt.toLowerCase() === '.sex') {
                console.log('💖 This is a SEX file! Reading content...');
                const content = readFileSync(filePath, 'utf-8');
                this.processSexFileContent(content, filePath);
            } else {
                console.log('📝 Regular file detected');
                // Add your custom logic for other file types
                this.processRegularFile(filePath);
            }
            
        } catch (error) {
            console.error('❌ Error reading file:', error);
        }
        
        this.waitForExit();
    }
    
    private handleDirectory(dirPath: string): void {
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
            console.log(`  💖 .sex files: ${stats.sexFiles}`);
            console.log(`  💾 Total size: ${this.formatFileSize(stats.totalSize)}`);
            
            if (stats.sexFiles > 0) {
                console.log('\n💖 Found SEX files:');
                stats.sexFilesList.forEach(file => {
                    console.log(`  • ${file}`);
                });
            }
            
            // Add your custom directory processing logic here
            this.processDirectory(dirPath, items);
            
        } catch (error) {
            console.error('❌ Error reading directory:', error);
        }
        
        this.waitForExit();
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
            }
        });
        
        return { directories, files, sexFiles, sexFilesList, totalSize };
    }
    
    private processSexFileContent(content: string, filePath: string): void {
        console.log('\n💖 SEX File Content Analysis:');
        console.log(`📏 Content length: ${content.length} characters`);
        console.log(`📊 Lines: ${content.split('\n').length}`);
        
        // Show preview
        console.log('\n📖 Content preview:');
        const preview = content.substring(0, 300);
        console.log(preview + (content.length > 300 ? '...' : ''));
        
        // Add your custom .sex file processing logic here
        // For example:
        // - Parse specific format
        // - Extract metadata
        // - Process encryption
        // - etc.
    }
    
    private processRegularFile(filePath: string): void {
        console.log('\n🔧 Processing regular file...');
        
        // Add your custom logic for non-.sex files
        // For example:
        // - Convert to .sex format
        // - Analyze content
        // - Apply transformations
        // etc.
        
        console.log('✨ File processing completed');
    }
    
    private processDirectory(dirPath: string, items: string[]): void {
        console.log('\n🔧 Processing directory...');
        
        // Add your custom directory processing logic here
        // For example:
        // - Batch process all files
        // - Search for specific patterns
        // - Create reports
        // - etc.
        
        console.log('✨ Directory processing completed');
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
    
    private waitForExit(): void {
        console.log('\n' + '═'.repeat(50));
        console.log('✨ Sexification complete! ✨');
        console.log('\nPress any key to exit...');
        
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', () => process.exit(0));
    }
}

// Initialize the application
new SexFileHandler();
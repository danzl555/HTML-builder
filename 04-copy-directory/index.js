const fs = require('fs').promises;
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    // Remove existing files-copy directory if it exists
    await fs.rm(targetDir, { recursive: true, force: true });
    
    // Create new files-copy directory
    await fs.mkdir(targetDir, { recursive: true });
    
    // Read contents of source directory
    const files = await fs.readdir(sourceDir);
    
    // Copy each file
    for (const file of files) {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);
      await fs.copyFile(sourcePath, targetPath);
    }
    
    console.log('Directory copied successfully!');
  } catch (error) {
    console.error('Error copying directory:', error);
  }
}

copyDir();
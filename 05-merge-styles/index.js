const fs = require('fs').promises;
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');

async function buildCSSBundle() {
  try {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    // Read all files in styles directory
    const files = await fs.readdir(stylesDir);
    
    // Filter CSS files and read their contents
    const cssPromises = files
      .filter(file => path.extname(file).toLowerCase() === '.css')
      .map(file => fs.readFile(path.join(stylesDir, file), 'utf8'));
    
    const cssContents = await Promise.all(cssPromises);
    
    // Combine all CSS content
    const bundleContent = cssContents.join('\n');
    
    // Write to bundle.css
    await fs.writeFile(outputFile, bundleContent);
    
    console.log('CSS bundle created successfully!');
  } catch (error) {
    console.error('Error building CSS bundle:', error);
  }
}

buildCSSBundle();
const fs = require('fs').promises;
const path = require('path');

const sourceDir = path.join(__dirname);
const outputDir = path.join(__dirname, 'project-dist');
const templateFile = path.join(sourceDir, 'template.html');
const stylesDir = path.join(sourceDir, 'styles');
const componentsDir = path.join(sourceDir, 'components');
const assetsDir = path.join(sourceDir, 'assets');

async function buildPage() {
  try {
    // Create output directory
    await fs.mkdir(outputDir, { recursive: true });

    // Read and process template
    let templateContent = await fs.readFile(templateFile, 'utf8');
    const componentTags = templateContent.match(/{{(.*?)}}/g) || [];

    for (const tag of componentTags) {
      const componentName = tag.slice(2, -2);
      const componentPath = path.join(componentsDir, `${componentName}.html`);
      try {
        const componentContent = await fs.readFile(componentPath, 'utf8');
        templateContent = templateContent.replace(tag, componentContent);
      } catch (error) {
        console.error(`Error reading component ${componentName}:`, error);
      }
    }

    // Write processed HTML
    await fs.writeFile(path.join(outputDir, 'index.html'), templateContent);

    // Build CSS bundle
    const cssFiles = await fs.readdir(stylesDir);
    const cssContents = await Promise.all(
      cssFiles
        .filter(file => path.extname(file).toLowerCase() === '.css')
        .map(file => fs.readFile(path.join(stylesDir, file), 'utf8'))
    );
    await fs.writeFile(path.join(outputDir, 'style.css'), cssContents.join('\n'));

    // Copy assets
    await copyDir(assetsDir, path.join(outputDir, 'assets'));

    console.log('Page built successfully!');
  } catch (error) {
    console.error('Error building page:', error);
  }
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

buildPage();
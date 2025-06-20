#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔍 Checking asset references in markdown files...\n');

// Get all markdown files in docs directory
const markdownFiles = glob.sync('docs/**/*.md');
let totalErrors = 0;
let totalChecked = 0;

// Function to check if a file exists
function checkAssetExists(assetPath, markdownFile, lineNumber, originalPath) {
  const fullPath = path.resolve(assetPath);
  totalChecked++;
  
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ ${markdownFile}:${lineNumber} - Asset not found: ${originalPath}`);
    console.log(`   Expected: ${fullPath}`);
    totalErrors++;
    return false;
  } else {
    console.log(`✅ ${originalPath} (found)`);
    return true;
  }
}

// Process each markdown file
markdownFiles.forEach(file => {
  console.log(`\n📄 Checking ${file}:`);
  
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    
    // Check for image references: ![alt](path) or ![alt](path "title")
    const imageMatches = line.matchAll(/!\[[^\]]*\]\(([^)"\s]+)(?:\s+"[^"]*")?\)/g);
    for (const match of imageMatches) {
      let imagePath = match[1];
      
      // Skip external URLs
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        console.log(`🌐 ${imagePath} (external URL - skipped)`);
        continue;
      }
      
      // Convert relative paths to absolute paths
      if (imagePath.startsWith('./') || imagePath.startsWith('../')) {
        // Relative to the markdown file
        const markdownDir = path.dirname(file);
        imagePath = path.resolve(markdownDir, imagePath);
      } else if (imagePath.startsWith('/img/')) {
        // Docusaurus static asset (absolute path style)
        imagePath = path.resolve('static', imagePath.substring(1));
      } else if (imagePath.startsWith('img/')) {
        // Docusaurus static asset (relative style)
        imagePath = path.resolve('static', imagePath);
      } else if (imagePath.startsWith('/')) {
        // Other absolute path from project root
        imagePath = path.resolve('.' + imagePath);
      } else {
        // Assume it's relative to static directory
        imagePath = path.resolve('static/img', imagePath);
      }
      
      checkAssetExists(imagePath, file, lineNumber, match[1]);
    }
    
    // Check for link references to other markdown files: [text](path.md)
    const linkMatches = line.matchAll(/\[[^\]]*\]\(([^)#\s]+\.md)(?:#[^)]*)?\)/g);
    for (const match of linkMatches) {
      let linkPath = match[1];
      
      // Skip external URLs
      if (linkPath.startsWith('http://') || linkPath.startsWith('https://')) {
        continue;
      }
      
      // Convert to docs directory path
      if (linkPath.startsWith('./') || linkPath.startsWith('../')) {
        const markdownDir = path.dirname(file);
        linkPath = path.resolve(markdownDir, linkPath);
      } else if (linkPath.startsWith('/')) {
        linkPath = path.resolve('docs' + linkPath);
      } else {
        linkPath = path.resolve('docs', linkPath);
      }
      
      checkAssetExists(linkPath, file, lineNumber, match[1]);
    }
  });
});

console.log(`\n📊 Summary:`);
console.log(`   Total assets checked: ${totalChecked}`);
console.log(`   Errors found: ${totalErrors}`);

if (totalErrors > 0) {
  console.log(`\n❌ Asset check failed with ${totalErrors} errors.`);
  process.exit(1);
} else {
  console.log(`\n✅ All asset references are valid!`);
  process.exit(0);
}

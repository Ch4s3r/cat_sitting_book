#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔗 Checking internal markdown links...\n');

// Get all markdown files in docs directory
const markdownFiles = glob.sync('docs/**/*.md');
let totalErrors = 0;
let totalChecked = 0;

// Get list of available markdown files (without extension for Docusaurus routing)
const availablePages = markdownFiles.map(file => {
  const relativePath = path.relative('docs', file);
  return relativePath.replace(/\.md$/, '');
});

console.log('📚 Available pages:', availablePages.join(', '));

// Process each markdown file
markdownFiles.forEach(file => {
  console.log(`\n📄 Checking ${file}:`);
  
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    
    // Check for internal markdown links: [text](page) or [text](./page) or [text](../page)
    const linkMatches = line.matchAll(/\[[^\]]*\]\(([^)#\s]+?)(?:#[^)]*)?\)/g);
    for (const match of linkMatches) {
      let linkPath = match[1];
      
      // Skip external URLs and non-markdown links
      if (linkPath.startsWith('http://') || 
          linkPath.startsWith('https://') || 
          linkPath.startsWith('mailto:') || 
          linkPath.startsWith('tel:') ||
          linkPath.startsWith('/img/') ||
          linkPath.startsWith('img/') ||
          linkPath.includes('.jpg') ||
          linkPath.includes('.png') ||
          linkPath.includes('.gif') ||
          linkPath.includes('.svg')) {
        continue;
      }
      
      totalChecked++;
      
      // Convert to page identifier for Docusaurus
      let pageId = linkPath;
      
      // Handle relative paths
      if (linkPath.startsWith('./')) {
        pageId = linkPath.substring(2);
      } else if (linkPath.startsWith('../')) {
        // Handle going up directories
        const currentDir = path.dirname(path.relative('docs', file));
        const resolvedPath = path.resolve('docs', currentDir, linkPath);
        pageId = path.relative('docs', resolvedPath);
      }
      
      // Remove .md extension if present
      pageId = pageId.replace(/\.md$/, '');
      
      // Check if the page exists
      if (availablePages.includes(pageId)) {
        console.log(`✅ ${linkPath} → ${pageId} (found)`);
      } else {
        console.log(`❌ ${file}:${lineNumber} - Page not found: ${linkPath} → ${pageId}`);
        console.log(`   Available pages: ${availablePages.join(', ')}`);
        totalErrors++;
      }
    }
  });
});

console.log(`\n📊 Summary:`);
console.log(`   Total internal links checked: ${totalChecked}`);
console.log(`   Errors found: ${totalErrors}`);

if (totalErrors > 0) {
  console.log(`\n❌ Internal link check failed with ${totalErrors} errors.`);
  process.exit(1);
} else {
  console.log(`\n✅ All internal links are valid!`);
  process.exit(0);
}

// Simple build validation script
console.log('🔍 Checking for common build issues...');

const fs = require('fs');
const path = require('path');

// Check for @github/spark imports
function checkForSparkImports() {
  const srcDir = path.join(__dirname, 'src');
  
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    const issues = [];
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        issues.push(...scanDirectory(filePath));
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('@github/spark')) {
          const lines = content.split('\n');
          lines.forEach((line, index) => {
            if (line.includes('@github/spark')) {
              issues.push({
                file: path.relative(__dirname, filePath),
                line: index + 1,
                content: line.trim()
              });
            }
          });
        }
      }
    });
    
    return issues;
  }
  
  return scanDirectory(srcDir);
}

// Check for missing dependencies
function checkDependencies() {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  const issues = [];
  
  // Check if @github/spark is still in dependencies (it shouldn't be)
  if (packageJson.dependencies && packageJson.dependencies['@github/spark']) {
    issues.push('@github/spark found in package.json dependencies - should be removed');
  }
  
  return issues;
}

// Run checks
console.log('📋 Checking for @github/spark imports...');
const sparkImports = checkForSparkImports();
if (sparkImports.length === 0) {
  console.log('✅ No @github/spark imports found');
} else {
  console.log('❌ Found @github/spark imports:');
  sparkImports.forEach(issue => {
    console.log(`   ${issue.file}:${issue.line} - ${issue.content}`);
  });
}

console.log('📋 Checking dependencies...');
const depIssues = checkDependencies();
if (depIssues.length === 0) {
  console.log('✅ No dependency issues found');
} else {
  console.log('❌ Dependency issues:');
  depIssues.forEach(issue => {
    console.log(`   ${issue}`);
  });
}

const totalIssues = sparkImports.length + depIssues.length;
if (totalIssues === 0) {
  console.log('\n🎉 Build check passed! No issues found.');
  process.exit(0);
} else {
  console.log(`\n⚠️  Found ${totalIssues} issue(s) that may prevent build.`);
  process.exit(1);
}
#!/usr/bin/env node

/**
 * Environment Configuration Validation Script
 * 
 * This script validates that environment variables are properly configured
 * for different deployment scenarios.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateEnvironment() {
  log('\n🔍 NDVI Vision Environment Configuration Validation\n', 'bold');
  
  let hasErrors = false;
  let warnings = 0;
  
  // Get the project root directory (go up from scripts/ to project root)
  const projectRoot = path.resolve(__dirname, '..');
  
  // Check if running in different contexts
  const context = {
    isCI: process.env.CI === 'true',
    isGitHubActions: process.env.GITHUB_ACTIONS === 'true',
    nodeEnv: process.env.NODE_ENV,
    mode: process.env.MODE,
    projectRoot
  };
  
  log(`📋 Context Information:`, 'blue');
  log(`   CI Environment: ${context.isCI ? 'Yes' : 'No'}`);
  log(`   GitHub Actions: ${context.isGitHubActions ? 'Yes' : 'No'}`);
  log(`   NODE_ENV: ${context.nodeEnv || 'undefined'}`);
  log(`   MODE: ${context.mode || 'undefined'}`);
  log(`   Project Root: ${context.projectRoot}\n`);
  
  // Check for required environment variables
  const requiredEnvVars = ['VITE_BACKEND_URL'];
  const optionalEnvVars = ['VITE_API_KEY']; // API key no longer required
  
  log('🔧 Environment Variables Check:', 'blue');
  
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    
    if (!value) {
      if (context.isCI || context.isGitHubActions) {
        log(`   ❌ ${varName}: Missing (Required in CI/CD)`, 'red');
        hasErrors = true;
      } else {
        log(`   ⚠️  ${varName}: Missing (Will use fallback)`, 'yellow');
        warnings++;
      }
    } else {
      const displayValue = varName.includes('KEY') || varName.includes('SECRET') 
        ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
        : value;
      log(`   ✅ ${varName}: ${displayValue}`, 'green');
    }
  });
  
  // Check optional environment variables
  optionalEnvVars.forEach(varName => {
    const value = process.env[varName];
    
    if (!value) {
      log(`   ℹ️  ${varName}: Not set (Optional - API key no longer required)`, 'blue');
    } else {
      const displayValue = varName.includes('KEY') || varName.includes('SECRET') 
        ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
        : value;
      log(`   ✅ ${varName}: ${displayValue}`, 'green');
    }
  });
  
  // Check for .env file in development
  const envFilePath = path.join(context.projectRoot, '.env');
  const hasEnvFile = fs.existsSync(envFilePath);
  
  log('\n📄 Local Configuration Files:', 'blue');
  
  if (hasEnvFile) {
    log('   ✅ .env file found', 'green');
    
    // Parse .env file and check contents
    try {
      const envContent = fs.readFileSync(envFilePath, 'utf8');
      const envLines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
      
      log('   📝 .env file contents:');
      envLines.forEach(line => {
        const [key, value] = line.split('=', 2);
        if (key && value) {
          const displayValue = key.includes('KEY') || key.includes('SECRET')
            ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
            : value;
          log(`      ${key}=${displayValue}`);
        }
      });
    } catch (error) {
      log('   ⚠️  Could not read .env file', 'yellow');
      warnings++;
    }
  } else {
    if (context.isCI || context.isGitHubActions) {
      log('   ✅ No .env file (Good for CI/CD)', 'green');
    } else {
      log('   ⚠️  No .env file found (Consider creating one for development)', 'yellow');
      warnings++;
    }
  }
  
  // Check GitHub Actions workflow file
  const workflowPath = path.join(context.projectRoot, '.github', 'workflows', 'deploy.yml');
  const hasWorkflow = fs.existsSync(workflowPath);
  
  log('\n🚀 Deployment Configuration:', 'blue');
  
  if (hasWorkflow) {
    log('   ✅ GitHub Actions workflow found', 'green');
    
    try {
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');
      
      // Check if workflow uses secrets
      const usesBackendUrl = workflowContent.includes('secrets.VITE_BACKEND_URL');
      
      if (usesBackendUrl) {
        log('   ✅ Workflow properly configured to use backend URL secret', 'green');
      } else {
        log('   ❌ Workflow missing VITE_BACKEND_URL secret reference', 'red');
        hasErrors = true;
      }
      
      // Check if workflow runs tests
      const runsTests = workflowContent.includes('npm test') || workflowContent.includes('EnvironmentConfig.test');
      if (runsTests) {
        log('   ✅ Workflow includes environment configuration tests', 'green');
      } else {
        log('   ⚠️  Workflow should include environment configuration tests', 'yellow');
        warnings++;
      }
      
    } catch (error) {
      log('   ⚠️  Could not analyze workflow file', 'yellow');
      warnings++;
    }
  } else {
    log('   ⚠️  No GitHub Actions workflow found', 'yellow');
    warnings++;
  }
  
  // Check test files
  const testFilePath = path.join(context.projectRoot, 'src', 'tests', 'EnvironmentConfig.test.tsx');
  const hasTests = fs.existsSync(testFilePath);
  
  log('\n🧪 Testing Configuration:', 'blue');
  
  if (hasTests) {
    log('   ✅ Environment configuration tests found', 'green');
  } else {
    log('   ❌ Environment configuration tests missing', 'red');
    hasErrors = true;
  }
  
  // Validation for different deployment scenarios
  log('\n🏗️  Deployment Scenario Analysis:', 'blue');
  
  if (context.isGitHubActions) {
    log('   📦 GitHub Pages Deployment Mode', 'blue');
    
    if (!process.env.VITE_BACKEND_URL) {
      log('   ❌ Missing required VITE_BACKEND_URL secret for GitHub Pages deployment', 'red');
      log('   💡 Add VITE_BACKEND_URL as repository secret', 'yellow');
      hasErrors = true;
    } else {
      log('   ✅ GitHub Pages deployment configuration is valid', 'green');
      if (!process.env.VITE_API_KEY) {
        log('   ℹ️  No API key configured (not required for this backend)', 'blue');
      }
    }
  } else if (hasEnvFile) {
    log('   🛠️  Local Development Mode', 'blue');
    log('   ✅ Using .env file for configuration', 'green');
  } else {
    log('   🔧 Manual Configuration Mode', 'blue');
    log('   💡 Application will use manual configuration through Settings panel', 'yellow');
  }
  
  // Summary
  log('\n📊 Validation Summary:', 'bold');
  
  if (hasErrors) {
    log(`   ❌ ${hasErrors ? 'FAILED' : 'PASSED'} - Found critical configuration issues`, 'red');
    log('   🔧 Please address the errors above before deploying', 'yellow');
  } else {
    log('   ✅ PASSED - Environment configuration is valid', 'green');
    if (warnings > 0) {
      log(`   ⚠️  ${warnings} warning(s) - See recommendations above`, 'yellow');
    }
  }
  
  log('');
  
  // Exit with appropriate code
  process.exit(hasErrors ? 1 : 0);
}

// Run validation
validateEnvironment();
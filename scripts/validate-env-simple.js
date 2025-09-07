#!/usr/bin/env node

/**
 * Simplified Environment Configuration Validation Script
 * 
 * This script validates that environment variables are properly configured
 * for GitHub Pages deployment.
 */

import process from 'process';

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
  
  // Check if running in GitHub Actions
  const isCI = process.env.CI === 'true';
  const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
  
  log(`📋 Context Information:`, 'blue');
  log(`   CI Environment: ${isCI ? 'Yes' : 'No'}`);
  log(`   GitHub Actions: ${isGitHubActions ? 'Yes' : 'No'}\n`);
  
  // Check for required environment variables
  log('🔧 Environment Variables Check:', 'blue');
  
  const backendUrl = process.env.VITE_BACKEND_URL;
  
  if (!backendUrl) {
    log('   ❌ VITE_BACKEND_URL: Missing', 'red');
    hasErrors = true;
  } else {
    try {
      new URL(backendUrl);
      log(`   ✅ VITE_BACKEND_URL: ${backendUrl}`, 'green');
    } catch (error) {
      log(`   ❌ VITE_BACKEND_URL: Invalid URL format: ${backendUrl}`, 'red');
      hasErrors = true;
    }
  }
  
  const apiKey = process.env.VITE_API_KEY;
  if (!apiKey) {
    log('   ℹ️  VITE_API_KEY: Not set (Optional)', 'blue');
  } else {
    log('   ✅ VITE_API_KEY: Set', 'green');
  }
  
  // Summary
  log('\n📊 Validation Summary:', 'bold');
  
  if (hasErrors) {
    log('   ❌ FAILED - Found critical configuration issues', 'red');
    log('   🔧 Please set VITE_BACKEND_URL in repository secrets', 'yellow');
  } else {
    log('   ✅ PASSED - Environment configuration is valid', 'green');
  }
  
  log('');
  
  // Exit with appropriate code
  process.exit(hasErrors ? 1 : 0);
}

// Run validation
try {
  validateEnvironment();
} catch (error) {
  console.error('❌ Validation failed with error:', error.message);
  process.exit(1);
}
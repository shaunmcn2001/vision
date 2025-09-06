# Environment Configuration Testing

This document explains the automated testing system for environment variable configuration in the NDVI Vision application.

## Overview

The application includes comprehensive testing for environment variable configuration to ensure:
- Proper setup for GitHub Pages deployment
- Security best practices
- Reliable configuration validation

## Test Files

### `src/tests/env.test.ts`
Contains unit tests for environment variable validation including:
- Required variable presence checks
- URL format validation  
- API key format validation
- Security checks for hardcoded values
- Fallback behavior testing

### `src/hooks/useEnvConfig.ts`
Provides runtime environment configuration with:
- Live validation of environment variables
- Configuration status reporting
- Warning detection for common issues
- Fallback handling for missing values

### `src/components/EnvStatus.tsx`
Visual component that displays:
- Current configuration status
- Validation errors and warnings
- Setup instructions for GitHub secrets
- Environment information

## GitHub Actions Workflow

The `.github/workflows/env-tests.yml` workflow automatically:

### Environment Validation
- Runs tests with actual environment variables from GitHub secrets
- Validates build process with secrets injection
- Ensures no secrets leak into built assets

### Security Scanning
- Scans source code for hardcoded secrets
- Validates proper environment variable usage patterns
- Checks for browser compatibility issues

### Deployment Testing  
- Tests static deployment readiness
- Validates the built application loads correctly
- Confirms environment variables work in production

## Running Tests Locally

### Install Dependencies
```bash
npm install
```

### Run Environment Tests
```bash
npm run test:env
```

### Run All Tests
```bash
npm test
```

### Test Build Process
```bash
npm run build
```

## GitHub Secrets Setup

For automated testing and deployment, configure these repository secrets:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**  
3. Add the following repository secrets:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `VITE_BACKEND_URL` | Your API backend URL | `https://api.yoursite.com` |
| `VITE_API_KEY` | Your API authentication key | `sk-1234567890abcdef` |

## Test Coverage

The testing system validates:

### ✅ Required Configuration
- `VITE_BACKEND_URL` is defined and valid
- `VITE_API_KEY` is defined and secure
- Variables follow expected formats

### ✅ Security Checks  
- No hardcoded secrets in source code
- Only VITE_ prefixed variables used in browser code
- No process.env usage in frontend code
- No secrets exposed in build artifacts

### ✅ Deployment Readiness
- Build process completes successfully
- Static files serve correctly
- Environment variables inject properly
- No development URLs in production

### ✅ Error Handling
- Graceful fallbacks for missing variables
- Clear error messages for configuration issues
- Runtime validation and warnings

## Common Issues and Solutions

### Missing Environment Variables
**Problem**: Tests fail because environment variables aren't set
**Solution**: Configure GitHub repository secrets as described above

### Hardcoded Secrets Detected
**Problem**: Security scan finds potential secrets in source code  
**Solution**: Move sensitive values to environment variables

### Build Artifacts Contain Secrets
**Problem**: Environment variables appear in built files
**Solution**: Ensure secrets are processed at build time, not embedded as strings

### Invalid URL Format
**Problem**: `VITE_BACKEND_URL` doesn't parse as valid URL
**Solution**: Use complete URLs with protocol (https://example.com)

## Continuous Integration

The environment tests run automatically on:
- Every push to main/develop branches
- All pull requests to main branch  
- Multiple Node.js versions (18.x, 20.x)

This ensures environment configuration remains valid as the codebase evolves.

## Monitoring

The application includes runtime monitoring of environment configuration:
- Visual status indicators in the settings panel
- Automatic validation on startup
- Warning notifications for configuration issues
- Debug information in development mode
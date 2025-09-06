/**
 * Environment Setup Utility
 * 
 * Provides utilities for validating and troubleshooting environment
 * variable configuration in different deployment scenarios.
 */

export interface EnvCheckResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  status: 'success' | 'warning' | 'error';
}

export class EnvSetupHelper {
  /**
   * Perform comprehensive environment validation
   */
  static validateEnvironment(): EnvCheckResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const apiKey = import.meta.env.VITE_API_KEY;
    const isProd = import.meta.env.PROD;
    const isDev = import.meta.env.DEV;

    // Check Backend URL
    if (!backendUrl) {
      errors.push('VITE_BACKEND_URL is not defined');
      suggestions.push('Set VITE_BACKEND_URL in your .env.local file or GitHub repository secrets');
    } else {
      try {
        const url = new URL(backendUrl);
        
        // Check protocol
        if (!['http:', 'https:'].includes(url.protocol)) {
          errors.push('Backend URL must use HTTP or HTTPS protocol');
        }
        
        // Production-specific checks
        if (isProd) {
          if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
            errors.push('Cannot use localhost backend URL in production');
            suggestions.push('Set a public backend URL for production deployment');
          }
          
          if (url.protocol === 'http:') {
            warnings.push('Using HTTP in production - HTTPS is recommended for security');
          }
        }
        
        // Development-specific checks
        if (isDev && !url.hostname.includes('localhost') && !url.hostname.includes('127.0.0.1')) {
          warnings.push('Using production backend URL in development');
        }
        
      } catch (error) {
        errors.push('Backend URL is not a valid URL format');
        suggestions.push('Ensure URL includes protocol (http:// or https://)');
      }
    }

    // Check API Key
    if (!apiKey) {
      warnings.push('VITE_API_KEY is not defined - API calls may fail if authentication is required');
      suggestions.push('Set VITE_API_KEY if your backend requires authentication');
    } else {
      // Check for placeholder values
      const placeholders = ['your-api-key', 'api-key-here', 'replace-me', 'test-key', 'demo', 'placeholder'];
      if (placeholders.some(placeholder => apiKey.toLowerCase().includes(placeholder))) {
        warnings.push('API key appears to be a placeholder value');
        suggestions.push('Replace the placeholder API key with your actual key');
      }
      
      // Check minimum length
      if (apiKey.length < 8) {
        warnings.push('API key seems unusually short - verify it\'s correct');
      }
      
      // Check for test values in production
      if (isProd && ['test', 'demo', 'dev'].some(word => apiKey.toLowerCase().includes(word))) {
        errors.push('Test/demo API key detected in production environment');
        suggestions.push('Use your production API key for deployment');
      }
    }

    // Environment-specific guidance
    if (isProd && (!backendUrl || !apiKey)) {
      suggestions.push('For GitHub Pages: Add VITE_BACKEND_URL and VITE_API_KEY as repository secrets');
    }

    if (isDev && (!backendUrl || !apiKey)) {
      suggestions.push('For local development: Create .env.local with your environment variables');
    }

    // Determine overall status
    let status: 'success' | 'warning' | 'error';
    if (errors.length > 0) {
      status = 'error';
    } else if (warnings.length > 0) {
      status = 'warning';
    } else {
      status = 'success';
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      status,
    };
  }

  /**
   * Generate setup instructions based on current environment
   */
  static getSetupInstructions(): string[] {
    const isDev = import.meta.env.DEV;
    const isProd = import.meta.env.PROD;
    
    if (isDev) {
      return [
        '1. Create .env.local file in your project root',
        '2. Add: VITE_BACKEND_URL=https://your-backend-api.com',
        '3. Add: VITE_API_KEY=your-api-key-here',
        '4. Restart your development server',
        '5. Check the Settings panel to verify configuration',
      ];
    }
    
    if (isProd) {
      return [
        '1. Go to your GitHub repository Settings',
        '2. Navigate to "Secrets and variables" → "Actions"',
        '3. Add secret: VITE_BACKEND_URL with your API URL',
        '4. Add secret: VITE_API_KEY with your API key',
        '5. Push to main branch to trigger deployment',
        '6. Check GitHub Actions logs for any build errors',
      ];
    }
    
    return [
      '1. Set up environment variables for your deployment target',
      '2. Use VITE_ prefix for client-side environment variables',
      '3. Verify configuration in the Settings panel',
    ];
  }

  /**
   * Get deployment-specific troubleshooting tips
   */
  static getTroubleshootingTips(): { title: string; tips: string[] }[] {
    return [
      {
        title: 'GitHub Pages Deployment',
        tips: [
          'Ensure repository secrets are named exactly: VITE_BACKEND_URL, VITE_API_KEY',
          'Check GitHub Actions tab for build/deployment logs',
          'Verify GitHub Pages is enabled in repository settings',
          'Make sure your backend API allows CORS from your GitHub Pages domain',
        ],
      },
      {
        title: 'Local Development',
        tips: [
          'Create .env.local file (not .env) to avoid committing secrets',
          'Restart dev server after changing environment variables',
          'Use localhost URLs for local backend development',
          'Check browser network tab to verify API calls are working',
        ],
      },
      {
        title: 'API Connection Issues',
        tips: [
          'Verify backend URL is accessible from your deployment location',
          'Check API key permissions and expiration',
          'Ensure CORS is properly configured on your backend',
          'Test API endpoints directly using curl or Postman',
        ],
      },
      {
        title: 'Security Best Practices',
        tips: [
          'Never commit API keys to your repository',
          'Use API keys with minimal required permissions',
          'Regularly rotate API keys',
          'Monitor API usage for unexpected patterns',
        ],
      },
    ];
  }

  /**
   * Check if current environment is properly configured for deployment
   */
  static isDeploymentReady(): boolean {
    const result = this.validateEnvironment();
    return result.isValid && result.status !== 'error';
  }

  /**
   * Get current environment configuration summary
   */
  static getConfigSummary() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const apiKey = import.meta.env.VITE_API_KEY;
    const mode = import.meta.env.MODE;
    const isDev = import.meta.env.DEV;
    const isProd = import.meta.env.PROD;

    return {
      backendUrl: backendUrl ? `${backendUrl.substring(0, 50)}${backendUrl.length > 50 ? '...' : ''}` : 'Not set',
      hasApiKey: !!apiKey,
      apiKeyPreview: apiKey ? `${apiKey.substring(0, 8)}...` : 'Not set',
      mode,
      isDev,
      isProd,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * React hook for environment validation
 */
export function useEnvValidation() {
  const [validation, setValidation] = useState<EnvCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateEnvironment = async () => {
    setIsLoading(true);
    
    // Add small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const result = EnvSetupHelper.validateEnvironment();
    setValidation(result);
    setIsLoading(false);
    
    return result;
  };

  const refresh = () => {
    return validateEnvironment();
  };

  return {
    validation,
    isLoading,
    validateEnvironment,
    refresh,
    isDeploymentReady: validation?.isValid ?? false,
  };
}

// Import React hooks
import { useState } from 'react';
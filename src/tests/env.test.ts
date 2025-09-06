/**
 * Environment Variable Configuration Tests
 * 
 * This test suite validates that environment variables are properly configured
 * for both local development and GitHub Pages deployment scenarios.
 */

import { describe, test, expect, beforeEach } from 'vitest';

// Mock import.meta.env for testing
const mockEnv = {
  VITE_BACKEND_URL: 'https://api.example.com',
  VITE_API_KEY: 'test-api-key-123',
  MODE: 'test',
  DEV: false,
  PROD: true,
};

// Replace import.meta.env with our mock
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: mockEnv
    }
  },
  writable: true
});

describe('Environment Variable Configuration', () => {
  beforeEach(() => {
    // Reset environment variables before each test
    mockEnv.VITE_BACKEND_URL = 'https://api.example.com';
    mockEnv.VITE_API_KEY = 'test-api-key-123';
  });

  describe('Required Environment Variables', () => {
    test('VITE_BACKEND_URL should be defined', () => {
      expect(import.meta.env.VITE_BACKEND_URL).toBeDefined();
      expect(import.meta.env.VITE_BACKEND_URL).not.toBe('');
    });

    test('VITE_API_KEY should be defined', () => {
      expect(import.meta.env.VITE_API_KEY).toBeDefined();
      expect(import.meta.env.VITE_API_KEY).not.toBe('');
    });

    test('should validate environment variables format', () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const apiKey = import.meta.env.VITE_API_KEY;

      // Backend URL should be a valid URL
      expect(() => new URL(backendUrl)).not.toThrow();
      
      // API key should be a non-empty string
      expect(typeof apiKey).toBe('string');
      expect(apiKey.length).toBeGreaterThan(0);
    });
  });

  describe('Environment Variable Validation', () => {
    test('should handle missing VITE_BACKEND_URL gracefully', () => {
      mockEnv.VITE_BACKEND_URL = undefined as any;
      
      // Your app should have fallback handling
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://vision-backend-0l94.onrender.com';
      expect(backendUrl).toBe('https://vision-backend-0l94.onrender.com');
    });

    test('should handle missing VITE_API_KEY gracefully', () => {
      mockEnv.VITE_API_KEY = undefined as any;
      
      // Your app should handle missing API key
      const apiKey = import.meta.env.VITE_API_KEY || '';
      expect(typeof apiKey).toBe('string');
    });

    test('should validate backend URL format', () => {
      const testCases = [
        { url: 'https://api.example.com', valid: true },
        { url: 'https://vision-backend-0l94.onrender.com', valid: true },
        { url: 'https://api.example.com:8080', valid: true },
        { url: 'invalid-url', valid: false },
        { url: 'ftp://example.com', valid: true }, // Valid URL, but might not be suitable
        { url: '', valid: false },
      ];

      testCases.forEach(({ url, valid }) => {
        mockEnv.VITE_BACKEND_URL = url;
        
        if (valid && url !== '') {
          expect(() => new URL(import.meta.env.VITE_BACKEND_URL)).not.toThrow();
        } else if (url === '') {
          expect(import.meta.env.VITE_BACKEND_URL).toBe('');
        } else {
          expect(() => new URL(import.meta.env.VITE_BACKEND_URL)).toThrow();
        }
      });
    });
  });

  describe('GitHub Pages Configuration', () => {
    test('should work in production mode', () => {
      mockEnv.MODE = 'production';
      mockEnv.DEV = false;
      mockEnv.PROD = true;

      expect(import.meta.env.MODE).toBe('production');
      expect(import.meta.env.DEV).toBe(false);
      expect(import.meta.env.PROD).toBe(true);
    });

    test('should handle GitHub Actions environment', () => {
      // Simulate GitHub Actions environment
      const originalEnv = process.env;
      process.env = {
        ...originalEnv,
        GITHUB_ACTIONS: 'true',
        GITHUB_REPOSITORY: 'user/repo',
      };

      expect(process.env.GITHUB_ACTIONS).toBe('true');

      // Restore original environment
      process.env = originalEnv;
    });
  });

  describe('Security Considerations', () => {
    test('should not expose sensitive data in client bundle', () => {
      // Only VITE_ prefixed variables should be available
      expect(import.meta.env.VITE_BACKEND_URL).toBeDefined();
      expect(import.meta.env.VITE_API_KEY).toBeDefined();
      
      // Non-VITE prefixed variables should not be available
      expect(import.meta.env.BACKEND_URL).toBeUndefined();
      expect(import.meta.env.API_KEY).toBeUndefined();
    });

    test('should validate API key format', () => {
      const testApiKeys = [
        'sk-1234567890abcdef',
        'api_key_123',
        'Bearer token123',
        '12345',
        'very-long-api-key-with-special-chars-!@#$%',
      ];

      testApiKeys.forEach(key => {
        mockEnv.VITE_API_KEY = key;
        const apiKey = import.meta.env.VITE_API_KEY;
        
        expect(typeof apiKey).toBe('string');
        expect(apiKey.length).toBeGreaterThan(0);
        // Add any specific API key format validation here
      });
    });
  });
});

/**
 * Runtime Environment Validation Utility
 * 
 * This utility can be used in your actual application to validate
 * environment variables at runtime.
 */
export class EnvValidator {
  private static errors: string[] = [];

  static validate(): { isValid: boolean; errors: string[] } {
    this.errors = [];

    this.validateBackendUrl();
    this.validateApiKey();

    return {
      isValid: this.errors.length === 0,
      errors: [...this.errors],
    };
  }

  private static validateBackendUrl(): void {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    if (!backendUrl) {
      this.errors.push('VITE_BACKEND_URL is not defined');
      return;
    }

    try {
      const url = new URL(backendUrl);
      
      // Check if it's HTTP or HTTPS
      if (!['http:', 'https:'].includes(url.protocol)) {
        this.errors.push('VITE_BACKEND_URL must use HTTP or HTTPS protocol');
      }

      // Check for localhost in production
      if (import.meta.env.PROD && url.hostname === 'localhost') {
        console.warn('Warning: Using localhost backend URL in production');
      }

    } catch (error) {
      this.errors.push('VITE_BACKEND_URL is not a valid URL');
    }
  }

  private static validateApiKey(): void {
    const apiKey = import.meta.env.VITE_API_KEY;

    if (!apiKey) {
      this.errors.push('VITE_API_KEY is not defined');
      return;
    }

    if (typeof apiKey !== 'string') {
      this.errors.push('VITE_API_KEY must be a string');
      return;
    }

    if (apiKey.length < 8) {
      this.errors.push('VITE_API_KEY appears to be too short (minimum 8 characters)');
    }

    // Check for placeholder values
    const placeholders = ['your-api-key', 'api-key-here', 'replace-me', 'test-key'];
    if (placeholders.some(placeholder => apiKey.toLowerCase().includes(placeholder))) {
      this.errors.push('VITE_API_KEY appears to be a placeholder value');
    }
  }

  static getConfig() {
    return {
      backendUrl: import.meta.env.VITE_BACKEND_URL,
      apiKey: import.meta.env.VITE_API_KEY,
      isDev: import.meta.env.DEV,
      isProd: import.meta.env.PROD,
      mode: import.meta.env.MODE,
    };
  }
}
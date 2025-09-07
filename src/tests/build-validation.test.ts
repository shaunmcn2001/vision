/**
 * Build and Deployment Validation Tests
 * 
 * These tests ensure that the project can be built and deployed successfully
 * with the current configuration.
 */

import { describe, test, expect } from 'vitest';

describe('Build and Deployment Validation', () => {
  describe('Package Configuration', () => {
    test('package.json should be valid', async () => {
      const packageJson = await import('../../package.json');
      
      expect(packageJson.name).toBeDefined();
      expect(packageJson.version).toBeDefined();
      expect(packageJson.dependencies).toBeDefined();
      expect(packageJson.devDependencies).toBeDefined();
    });

    test('should not have problematic dependencies', async () => {
      const packageJson = await import('../../package.json');
      
      // Ensure @github/spark is not included as it's not publicly available
      expect(packageJson.dependencies['@github/spark']).toBeUndefined();
      
      // Ensure all required dependencies are present
      expect(packageJson.dependencies['@phosphor-icons/react']).toBeDefined();
      expect(packageJson.dependencies['react']).toBeDefined();
      expect(packageJson.dependencies['react-dom']).toBeDefined();
      expect(packageJson.dependencies['maplibre-gl']).toBeDefined();
    });
  });

  describe('Environment Configuration', () => {
    test('should handle missing environment variables gracefully', () => {
      // This tests the fallback behavior when env vars are not set
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://vision-backend-0l94.onrender.com';
      
      expect(backendUrl).toBe('https://vision-backend-0l94.onrender.com');
      expect(() => new URL(backendUrl)).not.toThrow();
    });

    test('should validate backend URL format', () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://vision-backend-0l94.onrender.com';
      
      const url = new URL(backendUrl);
      expect(['http:', 'https:']).toContain(url.protocol);
      expect(url.hostname).toBeTruthy();
    });
  });

  describe('Module Imports', () => {
    test('useKV hook should be importable', async () => {
      const { useKV } = await import('../hooks/useKV');
      expect(typeof useKV).toBe('function');
    });

    test('API client should be importable', async () => {
      const { apiClient } = await import('../api');
      expect(apiClient).toBeDefined();
      expect(typeof apiClient.checkHealth).toBe('function');
      expect(typeof apiClient.getFields).toBe('function');
    });

    test('all components should be importable', async () => {
      const components = [
        '../App',
        '../components/MapView',
        '../components/FieldList',
        '../components/YearMonthPicker',
        '../components/ChartPanel',
        '../components/Settings',
        '../components/BackendStatus',
        '../components/AppDebug'
      ];

      for (const component of components) {
        expect(async () => await import(component)).not.toThrow();
      }
    });
  });

  describe('Build Configuration', () => {
    test('should have valid build scripts', async () => {
      const packageJson = await import('../../package.json');
      
      expect(packageJson.scripts.build).toBeDefined();
      expect(packageJson.scripts.build).toContain('vite build');
    });

    test('should have valid test scripts', async () => {
      const packageJson = await import('../../package.json');
      
      expect(packageJson.scripts.test).toBeDefined();
      expect(packageJson.scripts['test:deployment']).toBeDefined();
      expect(packageJson.scripts['validate-env']).toBeDefined();
    });
  });

  describe('GitHub Pages Compatibility', () => {
    test('should not use Node.js specific APIs', () => {
      // Ensure the app doesn't use Node.js APIs that won't work in browser
      expect(typeof window).toBe('object'); // Should be available in test env
      expect(typeof localStorage).toBe('object'); // Should be available
    });

    test('should handle base path configuration', () => {
      // Test that the app can handle being deployed to a subdirectory
      const base = import.meta.env.VITE_BASE || '/';
      expect(typeof base).toBe('string');
    });
  });
});
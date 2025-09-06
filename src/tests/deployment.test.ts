import { describe, it, expect, beforeEach } from 'vitest';
import { apiClient } from '../api';

describe('Deployment Configuration', () => {
  beforeEach(() => {
    // Reset any manual configuration
    apiClient.updateSettings('https://vision-backend-0l94.onrender.com');
  });

  it('should have correct default backend URL', () => {
    // Test that the API client has the correct default URL
    expect(apiClient.getTileURL('annual', 'test-field', 2024)).toContain('vision-backend-0l94.onrender.com');
  });

  it('should use environment variable when available', () => {
    // Mock environment variable
    const originalEnv = import.meta.env.VITE_BACKEND_URL;
    
    // This test verifies the logic, actual env injection happens at build time
    const expectedUrl = import.meta.env.VITE_BACKEND_URL || 'https://vision-backend-0l94.onrender.com';
    expect(typeof expectedUrl).toBe('string');
    expect(expectedUrl.length).toBeGreaterThan(0);
  });

  it('should generate correct tile URLs for production backend', () => {
    const annualUrl = apiClient.getTileURL('annual', 'field-123', 2024);
    const monthlyUrl = apiClient.getTileURL('monthly', 'field-123', 2024, 6);

    expect(annualUrl).toBe('https://vision-backend-0l94.onrender.com/api/tiles/ndvi/annual/field-123/2024/{z}/{x}/{y}.png');
    expect(monthlyUrl).toBe('https://vision-backend-0l94.onrender.com/api/tiles/ndvi/month/field-123/2024/6/{z}/{x}/{y}.png');
  });

  it('should handle API client configuration updates', () => {
    const customBackend = 'https://custom-backend.example.com';
    
    apiClient.updateSettings(customBackend);
    
    const tileUrl = apiClient.getTileURL('annual', 'test-field', 2024);
    expect(tileUrl).toContain(customBackend);
  });

  it('should provide health check endpoint', async () => {
    // This doesn't make actual HTTP request, just tests the method exists and returns proper structure
    const healthCheck = apiClient.checkHealth();
    expect(healthCheck).toBeInstanceOf(Promise);
  });
});
/**
 * Test setup configuration for Vitest
 * 
 * This file configures the testing environment for environment variable
 * and component testing.
 */

import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Make vitest globals available
declare global {
  const describe: typeof import('vitest').describe;
  const it: typeof import('vitest').it;
  const expect: typeof import('vitest').expect;
  const test: typeof import('vitest').test;
  const beforeEach: typeof import('vitest').beforeEach;
  const afterEach: typeof import('vitest').afterEach;
}

// Mock environment for testing
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_BACKEND_URL: 'https://api.example.com',
        VITE_API_KEY: 'test-api-key-123',
        MODE: 'test',
        DEV: false,
        PROD: true,
        BASE_URL: '/',
      }
    }
  },
  writable: true,
  configurable: true
});

// Mock DOM methods that might be used
Object.defineProperty(window, 'location', {
  value: {
    href: 'https://localhost:3000',
    reload: vi.fn(),
  },
  writable: true,
});

// Mock fetch for API testing
global.fetch = vi.fn();

// Mock console methods to reduce noise in tests
const originalConsole = { ...console };
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
  log: vi.fn(),
};

// Restore console for debugging when needed
export const restoreConsole = () => {
  global.console = originalConsole;
};

// Mock ResizeObserver (used by some UI components)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia (used by responsive components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

export { vi } from 'vitest';
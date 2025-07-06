/**
 * Jest Setup Configuration
 * 
 * Global test setup and configuration for consistent testing environment
 */

import '@testing-library/jest-dom';

// Global test configuration
declare global {
  // Add custom Jest matchers
  namespace jest {
    interface Matchers<R> {
      toBeWithinRange(a: number, b: number): R;
      toHavePerformanceWithin(maxTime: number): R;
    }
  }
}

// Custom Jest matchers
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },

  toHavePerformanceWithin(received: any, maxTime: number) {
    const performance = received?.performance;
    if (!performance) {
      return {
        message: () => `expected object to have performance metadata`,
        pass: false,
      };
    }

    const { lastOperationTime } = performance;
    const pass = lastOperationTime <= maxTime;
    
    if (pass) {
      return {
        message: () => `expected performance time ${lastOperationTime}ms not to be within ${maxTime}ms`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected performance time ${lastOperationTime}ms to be within ${maxTime}ms`,
        pass: false,
      };
    }
  },
});

// Mock window.matchMedia for components that use media queries
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver for components that use it
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver for components that use it
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Suppress console warnings in tests unless specifically testing them
const originalWarn = console.warn;
const originalError = console.error;

beforeEach(() => {
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterEach(() => {
  console.warn = originalWarn;
  console.error = originalError;
});

// Setup performance timing mock
global.performance = global.performance || {
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByName: jest.fn(() => []),
  getEntriesByType: jest.fn(() => []),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
} as any;

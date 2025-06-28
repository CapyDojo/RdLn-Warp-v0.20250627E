import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: [
      'tests/accuracy/**/*.{test,spec}.{js,ts}',
      'tests/performance/**/*.{test,spec}.{js,ts}',
      'tests/integration/**/*.{test,spec}.{js,ts}'
    ],
    testTimeout: 120000, // 2 minutes for complex OCR operations
    hookTimeout: 60000,
    threads: false, // Disable threading for OCR tests to avoid worker conflicts
    maxConcurrency: 1, // Run OCR tests sequentially
    reporter: ['verbose', 'json'],
    outputFile: {
      json: './test-results/ocr-results.json'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './tests')
    }
  }
});

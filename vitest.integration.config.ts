import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/integration-setup.ts'],
    css: true,
    // Integration test configuration
    include: [
      'src/**/*.integration.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage-integration',
      include: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.test.{ts,tsx}',
        '!src/**/*.spec.{ts,tsx}',
        '!src/**/*.integration.{ts,tsx}',
        '!src/test/**',
        '!src/**/__tests__/**',
      ],
      exclude: [
        'node_modules/**',
        'dist/**',
        'coverage/**',
        'coverage-integration/**',
        '**/*.config.{js,ts}',
        '**/vite-env.d.ts',
      ],
    },
    reporter: ['verbose', 'json'],
    outputFile: {
      json: './integration-test-results.json',
    },
    // Longer timeout for integration tests
    testTimeout: 30000,
    hookTimeout: 30000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

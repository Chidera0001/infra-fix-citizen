import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/system-setup.ts'],
    css: true,
    // System test configuration
    include: ['src/**/*.system.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage-system',
      include: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.test.{ts,tsx}',
        '!src/**/*.spec.{ts,tsx}',
        '!src/**/*.integration.{ts,tsx}',
        '!src/**/*.system.{ts,tsx}',
        '!src/test/**',
        '!src/**/__tests__/**',
      ],
      exclude: [
        'node_modules/**',
        'dist/**',
        'coverage/**',
        'coverage-integration/**',
        'coverage-system/**',
        '**/*.config.{js,ts}',
        '**/vite-env.d.ts',
      ],
    },
    reporter: ['verbose', 'json'],
    outputFile: {
      json: './system-test-results.json',
    },
    // Longer timeout for system tests (they test complete workflows)
    testTimeout: 60000,
    hookTimeout: 60000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

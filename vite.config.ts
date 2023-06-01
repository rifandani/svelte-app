/// <reference types="vitest" />
/// <reference types="vite/client" />

import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })], // disabling Svelte's hot module reload when tests are running
  test: {
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default', 'html'],
    environment: 'jsdom', // mocking the DOM API
    globals: true,
    setupFiles: ['node_modules/@testing-library/jest-dom/extend-expect.js', 'src/setupTests.ts'],
    // Will call .mockRestore() on all spies before each test. This will clear mock history and reset its implementation to the original one.
    restoreMocks: true,
    coverage: {
      provider: 'c8', // 'istanbul' / 'c8'
      reporter: ['text', 'json', 'html'],
      statements: 80,
      branches: 80,
      functions: 65,
      lines: 80,
      exclude: [
        'coverage/**',
        'dist/**',
        'packages/*/test{,s}/**',
        '**/*.d.ts',
        'cypress/**',
        'test{,s}/**',
        'test{,-*}.{js,cjs,mjs,ts,tsx,jsx}',
        '**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx}',
        '**/*{.,-}spec.{js,cjs,mjs,ts,tsx,jsx}',
        '**/__tests__/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
        '**/.{eslint,mocha,prettier}rc.{js,cjs,yml}',
        // above is default
        'src/setupTests.ts',
        'src/main.ts',
        'src/mocks/**',
        'src/assets/**',
        'src/i18n/**',
      ],
    },
  },
});

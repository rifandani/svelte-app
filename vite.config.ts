import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    svelte({
      hot: !process.env.VITEST, // disabling Svelte's hot module reload when tests are running
      exclude: ['./src/lib/wc/MyCounter.wc.svelte'], // exclude web components lib
    }),
    // used only for compiling svelte components to web components
    svelte({
      include: ['./src/lib/wc/MyCounter.wc.svelte'],
      compilerOptions: {
        customElement: true,
      },
    }),
  ],
  server: {
    port: 5500,
  },
  test: {
    // to see how your tests are running in real time in the terminal, add "default"
    // to generate HTML output and preview the results of your tests, add "html"
    reporters: ['default', 'html'],
    environment: 'jsdom', // mocking the DOM API
    globals: true, // use APIs globally like jest
    setupFiles: ['src/setup-test.ts'],
    exclude: [...configDefaults.exclude, 'e2e/*'],
    // Will call .mockRestore() on all spies before each test. This will clear mock history and reset its implementation to the original one.
    restoreMocks: true,
    coverage: {
      provider: 'istanbul', // 'istanbul' / 'v8'
      reporter: ['text', 'json', 'html'],
      statements: 50,
      branches: 50,
      functions: 50,
      lines: 50,
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
        'src/setup-test.ts',
        'src/main.ts',
        'src/mocks/**',
        'src/assets/**',
        'src/lib/**',
        'src/i18n/**',
      ],
    },
  },
});

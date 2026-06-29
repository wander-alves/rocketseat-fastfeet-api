import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: false,
  oxc: false,
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    include: ['**/*.e2e-spec.ts'],
    root: './',
    setupFiles: ['./tests/setup/setup-e2e'],
    hookTimeout: 500000,
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});

import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: false,
  oxc: false,
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    setupFiles: ['./tests/setup-e2e'],
    hookTimeout: 500000,
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});

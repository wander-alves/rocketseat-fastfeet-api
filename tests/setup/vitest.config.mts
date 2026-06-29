import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: false,
  oxc: false,
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ['**/*.spec.ts'],
    globals: true,
    root: './',
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});

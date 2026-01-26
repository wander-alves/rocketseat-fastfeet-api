import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: {
      js,
    },
    extends: [compat.extends('@rocketseat/eslint-config/node')],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'no-useless-constructor': 'off',
      'no-empty': 'off',
      camelcase: 'off',
      'no-undef': 'warn',
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          singleQuote: true,
          trailingComma: 'all',
          semi: true,
          bracketSpacing: true,
        },
      ],
    },
  },
  tseslint.configs.recommended,
]);

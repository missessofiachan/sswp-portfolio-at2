import js from '@eslint/js';
import * as globals from 'globals';
import * as reactHooks from 'eslint-plugin-react-hooks';
import * as reactRefresh from 'eslint-plugin-react-refresh';
import * as tsplugin from '@typescript-eslint/eslint-plugin';
import { globalIgnores } from 'eslint/config';

export default [
  globalIgnores(['dist']),
  js.configs.recommended,
  tsplugin.configs?.recommended ?? {},
  reactHooks.configs?.['recommended-latest'] ?? {},
  reactRefresh.configs?.vite ?? {},
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
];

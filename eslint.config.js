import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import nextPlugin from '@next/eslint-plugin-next';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      'orion_python_backend/',
      '.venv/',
      'venv/',
      'node_modules/',
      'jest.config.js',
      'next.config.js',
      'postcss.config.js',
      'tailwind.config.js',
      'babel.config.js',
    ],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: ['./tsconfig.json'], // Ensure this points to your project's tsconfig
        tsconfigRootDir: import.meta.dirname, // Essential for `project` to work correctly
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react: pluginReact,
      '@typescript-eslint': tseslint.plugin,
      '@next': nextPlugin,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // Add next.js core web vitals rules explicitly or through the plugin
      '@next/next/no-html-link-for-pages': 'error', // Example Next.js rule
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  prettierConfig
);

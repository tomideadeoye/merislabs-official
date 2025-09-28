// IMPORTANT: Rename your eslint config to `eslint.config.mjs` and update its content
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import nextPlugin from '@next/eslint-plugin-next';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'node_modules/',
      '.next/',
      'coverage/',
      'dist/',
      '**/*.js', // Ignoring JS files for now to focus on TS
      '**/*.cjs',
      'generated/', // Ignore the generated Prisma client directory
      '**/*.d.ts', // Ignore all TypeScript declaration files
    ],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      '@next/next': nextPlugin,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      'react/prop-types': 'off',
      ...pluginReactHooks.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/no-unescaped-entities': 'off', // Temporarily disable for ESG components
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];

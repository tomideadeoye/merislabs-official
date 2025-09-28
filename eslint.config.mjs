// IMPORTANT: Rename your eslint config to `eslint.config.mjs` and update its content
import pkg from 'eslint-config-next';
const { config } = pkg;

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
  ...config,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/no-unescaped-entities': 'off', // Temporarily disable for ESG components
    },
  },
];

/** @type {import('tailwindcss').Config} */
import sharedConfig from '@merislabs/config/tailwind';

export default {
  ...sharedConfig,
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/css/additional-styles/*.css',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};

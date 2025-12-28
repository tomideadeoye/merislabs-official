/** @type {import('tailwindcss').Config} */
import sharedConfig from '@merislabs/config/tailwind';

export default {
  ...sharedConfig,
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/(orion_admin)/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './app/css/additional-styles/*.css',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};

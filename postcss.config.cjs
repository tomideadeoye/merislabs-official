// IMPORTANT: This file uses the .cjs extension to ensure it's treated as a CommonJS module.
// This resolves the "module is not defined" and "Your custom PostCSS configuration must export a `plugins` key" errors in modern Next.js projects.
module.exports = {
  plugins: {
    'postcss-import': {},
    tailwindcss: {},
    autoprefixer: {},
  },
};

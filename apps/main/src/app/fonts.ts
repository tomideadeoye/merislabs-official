import localFont from 'next/font/local';

// Define the font in a Server Component file
export const inter = localFont({
  src: './fonts/Inter.woff2',
  display: 'swap',
  variable: '--font-inter',
});

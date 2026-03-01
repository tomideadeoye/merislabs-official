import { Metadata } from 'next';

/**
 * Generate favicon metadata
 * Place your favicon.ico, icon.png, and apple-icon.png in the /public directory
 */
export default function favicon(): Metadata {
  return {
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180' },
      ],
    },
  };
}

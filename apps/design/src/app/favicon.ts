import { MetadataRoute } from 'next';

/**
 * Generate favicon metadata
 * Place your favicon.ico, icon.png, and apple-icon.png in the /public/app directory
 */
export default function favicon(): MetadataRoute.Favicon {
  return [
    {
      rel: 'icon',
      url: '/favicon.ico',
      sizes: 'any',
    },
    {
      rel: 'icon',
      url: '/icon.svg',
      type: 'image/svg+xml',
    },
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
      sizes: '180x180',
    },
  ];
}

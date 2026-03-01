import { MetadataRoute } from 'next';

/**
 * Web App Manifest for PWA support and better mobile SEO
 * This helps your site appear as a native app on mobile devices
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Meris Labs - Software Development & ESG Consulting',
    short_name: 'Meris Labs',
    description: 'Expert software development and ESG consulting services. Building innovative solutions for financial services, legal tech, and sustainable business growth.',
    start_url: '/',
    display: 'standalone',
    background_color: '#111827',
    theme_color: '#111827',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
    categories: ['business', 'productivity', 'technology'],
    lang: 'en-US',
    dir: 'ltr',
  };
}

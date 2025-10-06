import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features that are stable and widely used
  experimental: {
    // Optimize CSS and improve build performance
    optimizeCss: true,
    // Enable modern JavaScript features
    esmExternals: true,
  },

  // Image optimization settings
  images: {
    // Enable image optimization (default behavior)
    // unoptimized: false, // Remove this line to enable optimization
    domains: [], // Add your image domains here when needed
    formats: ['image/webp', 'image/avif'],
  },

  // Webpack configuration for better performance and compatibility
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
      '@/components': path.resolve(__dirname, 'components'),
      '@/lib': path.resolve(__dirname, 'app/lib'),
      '@/app': path.resolve(__dirname, 'app'),
      '@/types': path.resolve(__dirname, 'app/lib/types'),
      '@/utils': path.resolve(__dirname, 'app/lib/utils'),
      '@/stores': path.resolve(__dirname, 'app/lib/stores'),
      '@/styles': path.resolve(__dirname, 'app/styles'),
      '@/css': path.resolve(__dirname, 'app/css'),
      '@/public': path.resolve(__dirname, 'public'),
      '@/api': path.resolve(__dirname, 'app/api'),
      '@/database': path.resolve(__dirname, 'app/database'),
      '@/state': path.resolve(__dirname, 'app/state'),
      '@/memory-explorer': path.resolve(__dirname, 'app/memory-explorer'),
      '@/opportunity': path.resolve(__dirname, 'app/opportunity'),
      '@/wallpaper-generator': path.resolve(__dirname, 'app/wallpaper-generator'),
      '@/journal': path.resolve(__dirname, 'app/api/orion/journal'),
      '@/decks': path.resolve(__dirname, 'decks'),
      '@/fonts': path.resolve(__dirname, 'app/fonts'),
      '@/global-error': path.resolve(__dirname, 'app/global-error'),
      '@/globals': path.resolve(__dirname, 'app/globals'),
      '@/layout': path.resolve(__dirname, 'app/layout'),
      '@/page': path.resolve(__dirname, 'app/page'),
      '@/not-found': path.resolve(__dirname, 'app/not-found'),
    };

    // Add support for importing SVGs as React components (optional but common)
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Optimize bundle size in production
    if (!dev) {
      config.optimization.splitChunks.chunks = 'all';
    }

    return config;
  },

  // Performance optimizations (SWC minification is enabled by default in Next.js 15+)

  // Output configuration
  output: 'standalone', // Optimized for deployment

  // Enable compression
  compress: true,

  // Security headers (can be customized based on needs)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },

  // Redirects and rewrites can be added here when needed
  async redirects() {
    return [];
  },

  async rewrites() {
    return [];
  },
};

export default nextConfig;

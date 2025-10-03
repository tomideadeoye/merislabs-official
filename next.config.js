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

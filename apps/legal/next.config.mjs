/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@merislabs/ui', '@merislabs/types', '@merislabs/data', '@merislabs/config'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.banwo-ighodalo.com',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;

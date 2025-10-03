/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.watchOptions = {
        poll: 1000,
        ignored: ['**/.git/**', '**/node_modules/**', '**/.next/**', '**/dist/**', '**/.turbo/**'],
      };
    }
    return config;
  },
};

export default nextConfig;

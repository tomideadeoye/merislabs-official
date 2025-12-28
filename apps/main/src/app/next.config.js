/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Enables standalone output for Docker or similar deployments
  reactStrictMode: true, // Recommended for highlighting potential problems in an application
  // Add any other Next.js specific configurations here as needed
};

module.exports = nextConfig;

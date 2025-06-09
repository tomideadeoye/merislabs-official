/** @type {import('next').NextConfig} */
/**
 * MONOREPO STRUCTURE NOTE:
 * - This Next.js app lives in a monorepo alongside non-Next.js projects (e.g., orion_python_backend, venv, data science, etc.).
 * - To prevent build errors, we exclude all backend, venv, and non-Next.js folders from the build and static file serving.
 * - To add a new backend or non-Next.js project, add its folder to the 'ignoreDirs' array below.
 */
const ignoreDirs = [
  'orion_python_backend',
  'venv',
  '.venv',
  'notion_api_venv',
  '.pytest_cache',
  '.ipynb_checkpoints',
  '__pycache__',
  'qdrant_storage',
  'data',
  'database',
  'embedding_service',
  'tests', // Only if not Next.js tests
  'scripts', // Only if not Next.js scripts
  // Add more as needed for future projects
];

const nextConfig = {
  transpilePackages: ['@shared'],
  experimental: {
    esmExternals: 'loose',
  },
  webpack: (config, { isServer }) => {
    // Add support for importing SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    config.module.rules.push({
      test: /\.js$/,
      include: [
        /node_modules[\\/]@qdrant[\\/]js-client-rest/,
        /node_modules[\\/]undici/
      ],
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
        },
      },
    });
    return config;
  },
    images: {
    unoptimized: true,
  }
}

module.exports = nextConfig

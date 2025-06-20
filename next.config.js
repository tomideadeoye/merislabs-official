/** @type {import('next').NextConfig} */
// GOAL OF FILE|FEATURES|FUNCTIONS:
// FILEPATH:
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed [X] – confirm with team
// NOTES: components to merge with, similar or redundant component, opportunities for improvement, opportunties to consolidate
// TODOS:
// SUGGESTIONS:
const ignoreDirs = [
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
        buffer: false,
        http: false,
        https: false,
        path: false,
        process: false,
        stream: false,
        url: false,
        util: false,
        zlib: false,
      };

      // Explicitly mark server-only modules as external for client build
      config.externals.push(
        'node-fetch',
        'winston',
        'pg',
        'puppeteer',
        'cheerio',
        'docx',
        'openai',
        'litellm',
        'langchain',
        '@qdrant/js-client-rest',
        'undici',
        // Treat all node: prefixed imports as external for client build
        ({ request }, callback) => {
          if (request && request.startsWith('node:')) {
            return callback(null, `commonjs ${request}`);
          }
          callback();
        }
      );
    }

    if (isServer) {
      config.externals.push('dns');
    }

    return config;
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: ['@qdrant/js-client-rest', 'undici'],
};

export default nextConfig;

const createNextIntlPlugin = require('next-intl/plugin');

// Required by next-intl plugin during Next config evaluation.
process.env._next_intl_trailing_slash = 'false';
 
const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  env: {
    _next_intl_trailing_slash: process.env._next_intl_trailing_slash || 'false',
  },
  // Disable SWC completely, use Babel instead
  swcMinify: false,
  compiler: {
    // Use Babel for compilation
  },
  webpack: (config, { isServer }) => {
    // Ensure Babel is used
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8001',
        pathname: '/storage/**',
      },
    ],
  },
}

module.exports = withNextIntl(nextConfig);

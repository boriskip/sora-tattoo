const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin('./i18n.ts');
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
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
  // Force SWC to use fallback if binary not found
  experimental: {
    swcFileReading: true,
  },
}

module.exports = withNextIntl(nextConfig);

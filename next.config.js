/** @type {import('next').NextConfig} */

const { i18n } = require('./next-i18next.config');

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/signin',
        permanent: true,
      },
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
  // importing the internationalization config separately so that it can be read by the in8 lib
  i18n,
};

module.exports = nextConfig;

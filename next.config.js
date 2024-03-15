/** @type {import('next').NextConfig} */

module.exports = {
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
  async rewrites() {
    return [
      {
        source: '/pirsch/script.js',
        destination: 'https://api.pirsch.io/pirsch.js',
      },
      {
        source: '/pirsch/hit',
        destination: 'https://api.pirsch.io/hit',
      },
    ];
  },
};

/** @type {import('next').NextConfig} */

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
};

module.exports = nextConfig;

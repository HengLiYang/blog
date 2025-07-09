/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  basePath: '/blog',
  assetPrefix: '/blog/'
};

module.exports = nextConfig;

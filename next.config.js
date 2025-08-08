/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  output: 'export',
  trailingSlash: true,

  // 添加静态资源优化
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;

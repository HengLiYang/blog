/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  output: 'export',
  trailingSlash: true,

  // 添加性能优化
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['three', '@react-three/fiber']
  },

  // 添加静态资源优化
  images: {
    unoptimized: true
  },

  // 添加headers配置（安全头）
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      },
      {
        source: '/textures/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 配置API代理
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },
  // 优化构建
  swcMinify: true,
};

module.exports = nextConfig; 
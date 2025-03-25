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
  // 静态导出选项
  output: 'standalone',
  // 优化构建
  swcMinify: true,
};

module.exports = nextConfig; 
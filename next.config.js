/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['openai', 'firebase'],
  },
  transpilePackages: ['html2canvas'],
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  // 添加以下配置
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
}

module.exports = nextConfig

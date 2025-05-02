/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    // Disable webpack cache to prevent file system issues
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;
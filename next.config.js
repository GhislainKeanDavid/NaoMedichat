/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    buildActivity: false, // Hides the "N" indicator
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable preload for CSS to avoid warnings
  experimental: {
    optimizeCss: false,
  },
  // Or configure images if needed
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig

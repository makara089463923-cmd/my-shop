/** @type {import('next').NextConfig} */
const nextConfig = {
  // ❌ លុប output: 'export' ចេញ - មិនអាចប្រើជាមួយ API routes បានទេ
  // output: 'export',
  
  // Disable preload for CSS to avoid warnings
  experimental: {
    optimizeCss: false,
  },
  
  // Configure images with remotePatterns
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // ✅ បិទ ESLint errors កំឡុងពេល build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // ✅ បិទ TypeScript errors កំឡុងពេល build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // ✅ បន្ថែម trailing slash (ជួយឲ្យ routing ដំណើរការបានល្អ)
  trailingSlash: true,
}

module.exports = nextConfig
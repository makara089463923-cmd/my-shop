// // /** @type {import('next').NextConfig} */
// // const nextConfig = {
// //   // Disable preload for CSS to avoid warnings
// //   experimental: {
// //     optimizeCss: false,
// //   },
// //   // Or configure images if needed
// //   images: {
// //     domains: ['localhost'],
// //     remotePatterns: [
// //       {
// //         protocol: 'https',
// //         hostname: '**',
// //       },
// //     ],
// //   },
// // }

// // module.exports = nextConfig



// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // Disable preload for CSS to avoid warnings
//   experimental: {
//     optimizeCss: false,
//   },
//   // Configure images with remotePatterns
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'http',
//         hostname: 'localhost',
//       },
//       {
//         protocol: 'https',
//         hostname: '**',
//       },
//     ],
//   },
// }

// module.exports = nextConfig


/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages - Static Export
  output: 'export', // ✅ សំខាន់បំផុតសម្រាប់ Cloudflare Pages
  
  // Disable preload for CSS to avoid warnings
  experimental: {
    optimizeCss: false,
  },
  
  // Configure images
  images: {
    unoptimized: true, // ✅ ត្រូវការសម្រាប់ static export
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
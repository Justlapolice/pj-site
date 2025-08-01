/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: true,
  },
  // Désactive la vérification TypeScript pendant le build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Désactive la vérification ESLint pendant le build
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig

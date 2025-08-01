/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        pathname: '/**',
      },
    ],
  },
  // Désactive le minification pour faciliter le débogage
  swcMinify: false,
  // Active le mode strict pour le rendu
  reactStrictMode: true,
  // Configuration pour le build
  output: 'standalone',
  // Désactive le cache du compilateur TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
  // Désactive la vérification ESLint pendant le build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

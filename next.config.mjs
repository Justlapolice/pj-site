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
    unoptimized: true, // Désactive l'optimisation d'image pour Vercel
  },

  // Active le mode strict pour le rendu
  reactStrictMode: true,
  
  // Configuration pour le build
  output: 'standalone',
  
  // Configuration des en-têtes de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Désactive le cache du compilateur TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Désactive la vérification ESLint pendant le build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configuration des redirections si nécessaire
  async redirects() {
    return [];
  },
  
  // Configuration des réécritures si nécessaire
  async rewrites() {
    return [];
  },
  
  // Configuration pour les variables d'environnement
  env: {
    // Ajoutez ici vos variables d'environnement si nécessaire
  },
};

export default nextConfig;

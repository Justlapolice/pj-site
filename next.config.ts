import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        pathname: '/**', // autorise tous les chemins (avatars, fichiers, etc.)
      },
    ],
  },
};

export default nextConfig;

import { PrismaClient } from '@prisma/client';

// Vérifions si nous sommes dans un environnement de développement
const isDevelopment = process.env.NODE_ENV === 'development';

// Créons une nouvelle instance de PrismaClient
const prisma = new PrismaClient({
  log: isDevelopment ? ['query', 'error', 'warn'] : ['error'],
});

// Dans un environnement de développement, attachons Prisma à global pour éviter les fuites de mémoire
if (isDevelopment) {
  (global as any).prisma = prisma;
}

// Exportation de PrismaClient
export { prisma };

export default prisma;
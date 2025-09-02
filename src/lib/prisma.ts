import { PrismaClient } from "@prisma/client";

declare global {
  // pour TypeScript : éviter l'erreur sur global.prisma
  var prisma: PrismaClient | undefined;
}

const isDevelopment = process.env.NODE_ENV === "development";

const prisma = isDevelopment
  ? global.prisma ?? new PrismaClient({ log: ["query", "error", "warn"] })
  : new PrismaClient({ log: ["error"] });

// Dans dev, on attache à global pour éviter la création multiple d'instances
if (isDevelopment) global.prisma = prisma;

export default prisma;
export { prisma };

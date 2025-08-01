const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Création de la table Effectif...');
  
  // Création de la table avec une requête SQL brute
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS "Effectif" (
      id SERIAL PRIMARY KEY,
      prenom VARCHAR(50) NOT NULL,
      nom VARCHAR(50) NOT NULL,
      poste VARCHAR(100) NOT NULL,
      statut VARCHAR(50) DEFAULT 'Actif',
      telephone VARCHAR(20),
      "dateArrivee" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  console.log('Table Effectif créée avec succès !');
}

main()
  .catch((e) => {
    console.error('Erreur lors de la création des tables:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

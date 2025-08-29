import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetEnqueteSequence() {
  try {
    // Vérifier d'abord le nom de la séquence
    const sequenceInfo = await prisma.$queryRaw`
      SELECT pg_get_serial_sequence('enquete', 'id') as sequence_name;
    `;
    
    console.log('Sequence info:', sequenceInfo);
    
    // Réinitialiser la séquence à 7500
    const result = await prisma.$executeRaw`
      SELECT setval(pg_get_serial_sequence('enquete', 'id'), 7499, false);
    `;
    
    console.log('Sequence reset result:', result);
    console.log('La séquence a été réinitialisée pour commencer à 7500');
  } catch (error) {
    console.error('Erreur lors de la réinitialisation de la séquence:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetEnqueteSequence();

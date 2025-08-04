import { NextResponse } from 'next/server';

export async function GET() {
  // Par défaut, le mode maintenance est désactivé par défaut
  // Pour l'activer, mettre true et pour le desactiver, mettre false
  const isMaintenance = true;
  return NextResponse.json({ isMaintenance });
}

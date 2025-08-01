import { NextResponse } from 'next/server';

export async function GET() {
  // Par défaut, le mode maintenance est désactivé
  // Pour l'activer, mettre true
  const isMaintenance = false;

  return NextResponse.json({ isMaintenance });
}

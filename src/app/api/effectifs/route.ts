import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const effectifs = await prisma.effectif.findMany();
    return NextResponse.json(effectifs);
  } catch (error) {
    console.error('Erreur lors de la récupération des effectifs:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des effectifs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { prenom, nom, grade, poste, statut, telephone, formations = [] } = await request.json();

    // Validation des champs obligatoires
    if (!prenom || !nom || !poste) {
      return NextResponse.json(
        { error: 'Tous les champs sont obligatoires' },
        { status: 400 }
      );
    }

    // S'assurer que les formations sont un tableau
    const validFormations = Array.isArray(formations) ? formations : [];

    // Créer le nouvel effectif avec Prisma
    // Créer le nouvel effectif avec les formations
    const nouvelEffectif = await prisma.effectif.create({
      data: {
        prenom,
        nom,
        grade: grade || null,
        poste,
        statut: statut || 'Actif',
        telephone: telephone || null,
        formations: validFormations,
        dateArrivee: new Date()
      }
    });
    
    // Récupérer l'effectif avec ses formations
    const effectifAvecFormations = await prisma.effectif.findUnique({
      where: { id: nouvelEffectif.id },
      select: {
        id: true,
        prenom: true,
        nom: true,
        grade: true,
        poste: true,
        statut: true,
        telephone: true,
        formations: true,
        dateArrivee: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(effectifAvecFormations, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de l\'effectif:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'effectif' },
      { status: 500 }
    );
  }
}

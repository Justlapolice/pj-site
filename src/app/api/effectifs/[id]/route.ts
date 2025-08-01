import { NextResponse } from 'next/server';
import { PrismaClient, Grade } from '@prisma/client';

const prisma = new PrismaClient();

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID invalide' },
        { status: 400 }
      );
    }

    const effectif = await prisma.effectif.findUnique({
      where: { id },
      select: {
        id: true,
        prenom: true,
        nom: true,
        poste: true,
        statut: true,
        telephone: true,
        formations: true,
        dateArrivee: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!effectif) {
      return NextResponse.json(
        { error: 'Effectif non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...effectif,
      // S'assurer que formations est toujours un tableau
      formations: Array.isArray(effectif.formations) ? effectif.formations : []
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'effectif:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'effectif' },
      { status: 500 }
    );
  }
}

// Fonction utilitaire pour valider et normaliser le grade
function validateGrade(grade: string | undefined | null): Grade | null {
  if (!grade) return null;
  
  // Convertir le format d'affichage en format d'enum
  const normalizedGrade = grade.trim()
    .toUpperCase()
    .replace(/\s+/g, '_')  // Remplacer les espaces par des underscores
    .replace('B/C', 'B_C') // Gérer le cas spécial B/C -> B_C
    .replace('B_C_NORMAL', 'B_C_Normal') // Remettre en casse correcte
    .replace('B_C_SUP', 'B_C_Sup') // Remettre en casse correcte
    .replace('GPX-S', 'GPX_S') // Remettre en casse correcte
    .replace('E-GPX', 'E_GPX') // Remettre en casse correcte
    .replace('E-CPT', 'E_CPT') // Remettre en casse correcte
    .replace('CPT-S', 'CPT_S') // Remettre en casse correcte
    .replace('E-COM', 'E_COM'); // Remettre en casse correcte
    
    console.log(normalizedGrade);
    

  // Vérifier si le grade normalisé est valide
  if (Object.values(Grade).includes(normalizedGrade as Grade)) {
    return normalizedGrade as Grade;
  }
  return null;
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID invalide' },
        { status: 400 }
      );
    }

    const { prenom, nom, grade, poste, statut, telephone, formations = [] } = await request.json();

    // Validation des champs obligatoires
    if (!prenom || !nom || !poste) {
      return NextResponse.json(
        { error: 'Les champs prénom, nom et poste sont obligatoires' },
        { status: 400 }
      );
    }

    // Valider et normaliser le grade
    const validatedGrade = validateGrade(grade);
    
    // Valider que les formations sont un tableau
    const validFormations = Array.isArray(formations) ? formations : [];

    const updatedEffectif = await prisma.effectif.update({
      where: { id },
      data: {
        prenom,
        nom,
        grade: validatedGrade,
        poste,
        statut: statut || 'Actif',
        telephone: telephone || null,
        formations: validFormations,
        updatedAt: new Date()
      },
      select: {
        id: true,
        prenom: true,
        nom: true,
        poste: true,
        statut: true,
        telephone: true,
        formations: true,
        dateArrivee: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      ...updatedEffectif,
      formations: Array.isArray(updatedEffectif.formations) ? updatedEffectif.formations : []
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'effectif:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'effectif' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID invalide' },
        { status: 400 }
      );
    }

    await prisma.effectif.delete({
      where: { id }
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'effectif:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'effectif' },
      { status: 500 }
    );
  }
}

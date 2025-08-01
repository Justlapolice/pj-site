import { NextResponse, type NextRequest } from 'next/server'
import { PrismaClient, Grade } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(_req: NextRequest, context: any) {
  try {
    const id = parseInt(context.params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 })
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
    })

    if (!effectif) {
      return NextResponse.json({ error: 'Effectif non trouvé' }, { status: 404 })
    }

    return NextResponse.json({
      ...effectif,
      formations: Array.isArray(effectif.formations) ? effectif.formations : []
    })
  } catch (error) {
    console.error("Erreur lors de la récupération de l'effectif:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

function validateGrade(grade: string | undefined | null): Grade | null {
  if (!grade) return null

  const normalizedGrade = grade
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '_')
    .replace('B/C', 'B_C')
    .replace('B_C_NORMAL', 'B_C_Normal')
    .replace('B_C_SUP', 'B_C_Sup')
    .replace('GPX-S', 'GPX_S')
    .replace('E-GPX', 'E_GPX')
    .replace('E-CPT', 'E_CPT')
    .replace('CPT-S', 'CPT_S')
    .replace('E-COM', 'E_COM')

  if (Object.values(Grade).includes(normalizedGrade as Grade)) {
    return normalizedGrade as Grade
  }
  return null
}

export async function PUT(req: NextRequest, context: any) {
  try {
    const id = parseInt(context.params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 })
    }

    const { prenom, nom, grade, poste, statut, telephone, formations = [] } = await req.json()

    if (!prenom || !nom || !poste) {
      return NextResponse.json(
        { error: 'Les champs prénom, nom et poste sont obligatoires' },
        { status: 400 }
      )
    }

    const validatedGrade = validateGrade(grade)
    const validFormations = Array.isArray(formations) ? formations : []

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
    })

    return NextResponse.json({
      ...updatedEffectif,
      formations: Array.isArray(updatedEffectif.formations) ? updatedEffectif.formations : []
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'effectif:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, context: any) {
  try {
    const id = parseInt(context.params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 })
    }

    await prisma.effectif.delete({
      where: { id }
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error("Erreur lors de la suppression de l'effectif:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

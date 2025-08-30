import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const enqueteId = searchParams.get('enqueteId');
  const sectionId = searchParams.get('sectionId');

  if (!enqueteId) {
    return NextResponse.json(
      { error: 'Le paramètre enqueteId est requis' },
      { status: 400 }
    );
  }

  try {
    const whereClause = {
      enqueteId: parseInt(enqueteId),
      ...(sectionId && { sectionId }),
    };

    const sections = await prisma.enqueteSection.findMany({
      where: whereClause,
    });

    return NextResponse.json(sections);
  } catch (error) {
    console.error('Erreur lors de la récupération des sections :', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des sections' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { enqueteId, sectionId, data } = await request.json();

    if (!enqueteId || !sectionId) {
      return NextResponse.json(
        { error: 'Les paramètres enqueteId et sectionId sont requis' },
        { status: 400 }
      );
    }

    const section = await prisma.enqueteSection.upsert({
      where: {
        enqueteId_sectionId: {
          enqueteId: parseInt(enqueteId),
          sectionId,
        },
      },
      update: {
        data,
      },
      create: {
        enqueteId: parseInt(enqueteId),
        sectionId,
        data,
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la section :', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde de la section' },
      { status: 500 }
    );
  }
}

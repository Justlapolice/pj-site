import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const enquete = await prisma.enquete.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!enquete) {
      return NextResponse.json(
        { error: "Enquête non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(enquete, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'enquête:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'enquête" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { statut } = body;

    if (!statut) {
      return NextResponse.json({ error: "Statut manquant" }, { status: 400 });
    }

    const updatedEnquete = await prisma.enquete.update({
      where: { id: parseInt(params.id) },
      data: { statut },
    });

    return NextResponse.json(updatedEnquete, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut de l'enquête:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du statut de l'enquête" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { objet, accusations, directeur, directeurAdjoint, statut } = body;

    if (!objet || !accusations || !directeur || !directeurAdjoint || !statut) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    const updatedEnquete = await prisma.enquete.update({
      where: { id: parseInt(params.id) },
      data: {
        objet,
        accusations,
        directeur,
        directeurAdjoint,
        statut,
      },
    });

    return NextResponse.json(updatedEnquete, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'enquête:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'enquête" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const existingEnquete = await prisma.enquete.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!existingEnquete) {
      return NextResponse.json(
        { error: "Enquête non trouvée" },
        { status: 404 }
      );
    }

    await prisma.enquete.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json(
      { message: "Enquête supprimée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression de l'enquête:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'enquête" },
      { status: 500 }
    );
  }
}

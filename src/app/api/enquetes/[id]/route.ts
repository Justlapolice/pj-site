import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // ⬅️ adapte le chemin selon ton projet

type Context = {
  params: {
    id: string;
  };
};

// GET
export async function GET(req: NextRequest, { params }: Context) {
  const id = parseInt(params.id);

  try {
    const enquete = await prisma.enquete.findUnique({
      where: { id },
    });

    if (!enquete) {
      return NextResponse.json(
        { error: "Enquête non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(enquete);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'enquête:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH
export async function PATCH(req: NextRequest, { params }: Context) {
  const id = parseInt(params.id);

  try {
    const body = await req.json();
    const { statut } = body;

    if (!statut) {
      return NextResponse.json({ error: "Statut manquant" }, { status: 400 });
    }

    const updatedEnquete = await prisma.enquete.update({
      where: { id },
      data: { statut },
    });

    return NextResponse.json(updatedEnquete);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'enquête:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT
export async function PUT(req: NextRequest, { params }: Context) {
  const id = parseInt(params.id);

  try {
    const body = await req.json();
    const { objet, accusations, directeur, directeurAdjoint, statut } = body;

    if (!objet || !accusations || !directeur || !directeurAdjoint || !statut) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    const updatedEnquete = await prisma.enquete.update({
      where: { id },
      data: {
        objet,
        accusations,
        directeur,
        directeurAdjoint,
        statut,
      },
    });

    return NextResponse.json(updatedEnquete);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'enquête:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: NextRequest, { params }: Context) {
  const id = parseInt(params.id);

  try {
    const existingEnquete = await prisma.enquete.findUnique({
      where: { id },
    });

    if (!existingEnquete) {
      return NextResponse.json(
        { error: "Enquête non trouvée" },
        { status: 404 }
      );
    }

    await prisma.enquete.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Enquête supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'enquête:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

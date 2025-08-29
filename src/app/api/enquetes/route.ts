import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type EnqueteData = {
  objet: string;
  accusations: string;
  directeur: string;
  directeurAdjoint: string;
  statut: string;
};

export async function GET() {
  try {
    const enquetes = await prisma.enquete.findMany();
    return NextResponse.json(enquetes);
  } catch (error) {
    console.error("Erreur lors de la récupération des enquetes:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des enquetes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { objet, accusations, directeur, directeurAdjoint, statut } =
      await request.json() as EnqueteData;
      
    const enquete = await prisma.enquete.create({
      data: {
        objet,
        accusations,
        directeur,
        directeurAdjoint,
        statut: statut || "En cours",
      },
    });
    return NextResponse.json(enquete);
  } catch (error) {
    console.error("Erreur lors de la création de l'enquete:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'enquete" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json(
        { error: "ID de l'enquête manquant" },
        { status: 400 }
      );
    }

    const { objet, accusations, directeur, directeurAdjoint, statut } =
      await request.json() as EnqueteData;

    const updatedEnquete = await prisma.enquete.update({
      where: { id: parseInt(id) },
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
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'enquête" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { enqueteId, content } = await request.json();

    if (!enqueteId || !content) {
      return NextResponse.json(
        { error: "enqueteId et content sont requis" },
        { status: 400 }
      );
    }

    const note = await prisma.noteEnquetes.create({
      data: {
        enqueteId: Number(enqueteId),
        content,
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la note:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la note" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const enqueteId = searchParams.get("enqueteId");

    if (!enqueteId) {
      return NextResponse.json(
        { error: "enqueteId est requis" },
        { status: 400 }
      );
    }

    const notes = await prisma.noteEnquetes.findMany({
      where: {
        enqueteId: Number(enqueteId),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Erreur lors de la récupération des notes:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des notes" },
      { status: 500 }
    );
  }
}

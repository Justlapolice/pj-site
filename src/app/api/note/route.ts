import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  const note = await prisma.note.findFirst();
  return NextResponse.json(note || { content: "" });
}

export async function POST(req: Request) {
  const { content } = await req.json();
  let note = await prisma.note.findFirst();
  if (note) {
    note = await prisma.note.update({
      where: { id: note.id },
      data: { content },
    });
  } else {
    note = await prisma.note.create({ data: { content } });
  }
  return NextResponse.json(note);
}

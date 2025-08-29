import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    const testConnection = await prisma.$queryRaw`SELECT 1 as test`;
    return NextResponse.json({ success: true, data: testConnection });
  } catch (error) {
    console.error("Erreur de connexion à la base de données", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur de connexion à la base de données",
        details: error as string,
      },
      { status: 500 }
    );
  }
}

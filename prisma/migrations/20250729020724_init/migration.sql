-- CreateEnum
CREATE TYPE "Grade" AS ENUM ('PA', 'E_GPX', 'GPX_S', 'GPX', 'B_C_Normal', 'B_C_Sup', 'MAJ', 'MEEX', 'MAJRULP', 'E_CPT', 'CPT_S', 'LTN', 'CNE', 'CDT', 'CDTD', 'CDTEF', 'E_COM', 'COM', 'CD', 'CG');

-- CreateTable
CREATE TABLE "effectif" (
    "id" SERIAL NOT NULL,
    "prenom" VARCHAR(50) NOT NULL,
    "nom" VARCHAR(50) NOT NULL,
    "grade" "Grade",
    "poste" VARCHAR(100) NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'Actif',
    "telephone" VARCHAR(20),
    "formations" JSONB DEFAULT '[]',
    "dateArrivee" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "effectif_pkey" PRIMARY KEY ("id")
);

/*
  Warnings:

  - The `grade` column on the `effectif` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."effectif" ALTER COLUMN "prenom" SET DATA TYPE TEXT,
ALTER COLUMN "nom" SET DATA TYPE TEXT,
DROP COLUMN "grade",
ADD COLUMN     "grade" TEXT,
ALTER COLUMN "poste" SET DATA TYPE TEXT,
ALTER COLUMN "telephone" SET DATA TYPE TEXT;

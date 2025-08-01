-- CreateTable
CREATE TABLE "outfits" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageAlt" VARCHAR(255),
    "secondImageUrl" TEXT,
    "secondImageAlt" VARCHAR(255),
    "items" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" VARCHAR(255),

    CONSTRAINT "outfits_pkey" PRIMARY KEY ("id")
);

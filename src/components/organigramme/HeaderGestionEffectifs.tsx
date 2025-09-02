"use client";
import Image from "next/image";

interface HeaderProps {
  displayName: string;
}

export default function HeaderGestionEffectifs({
  displayName,
}: { displayName: string } & HeaderProps) {
  return (
    <header className="bg-[rgba(5,12,48,0.95)] backdrop-blur-md border-b border-[rgba(10,20,60,0.6)] sticky top-0 z-10 shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <a href="/accueil">
              <Image
                src="/pjlogo.png"
                alt="Logo CRS"
                width={100}
                height={100}
                className="h-10 w-auto hover:scale-105 transition-transform duration-300"
              />
            </a>
            <a
              href="/accueil"
              className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"
            >
              Intranet Police Judiciaire
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <span className="text-gray-200 text-sm">
              Connecté en tant que:{" "}
              <span className="text-blue-400 font-semibold">{displayName}</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

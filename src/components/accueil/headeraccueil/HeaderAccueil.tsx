"use client";
import Image from "next/image";

export default function HeaderAccueil({
  displayName,
}: {
  displayName: string;
}) {
  return (
    <header className="bg-[rgba(5,12,48,1)] backdrop-blur-md border-b border-[rgba(10,20,60,0.6)] sticky top-0 z-10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <a href="/accueil">
              <Image
                src="/pjlogo.png"
                alt="Logo PJ"
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
            <span className="text-gray-300 text-sm">
              Connecté en tant que:{" "}
              <span className="text-blue-400 font-medium">{displayName}</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

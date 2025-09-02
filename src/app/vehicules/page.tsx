"use client";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/sidebar/sidebar";

import { VehiculeSection } from "../../components/vehicules/VehiculeSection";
import { VehiculeHeader } from "../../components/vehicules/VehiculeHeader";
import { VehiculeNotes } from "../../components/vehicules/VehiculeNotes";
import Image from "next/image";

// Véhicule bana

const bana = [
  {
    title: "Dacia Duster CRS",
    items: [
      { label: "Nom dans le garage", value: "suvcrs" },
      {
        label: "Utilisation",
        value: "TV CRS/Secours en Montagne/Autoroutière",
      },
      { label: "Qui peut le prendre ?", value: "Tout le monde" },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_images/dacia_duster_crs.png",
  },
  {
    title: "Peugeot Expert PMV",
    items: [
      { label: "Nom dans le garage", value: "vancrs" },
      { label: "Utilisation", value: "Autoroutière" },
      { label: "Qui peut le prendre ?", value: "Tout le monde" },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_images/peugeot_expert_pmv.png",
  },
  {
    title: "Renault Mégane IV",
    items: [
      { label: "Nom dans le garage", value: "voiturecrs1" },
      { label: "Utilisation", value: "TV CRS/Autoroutière" },
      { label: "Qui peut le prendre ?", value: "Tout le monde" },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_images/renault_megane_IV.png",
  },
  {
    title: "Peugeot Rifter",
    items: [
      { label: "Nom dans le garage", value: "voiturepn10" },
      { label: "Utilisation", value: "TV CRS/Autoroutière" },
      { label: "Qui peut le prendre ?", value: "Tout le monde" },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_images/peugeot_rifter.png",
  },
  {
    title: "Renault Scénic",
    items: [
      { label: "Nom dans le garage", value: "voituremcpn2" },
      { label: "Utilisation", value: "TV CRS" },
      { label: "Qui peut le prendre ?", value: "Tout le monde" },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_images/renault_scenic.png",
    secondImageSrc: "/vehicules_images/renault_scenic_2.png",
  },
];

// Véhicule perso

const perso = [
  {
    title: "YAMAHA 1250 GS",
    items: [
      { label: "Nom dans le garage", value: "motopn1" },
      { label: "Utilisation", value: "Tango Mike/Autoroutière" },
      { label: "Qui peut le prendre ?", value: "Tout le monde" },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_images/yamaha_1250_gs.png",
  },
  {
    title: "YAMAHA FJR 1200",
    items: [
      { label: "Nom dans le garage", value: "motoixpn1" },
      { label: "Utilisation", value: "Tango Mike/Autoroutière" },
      { label: "Qui peut le prendre ?", value: "Tout le monde" },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_images/yamaha_fjr_1200.png",
  },
  {
    title: "YAMAHA MT 09",
    items: [
      { label: "Nom dans le garage", value: "motoixpn2" },
      { label: "Utilisation", value: "Tango Mike/Autoroutière" },
      { label: "Qui peut le prendre ?", value: "Tout le monde" },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_imagesyamaha_mt_09.png",
  },
  {
    title: "BMW 1250 RT",
    items: [
      { label: "Nom dans le garage", value: "motomcpn1" },
      { label: "Utilisation", value: "Tango Mike/Autoroutière" },
      { label: "Qui peut le prendre ?", value: "Tout le monde" },
      { label: "Nombre d'exemplaire", value: "10" },
    ],
    image: "/vehicules_images/bmw_1250_rt.png",
  },
  {
    title: "YAMAHA XTZ",
    items: [
      { label: "Nom dans le garage", value: "motomcpn4" },
      { label: "Utilisation", value: "Tango Mike/Autoroutière" },
      { label: "Qui peut le prendre ?", value: "Tout le monde" },
      { label: "Nombre d'exemplaire", value: "06" },
    ],
    image: "/vehicules_images/yamaha_xtz.png",
  },
  {
    title: "YAMAHA 1250 GS Bana",
    items: [
      { label: "Nom dans le garage", value: "motocrs1bana" },
      { label: "Utilisation", value: "Tango Mike/Autoroutière" },
      { label: "Qui peut le prendre ?", value: "Tout le monde" },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_images/yamaha_1250_gs_banalisee.png",
  },
  {
    title: "BMW 1250 RT Bana",
    items: [
      { label: "Nom dans le garage", value: "motomcbanapn2" },
      { label: "Utilisation", value: "Tango Mike/Autoroutière" },
      { label: "Qui peut le prendre ?", value: "Tout le monde" },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_images/bmw_1250_rt_banalisee.png",
  },
  {
    title: "YAMAHA FJR 1200 Bana",
    items: [
      { label: "Nom dans le garage", value: "motomcbanapn" },
      { label: "Utilisation", value: "Tango Mike/Autoroutière" },
      { label: "Qui peut le prendre ?", value: "Tout le monde" },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_images/yamaha_fjr_1200_banalisee.png",
  },
];

function VehiculesCRS() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as
    | { guildNickname?: string; name?: string | null; roles?: string[] }
    | undefined;
  const displayName = user?.guildNickname || user?.name || "Utilisateur";
  const cleanDisplayName = displayName.replace(/^\s*(\[[^\]]*\]\s*)+/g, "");

  // Vérification de l'authentification
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Déconnexion automatique toutes les heures
  useEffect(() => {
    const timer = setInterval(() => {
      signOut({
        callbackUrl: "/login",
      });
    }, 60 * 60 * 1000);

    return () => clearInterval(timer);
  }, []);

  // Génération des initiales
  const initials = cleanDisplayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (status === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-300">
            Chargement de la page {pathname} en cours...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex bg-gray-900">
      <Sidebar displayName={displayName} initials={initials} />

      <div className="flex-1 relative z-0 ml-[270px] w-[calc(100%-270px)]">
        {/* En-tête */}
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <a href="/accueil">
                  <Image
                    src="/pjlogo.png"
                    alt="Logo CRS"
                    width={40}
                    height={40}
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
                  <span className="text-blue-400 font-medium">
                    {cleanDisplayName}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-8">
          <VehiculeHeader
            title="Véhicules Officiels CRS"
            description="Vous retrouvez ici les véhicules de la CRS à utiliser en fonction de vos missions et grades"
          />

          <VehiculeNotes />

          <VehiculeSection title="Banalisé" vehicules={bana} />

          <VehiculeSection title="Véhicules personnels" vehicules={perso} />
        </main>
      </div>
    </div>
  );
}

export default VehiculesCRS;

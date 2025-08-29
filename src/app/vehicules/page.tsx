"use client";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "../../components/sidebar/sidebar";

import { VehiculeSection } from "../../components/vehicules/VehiculeSection";
import { VehiculeHeader } from "../../components/vehicules/VehiculeHeader";
import { VehiculeNotes } from "../../components/vehicules/VehiculeNotes";

const vehicules = [
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
    image: "/vehicules_images/tvcrsetautre/dacia_duster_crs.png",
  },
  {
    title: "Peugeot Expert PMV",
    items: [
      { label: "Nom dans le garage", value: "vancrs" },
      { label: "Utilisation", value: "Autoroutière" },
      { label: "Qui peut le prendre ?", value: "Tout le monde" },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_images/autoroute/peugeot_expert_pmv.png",
    secondImageSrc: "/vehicules_images/autoroute/peugeot_expert_pmv2.png",
  },
  {
    title: "Renault Mégane IV",
    items: [
      { label: "Nom dans le garage", value: "voiturecrs1" },
      { label: "Utilisation", value: "TV CRS/Autoroutière" },
      { label: "Qui peut le prendre ?", value: "Tout le monde" },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_images/autoroute/renault_megane_IV.png",
  },
  {
    title: "Peugeot Rifter",
    items: [
      { label: "Nom dans le garage", value: "voiturepn10" },
      { label: "Utilisation", value: "TV CRS/Autoroutière" },
      { label: "Qui peut le prendre ?", value: "Tout le monde" },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_images/autoroute/peugeot_rifter.png",
    secondImageSrc: "/vehicules_images/autoroute/peugeot_rifter_2.png",
  },
  {
    title: "Renault Scénic",
    items: [
      { label: "Nom dans le garage", value: "voituremcpn2" },
      { label: "Utilisation", value: "TV CRS" },
      { label: "Qui peut le prendre ?", value: "Tout le monde" },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_images/tvcrsetautre/renault_scenic.png",
    secondImageSrc: "/vehicules_images/tvcrsetautre/renault_scenic_2.png",
  },
];

const moto = [
  {
    title: "YAMAHA 1250 GS",
    items: [
      { label: "Nom dans le garage", value: "motopn1" },
      { label: "Utilisation", value: "Tango Mike/Autoroutière" },
      { label: "Qui peut le prendre ?", value: "Tout le monde" },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_images/moto/yamaha_1250_gs.png",
  },
  {
    title: "YAMAHA FJR 1200",
    items: [
      { label: "Nom dans le garage", value: "motoixpn1" },
      { label: "Utilisation", value: "Tango Mike/Autoroutière" },
      { label: "Qui peut le prendre ?", value: "Tout le monde" },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_images/moto/yamaha_fjr_1200.png",
  },
  {
    title: "YAMAHA MT 09",
    items: [
      { label: "Nom dans le garage", value: "motoixpn2" },
      { label: "Utilisation", value: "Tango Mike/Autoroutière" },
      { label: "Qui peut le prendre ?", value: "Tout le monde" },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_images/moto/yamaha_mt_09.png",
  },
  {
    title: "BMW 1250 RT",
    items: [
      { label: "Nom dans le garage", value: "motomcpn1" },
      { label: "Utilisation", value: "Tango Mike/Autoroutière" },
      { label: "Qui peut le prendre ?", value: "Tout le monde" },
      { label: "Nombre d'exemplaire", value: "10" },
    ],
    image: "/vehicules_images/moto/bmw_1250_rt.png",
  },
  {
    title: "YAMAHA XTZ",
    items: [
      { label: "Nom dans le garage", value: "motomcpn4" },
      { label: "Utilisation", value: "Tango Mike/Autoroutière" },
      { label: "Qui peut le prendre ?", value: "Tout le monde" },
      { label: "Nombre d'exemplaire", value: "06" },
    ],
    image: "/vehicules_images/moto/yamaha_xtz.png",
  },
  {
    title: "YAMAHA 1250 GS Bana",
    items: [
      { label: "Nom dans le garage", value: "motocrs1bana" },
      { label: "Utilisation", value: "Tango Mike/Autoroutière" },
      { label: "Qui peut le prendre ?", value: "Tout le monde" },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_images/moto/yamaha_1250_gs_banalisee.png",
  },
  {
    title: "BMW 1250 RT Bana",
    items: [
      { label: "Nom dans le garage", value: "motomcbanapn2" },
      { label: "Utilisation", value: "Tango Mike/Autoroutière" },
      { label: "Qui peut le prendre ?", value: "Tout le monde" },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_images/moto/bmw_1250_rt_banalisee.png",
  },
  {
    title: "YAMAHA FJR 1200 Bana",
    items: [
      { label: "Nom dans le garage", value: "motomcbanapn" },
      { label: "Utilisation", value: "Tango Mike/Autoroutière" },
      { label: "Qui peut le prendre ?", value: "Tout le monde" },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_images/moto/yamaha_fjr_1200_banalisee.png",
  },
];

const CRS8Vehicules = [
  {
    title: "Fiat Ducato III CRS 8",
    items: [
      { label: "Nom dans le garage", value: "suvcrs" },
      { label: "Utilisation", value: "Mission CRS 8" },
      {
        label: "Qui peut le prendre ?",
        value: "UNIQUEMENT LES MEMBRES DE LA CRS 8",
      },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_images/crs8/fiat_ducato_III.png",
  },
  {
    title: "Ford Ranger CRS 8",
    items: [
      { label: "Nom dans le garage", value: "suvbana1" },
      { label: "Utilisation", value: "Mission CRS 8" },
      {
        label: "Qui peut le prendre ?",
        value: "UNIQUEMENT LES MEMBRES DE LA CRS 8",
      },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_images/crs8/ford_ranger.png",
  },
  {
    title: "Peugeot 5008 CRS 8",
    items: [
      { label: "Nom dans le garage", value: "vhlbanapn5" },
      { label: "Utilisation", value: "Mission CRS 8" },
      {
        label: "Qui peut le prendre ?",
        value: "UNIQUEMENT LES MEMBRES DE LA CRS 8",
      },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_images/crs8/peugeot_5008.png",
  },
  {
    title: "Skoda Kodiaq CRS 8",
    items: [
      { label: "Nom dans le garage", value: "voiturebanapn7" },
      { label: "Utilisation", value: "Mission CRS 8" },
      {
        label: "Qui peut le prendre ?",
        value: "UNIQUEMENT LES MEMBRES DE LA CRS 8",
      },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_images/crs8/skoda_kodiaq.png",
  },
];

const MaintienOrdreVehicules = [
  {
    title: "Renault Master MO",
    items: [
      { label: "Nom dans le garage", value: "vancrs2" },
      { label: "Utilisation", value: "Mission MO" },
      {
        label: "Qui peut le prendre ?",
        value: "Seulement en cas de déploiement MO",
      },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_images/mo/renault_master_mo.png",
    secondImageSrc: "/vehicules_images/mo/renault_master_mo_2.png", // À ajouter ultérieurement
  },
  {
    title: "Camion Lanceur d'Eau",
    items: [
      { label: "Nom dans le garage", value: "camioncrsv2" },
      { label: "Utilisation", value: "Mission MO" },
      { label: "Qui peut le prendre ?", value: "Responsable, Directeur " },
      { label: "Nombre d'exemplaire", value: "03" },
    ],
    image: "/vehicules_images/mo/camion_lanceur_d_eau.png",
  },
];

const ERIVehicules = [
  {
    title: "Cupra Leon ERI",
    items: [
      { label: "Nom dans le garage", value: "banakbpn5" },
      { label: "Utilisation", value: "Mission ERI, Banalisé, Autoroutière" },
      {
        label: "Qui peut le prendre ?",
        value: "Responsable Adjoint, Responsable, Directeur",
      },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_images/eri/cupra_leon_eri.png",
  },
];

const MaritimeVehicules = [
  {
    title: "Bateau Maritime",
    items: [
      { label: "Nom dans le garage", value: "bateaupn1" },
      { label: "Utilisation", value: "Mission Nautique" },
      {
        label: "Qui peut le prendre ?",
        value: "Responsable Adjoint, Responsable, Directeur",
      },
      { label: "Nombre d'exemplaire", value: "04" },
    ],
    image: "/vehicules_images/maritime/bateau_maritime.png",
  },
];

function VehiculesCRS() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const displayName =
    session?.user?.guildNickname || session?.user?.name || "Utilisateur";
  const pathname = usePathname();

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
  const initials = displayName
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
                  <img
                    src="/pjlogo.png"
                    alt="Logo CRS"
                    className="h-10 w-auto"
                  />
                </a>
                <a
                  href="/accueil"
                  className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"
                >
                  Intranet CRS
                </a>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <span className="text-gray-300 text-sm">
                  Connecté en tant que:{" "}
                  <span className="text-blue-400 font-medium">
                    {displayName}
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

          <VehiculeSection
            title="TV CRS/Secours en Montagne/Autoroutière"
            vehicules={vehicules}
          />

          <VehiculeSection title="Moto (Tango Mike)" vehicules={moto} />

          <VehiculeSection title="CRS 8" vehicules={CRS8Vehicules} />

          <VehiculeSection
            title="Maintien de l'Ordre"
            vehicules={MaintienOrdreVehicules}
          />

          <VehiculeSection title="ERI" vehicules={ERIVehicules} />

          <VehiculeSection title="Maritime" vehicules={MaritimeVehicules} />
        </main>
      </div>
    </div>
  );
}

export default VehiculesCRS;

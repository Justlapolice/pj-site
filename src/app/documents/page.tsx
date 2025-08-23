// Page information crs

"use client";
import React, { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "../../../components/sidebar/sidebar";
import { motion } from "framer-motion";
import { FaFileAlt, FaFileInvoiceDollar, FaShip } from "react-icons/fa";
import { FaMotorcycle, FaCar, FaTruck } from "react-icons/fa6";

// Composant de carte réutilisable
const InfoCard = ({
  title,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) => (
  <motion.div
    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 h-full flex flex-col"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <div className="flex items-center mb-4">
      <div className="p-2 bg-blue-600/20 rounded-lg mr-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
    </div>
    <div className="text-gray-300 flex-1">{children}</div>
  </motion.div>
);

export default function InfoCrs() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const displayName =
    session?.user?.guildNickname || session?.user?.name || "Utilisateur";
  const pathname = usePathname();

  // Le style de fond est géré dans globals.css

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
    <div className="min-h-screen text-white flex">
      <Sidebar displayName={displayName} initials={initials} />
      <div className="flex-1 ml-[270px] relative z-10">
        {/* En-tête */}
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <a href="/accueil">
                  <img
                    src="/crslogo.svg"
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

        <div className="flex">
          {/* Barre latérale */}
          <Sidebar displayName={displayName} initials={initials} />

          {/* Contenu principal */}
          <main className="flex-1 p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center">
                Accès au différents documents de la CRS{" "}
                <img
                  src="/crslogo.svg"
                  alt="Logo CRS"
                  className="h-10 w-auto"
                />
              </h2>
            </motion.div>

            {/* Grille de raccourcis */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <InfoCard
                title="Amendes CRS 2025"
                icon={<FaFileInvoiceDollar className="w-5 h-5 text-blue-400" />}
              >
                <p>
                  Consultez cette page pour avoir le tableau des différents
                  amendes à mettre en fonction de leurs gravités avec leurs
                  numéros de classements, les prixs, les points à retiré.
                </p>
                <button
                  onClick={() => router.push("/documents/amendescrs")}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  → Voir le document
                </button>
              </InfoCard>

              <InfoCard
                title="Formation BMU 2025"
                icon={<FaMotorcycle className="w-5 h-5 text-blue-400" />}
              >
                <p>
                  Voici le document officielle de la formation BMU de la CRS.
                </p>
                <button
                  onClick={() => router.push("/documents/formationbmu")}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  → Voir la formation
                </button>
              </InfoCard>

              <InfoCard
                title="Formation ERI 2025"
                icon={<FaCar className="w-5 h-5 text-blue-400" />}
              >
                <p>
                  Voici le document officielle de la formation ERI de la CRS.
                </p>
                <button
                  onClick={() => router.push("/documents/formationeri")}
                  className="mt-3 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  Voir la formation →
                </button>
              </InfoCard>

              <InfoCard
                title="Formation Maritime 2025"
                icon={<FaShip className="w-5 h-5 text-blue-400" />}
              >
                <p>
                  Voici le document officielle de la formation Maritime de la
                  CRS.
                </p>
                <button
                  onClick={() => router.push("/documents/formationmaritime")}
                  className="mt-3 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  Voir la formation →
                </button>
              </InfoCard>

              <InfoCard
                title="Formation MO 2025"
                icon={<FaTruck className="w-5 h-5 text-blue-400" />}
              >
                <p>
                  Voici le document officielle de la formation Maintien de
                  l'Ordre de la CRS (document temporaire).
                </p>
                <button
                  onClick={() => router.push("/documents/formationmo")}
                  className="mt-3 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  Voir la formation →
                </button>
              </InfoCard>

              <InfoCard
                title="Les Sous Spécialités de la Compagnie Républicaines de Sécurité 2025"
                icon={<FaFileAlt className="w-5 h-5 text-blue-400" />}
              >
                <p>
                  Voici le document officielle des sous spécialités de la CRS.
                </p>
                <button
                  onClick={() => router.push("/documents/sous-spe-crs")}
                  className="mt-3 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  Voir les sous spécialités →
                </button>
              </InfoCard>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

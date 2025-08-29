"use client";
import React, { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "../../components/sidebar/sidebar";
import { motion } from "framer-motion";

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

export default function InfoPJ() {
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

  // Déconnexion automatique toutes les heuress
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
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <a href="/accueil">
                  <img
                    src="/pjlogo.png"
                    alt="Logo PJ"
                    className="h-10 w-auto"
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
                    {displayName}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          <Sidebar displayName={displayName} initials={initials} />
          <main className="flex-1 p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center">
                Présentation de la Police Judiciaire{" "}
                <img src="/pjlogo.png" alt="Logo PJ" className="h-10 w-auto" />
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <InfoCard
                title="Date de création"
                icon={
                  <img
                    src="/pjlogo.png"
                    alt="Logo PJ"
                    className="h-10 w-auto"
                  />
                }
              >
                <p className="mb-3">DATE DE CREATION DE LA PJ</p>
              </InfoCard>

              <InfoCard
                title="Nos missions"
                icon={
                  <img
                    src="/pjlogo.png"
                    alt="Logo CRS"
                    className="h-10 w-auto"
                  />
                }
              >
                <p>La Police Judiciaire à plusieurs missions les voici : </p>
                <ul>
                  <li>● MISSION 1</li>
                  <li>● MISSION 2</li>
                  <li>● MISSION 3</li>
                  <li>● MISSION 4</li>
                  <li>● MISSION 5</li>
                </ul>
              </InfoCard>

              <InfoCard
                title="Nos sous-spécialités"
                icon={
                  <img
                    src="/pjlogo.png"
                    alt="Logo CRS"
                    className="h-10 w-auto"
                  />
                }
              >
                <p>
                  Dans cette partie vous retrouverais les différents services de
                  la Police Judiciaire.
                </p>
                <ul>
                  <li>● SOUS SPE 1</li>
                  <li>● SOUS SPE 2</li>
                  <li>● SOUS SPE 3</li>
                  <li>● SOUS SPE 4</li>
                  <li>● SOUS SPE 5</li>
                </ul>
              </InfoCard>
              <InfoCard
                title="Réglement de la Police Judiciaire"
                icon={
                  <img
                    src="/pjlogo.png"
                    alt="Logo CRS"
                    className="h-10 w-auto"
                  />
                }
              >
                <p>
                  Dans cette partie vous trouverais le règlement de la Police
                  Judiciaire.
                </p>
                <ul>
                  <li>● Règlement 1</li>
                  <li>● Règlement 2</li>
                  <li>● Règlement 3</li>
                  <li>● Règlement 4</li>
                  <li>● Règlement 5</li>
                </ul>
              </InfoCard>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

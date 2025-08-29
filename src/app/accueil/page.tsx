// Page accueil

"use client";
import { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Sidebar from "../../components/sidebar/sidebar";
import { motion } from "framer-motion";
import { Effectif } from "@prisma/client";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import BlocNote from "../../components/note/BlocNote";
import { toast } from "../../components/ui/use-toast";

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

export default function AccueilIntranet() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as
    | { guildNickname?: string; name?: string | null }
    | undefined;
  const displayName = user?.guildNickname || user?.name || "Utilisateur";
  const pathname = usePathname();
  const [effectifs, setEffectifs] = useState<Effectif[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Vérification de l'authentification
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      const justLoggedIn = searchParams.get("justLoggedIn");
      if (justLoggedIn) {
        toast({
          title: "Authentification réussie",
          description: `Tu es authentifié en tant que ${displayName}.`,
          variant: "success",
        });
        // Nettoyer l'URL pour éviter de réafficher le toast au rafraîchissement
        router.replace("/accueil");
      }
    }
  }, [status, searchParams, displayName, router]);

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

  // Récupération des données des effectifs
  useEffect(() => {
    const fetchEffectifs = async () => {
      try {
        const response = await fetch("/api/effectifs");
        if (!response.ok)
          throw new Error("Erreur lors du chargement des données");

        const data = await response.json();
        setEffectifs(data);
      } catch (err) {
        console.error("Erreur:", err);
        setError("Impossible de charger les données");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEffectifs();
  }, []);

  const { totalEffectifs } = useMemo(() => {
    const total = effectifs.length;
    return {
      totalEffectifs: total,
    };
  }, [effectifs]);

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
        <header className="bg-[rgba(5,12,48,1)] backdrop-blur-md border-b border-[rgba(10,20,60,0.6)] sticky top-0 z-10">
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

        <main className="flex-1 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Bonjour, {displayName}
            </h2>
            <p className="text-gray-400 mb-2">
              Bienvenue sur votre espace personnel
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <InfoCard
              title="Effectif Total"
              icon={<UserGroupIcon className="h-6 w-6 text-blue-400" />}
            >
              <p className="text-3xl font-bold text-white mb-1">
                {totalEffectifs}
              </p>
              <p className="text-sm text-gray-400">Membres au total</p>
            </InfoCard>

            <InfoCard
              title="Bloc-note"
              icon={<UserGroupIcon className="h-6 w-6 text-blue-400" />}
            >
              <BlocNote roles={user?.roles || []} />
            </InfoCard>
          </div>
        </main>
      </div>
    </div>
  );
}

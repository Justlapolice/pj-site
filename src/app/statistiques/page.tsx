"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Sidebar from "../../components/sidebar/sidebar";
import {
  ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import ProgressBar from "../../components/ui/ProgressBar";
import InterventionStats from "../../components/statistics/InterventionStats";

type Formation = "PJ" | "PTS" | "Moto" | "Nautique" | "Négociateur";
type Statut = "Actif" | "Non actif";

interface Effectif {
  id: number;
  prenom: string;
  nom: string;
  grade?: string;
  poste: string;
  statut: Statut;
  telephone?: string;
  formations: Formation[];
}

interface User extends Record<string, any> {
  guildNickname?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  roles?: string[];
}

type FormationStats = {
  nom: string;
  count: number;
  percentage: number;
};

type PosteStats = {
  nom: string;
  count: number;
  percentage: number;
};

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

export default function StatistiquesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [effectifs, setEffectifs] = useState<Effectif[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = session?.user as User | undefined;
  const displayName = user?.guildNickname || user?.name || "Utilisateur";

  const allowedRoles = ["1117516088196997181", "1358837249751384291"];

  const hasAccess =
    user?.roles?.some((role) => allowedRoles.includes(role)) || false;

  // Génération des initiales
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Vérification de l'authentification et des autorisations
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && !hasAccess) {
      router.push("/accueil");
    }
  }, [status, hasAccess, router]);

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

    if (hasAccess) {
      fetchEffectifs();
    }
  }, [hasAccess]);

  const { totalEffectifs, effectifsActifs, formationsTriees, postesTries } =
    useMemo(() => {
      const total = effectifs.length;
      const actifs = effectifs.filter((e) => e.statut === "Actif").length;

      const formationsStats = effectifs.reduce((acc, effectif) => {
        effectif.formations.forEach((formation) => {
          acc[formation] = (acc[formation] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>);

      const postesStats = effectifs.reduce((acc, effectif) => {
        acc[effectif.poste] = (acc[effectif.poste] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const formationsTriees = Object.entries(formationsStats)
        .sort((a, b) => b[1] - a[1])
        .map(([nom, count]) => ({
          nom,
          count,
          percentage: Math.round((count / total) * 100) || 0,
        }));

      const ordrePostes = [
        "Directeur",
        "Responsable",
        "Responsable Adjoint",
        "Formateur",
        "Confirmé",
        "Stagiaire",
      ];

      const postesTries = ordrePostes
        .map((nom) => ({
          nom,
          count: postesStats[nom] || 0,
          percentage: postesStats[nom]
            ? Math.round((postesStats[nom] / total) * 100) || 0
            : 0,
        }))
        .filter((poste) => poste.count > 0 || ordrePostes.includes(poste.nom));

      return {
        totalEffectifs: total,
        effectifsActifs: actifs,
        formationsTriees,
        postesTries,
      };
    }, [effectifs]);

  if (status === "loading" || isLoading) {
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

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900">
        <div className="text-center p-6 max-w-md bg-gray-800/80 backdrop-blur-sm rounded-xl border border-red-500/50">
          <h3 className="text-xl font-semibold text-red-400 mb-2">Erreur</h3>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return null;
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

        <main className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <InfoCard
              title="Effectif Total"
              icon={<UserGroupIcon className="h-6 w-6 text-blue-400" />}
            >
              <p className="text-3xl font-bold text-white mb-1">
                {totalEffectifs}
              </p>
              <p className="text-sm text-gray-400">Membres au total</p>
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-green-400">
                    {effectifsActifs} actifs
                  </span>
                  <span className="text-gray-400">
                    {totalEffectifs > 0
                      ? Math.round((effectifsActifs / totalEffectifs) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <ProgressBar
                  value={effectifsActifs}
                  max={Math.max(totalEffectifs, 1)}
                  color="bg-green-500"
                />
              </div>
            </InfoCard>

            <InfoCard
              title="Disponibilité"
              icon={<ChartBarIcon className="h-6 w-6 text-amber-400" />}
            >
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-bold text-white">85%</p>
                <p className="text-lg text-gray-300">
                  ({effectifsActifs}/{totalEffectifs})
                </p>
              </div>
              <p className="text-sm text-gray-400">
                Taux de disponibilité (effectifs actifs/total)
              </p>
              <div className="mt-3">
                <ProgressBar value={85} max={100} color="bg-amber-400" />
                <p className="text-xs text-gray-400 mt-1">
                  Moyenne sur les 30 derniers jours
                </p>
              </div>
            </InfoCard>

            <InfoCard
              title="Formations"
              icon={<AcademicCapIcon className="h-6 w-6 text-purple-400" />}
            >
              <div className="text-3xl font-bold text-white mb-1">
                {formationsTriees.length}
              </div>
              <p className="text-sm text-gray-400">Types de formations</p>
              <div className="mt-3">
                <p className="text-sm text-gray-300">
                  <span className="text-purple-400 font-medium">
                    {formationsTriees[0]?.nom || "Aucune"}
                  </span>{" "}
                  est la plus courante
                </p>
              </div>
            </InfoCard>

            <InfoCard
              title="Dernière mise à jour"
              icon={<ArrowPathIcon className="h-6 w-6 text-cyan-400" />}
            >
              <p className="text-3xl font-bold text-white mb-1">
                {new Date().toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
              <p className="text-sm text-gray-400">Données actualisées</p>
              <div className="mt-3">
                <button
                  onClick={() => window.location.reload()}
                  className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1 rounded-md transition-colors flex items-center"
                >
                  <ArrowPathIcon className="h-3 w-3 mr-1" />
                  Actualiser
                </button>
              </div>
            </InfoCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InfoCard
              title="Répartition par formation"
              icon={<AcademicCapIcon className="h-6 w-6 text-purple-400" />}
            >
              <div className="space-y-4 mt-4">
                {formationsTriees.map((formation) => (
                  <div key={formation.nom} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-200">
                        {formation.nom}
                      </span>
                      <span className="text-gray-400">
                        {formation.count} ({formation.percentage}%)
                      </span>
                    </div>
                    <ProgressBar
                      value={formation.count}
                      max={totalEffectifs || 1}
                      color="bg-purple-500"
                    />
                  </div>
                ))}
                {formationsTriees.length === 0 && (
                  <p className="text-gray-400 text-center py-4">
                    Aucune donnée de formation disponible
                  </p>
                )}
              </div>
            </InfoCard>

            <InfoCard
              title="Répartition par poste"
              icon={<BriefcaseIcon className="h-6 w-6 text-blue-400" />}
            >
              <div className="space-y-4 mt-4">
                {postesTries.map((poste) => (
                  <div key={poste.nom} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-200">
                        {poste.nom || "Non spécifié"}
                      </span>
                      <span className="text-gray-400">
                        {poste.count} ({poste.percentage}%)
                      </span>
                    </div>
                    <ProgressBar
                      value={poste.count}
                      max={totalEffectifs || 1}
                      color="bg-blue-500"
                    />
                  </div>
                ))}
                {postesTries.length === 0 && (
                  <p className="text-gray-400 text-center py-4">
                    Aucune donnée de poste disponible
                  </p>
                )}
              </div>
            </InfoCard>
          </div>

          <div className="mt-8">
            <InfoCard
              title="Répartition des Interventions"
              icon={<ChartBarIcon className="h-6 w-6 text-green-400" />}
            >
              <div className="space-y-6 py-2">
                <InterventionStats />
                <div className="text-xs text-gray-400 text-center mt-4">
                  Données mises à jour le{" "}
                  {new Date().toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            </InfoCard>
          </div>
        </main>
      </div>
    </div>
  );
}

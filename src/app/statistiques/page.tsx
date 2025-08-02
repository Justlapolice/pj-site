// Page statistiques - Tableau de bord des statistiques
'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Sidebar from '@/components/ui/sidebar';
import { ChartBarIcon, UserGroupIcon, AcademicCapIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

// Définition des types
type Formation = 'CRS' | 'BMU' | 'MO' | 'Maritime' | 'ERI' | 'Secours en Montagne' | 'CRS 8';
type Statut = 'Actif' | 'Non actif';

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

// Composant de carte réutilisable
const InfoCard = ({ title, children, icon, className = '' }: { 
  title: string; 
  children: React.ReactNode; 
  icon: React.ReactNode;
  className?: string;
}) => (
  <motion.div 
    className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 h-full flex flex-col ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <div className="flex items-center mb-4">
      <div className="p-2 bg-blue-600/20 rounded-lg mr-3">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
    </div>
    <div className="text-gray-300 flex-1">
      {children}
    </div>
  </motion.div>
);

// Composant de barre de progression
const ProgressBar = ({ value, max, color = 'bg-blue-500' }: { value: number; max: number; color?: string }) => (
  <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
    <div 
      className={`${color} h-2.5 rounded-full`} 
      style={{ width: `${(value / max) * 100}%` }}
    ></div>
  </div>
);

export default function StatistiquesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [effectifs, setEffectifs] = useState<Effectif[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gestion sécurisée de la session utilisateur
  const user = session?.user as User | undefined;
  const displayName = user?.guildNickname || user?.name || 'Utilisateur';
  
  // Vérifier si l'utilisateur a le rôle requis pour accéder aux statistiques
  const hasAccess = user?.roles?.includes('1331527328219529216') || false;
  
  
  // Génération des initiales
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Vérification de l'authentification et des autorisations
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated' && !hasAccess) {
      router.push('/accueil');
    }
  }, [status, hasAccess, router]);

  // Récupération des données des effectifs
  useEffect(() => {
    const fetchEffectifs = async () => {
      try {
        const response = await fetch('/api/effectifs');
        if (!response.ok) throw new Error('Erreur lors du chargement des données');
        
        const data = await response.json();
        setEffectifs(data);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Impossible de charger les données');
      } finally {
        setIsLoading(false);
      }
    };

    if (hasAccess) {
      fetchEffectifs();
    }
  }, [hasAccess]);

  // Calcul des statistiques
  const totalEffectifs = effectifs.length;
  const effectifsActifs = effectifs.filter(e => e.statut === 'Actif').length;
  
  // Calcul des formations
  const formationsStats = effectifs.reduce((acc, effectif) => {
    effectif.formations.forEach(formation => {
      acc[formation] = (acc[formation] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  // Calcul des postes
  const postesStats = effectifs.reduce((acc, effectif) => {
    acc[effectif.poste] = (acc[effectif.poste] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Tri des formations par nombre décroissant
  const formationsTriees = Object.entries(formationsStats)
    .sort((a, b) => b[1] - a[1])
    .map(([formation, count]) => ({
      nom: formation,
      count,
      percentage: Math.round((count / totalEffectifs) * 100) || 0
    }));

  // Ordre prédéfini des postes
  const ordrePostes = [
    'Directeur',
    'Responsable',
    'Responsable Adjoint',
    'Formateur',
    'Confirmé',
    'Stagiaire'
  ];

  // Tri des postes selon l'ordre prédéfini
  const postesTries = ordrePostes
    .map(poste => ({
      nom: poste,
      count: postesStats[poste] || 0,
      percentage: postesStats[poste] 
        ? Math.round((postesStats[poste] / totalEffectifs) * 100) || 0 
        : 0
    }))
    .filter(poste => poste.count > 0 || ordrePostes.includes(poste.nom));

  if (status === 'loading' || isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-300">Chargement de la page {pathname} en cours...</p>
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

  // Si l'utilisateur n'a pas accès, on ne montre rien (sera redirigé par l'effet)
  if (!hasAccess) {
    return null;
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
                  <img src="/crslogo.svg" alt="Logo CRS" className="h-10 w-auto" />
                </a>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Tableau de bord - Statistiques
                </h1>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <span className="text-gray-300 text-sm">
                  Connecté en tant que: <span className="text-blue-400 font-medium">{displayName}</span>
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <main className="container mx-auto px-6 py-8">
          {/* Cartes de synthèse */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <InfoCard 
              title="Effectif total" 
              icon={<UserGroupIcon className="h-6 w-6 text-blue-400" />}
            >
              <div className="text-4xl font-bold text-white mb-2">{totalEffectifs}</div>
              <p className="text-sm text-gray-400">Personnes enregistrées</p>
            </InfoCard>

            <InfoCard 
              title="Effectif actif" 
              icon={<UserGroupIcon className="h-6 w-6 text-green-400" />}
            >
              <div className="text-4xl font-bold text-white mb-2">{effectifsActifs}</div>
              <p className="text-sm text-gray-400">Membres actifs</p>
            </InfoCard>

            <InfoCard 
              title="Taux d'activité" 
              icon={<ChartBarIcon className="h-6 w-6 text-yellow-400" />}
            >
              <div className="text-4xl font-bold text-white mb-2">
                {totalEffectifs > 0 ? Math.round((effectifsActifs / totalEffectifs) * 100) : 0}%
              </div>
              <p className="text-sm text-gray-400">de l'effectif est actif</p>
              <div className="mt-2">
                <ProgressBar 
                  value={effectifsActifs} 
                  max={Math.max(totalEffectifs, 1)} 
                  color="bg-yellow-500" 
                />
              </div>
            </InfoCard>

            <InfoCard 
              title="Formations" 
              icon={<AcademicCapIcon className="h-6 w-6 text-purple-400" />}
            >
              <div className="text-4xl font-bold text-white mb-2">
                {Object.keys(formationsStats).length}
              </div>
              <p className="text-sm text-gray-400">types de formations</p>
            </InfoCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Graphique des formations */}
            <InfoCard 
              title="Répartition par formation" 
              icon={<AcademicCapIcon className="h-6 w-6 text-purple-400" />}
              className="h-full"
            >
              <div className="space-y-4 mt-4">
                {formationsTriees.map((formation) => (
                  <div key={formation.nom} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-200">{formation.nom}</span>
                      <span className="text-gray-400">{formation.count} ({formation.percentage}%)</span>
                    </div>
                    <ProgressBar 
                      value={formation.count} 
                      max={totalEffectifs || 1} 
                      color="bg-purple-500"
                    />
                  </div>
                ))}
                {formationsTriees.length === 0 && (
                  <p className="text-gray-400 text-center py-4">Aucune donnée de formation disponible</p>
                )}
              </div>
            </InfoCard>

            {/* Graphique des postes */}
            <InfoCard 
              title="Répartition par poste" 
              icon={<BriefcaseIcon className="h-6 w-6 text-blue-400" />}
              className="h-full"
            >
              <div className="space-y-4 mt-4">
                {postesTries.map((poste) => (
                  <div key={poste.nom} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-200">{poste.nom || 'Non spécifié'}</span>
                      <span className="text-gray-400">{poste.count} ({poste.percentage}%)</span>
                    </div>
                    <ProgressBar 
                      value={poste.count} 
                      max={totalEffectifs || 1} 
                      color="bg-blue-500"
                    />
                  </div>
                ))}
                {postesTries.length === 0 && (
                  <p className="text-gray-400 text-center py-4">Aucune donnée de poste disponible</p>
                )}
              </div>
            </InfoCard>
          </div>

          {/* Section d'évolution */}
          {/* <div className="mt-8">
            <InfoCard 
              title="Évolution des effectifs" 
              icon={<ChartBarIcon className="h-6 w-6 text-green-400" />}
            >
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-400">Graphique d'évolution à venir (intégration avec une librairie de graphiques)</p>
              </div>
            </InfoCard>
          </div> */}
        </main>
      </div>
    </div>
  );
}

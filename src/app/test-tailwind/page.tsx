// Page statistiques - Tableau de bord des statistiques
'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Sidebar from '@/components/ui/sidebar';

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

// Function to copy text to clipboard
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    alert('Copié dans le presse-papier !');
  } catch (err) {
    console.error('Erreur lors de la copie :', err);
    alert('Erreur lors de la copie dans le presse-papier');
  }
};

export default function StatistiquesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
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
                  Test Tailwind
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
          <div className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Test des classes Tailwind
      </h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-red-100 text-red-800 rounded-lg">
          Ceci est une alerte bleue avec des classes Tailwind.
        </div>
        
        <button onClick={() => {copyToClipboard('test')}} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
          Bouton vert
        </button>
        
        <div className="mt-6 p-4 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Carte de test</h2>
          <p className="text-gray-300">
            Cette carte utilise des classes Tailwind pour le style.
          </p>
        </div>
      </div>

    </div>
    </main>
    </div>
    </div>
  );
}

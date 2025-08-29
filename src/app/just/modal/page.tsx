// Page statistiques - Tableau de bord des statistiques
'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Sidebar from '../../../components/sidebar/sidebar';

type Statut = 'Actif' | 'Non actif';
interface Effectif {
  id: number;
  prenom: string;
  nom: string;
  grade?: string | null;
  poste: string;
  statut: Statut;
  telephone?: string | null;
  formations: string[];
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

export default function TestTailwindPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [effectifs, setEffectifs] = useState<Effectif[]>([]);

  // Gestion sécurisée de la session utilisateur
  const user = session?.user as User | undefined;
  const displayName = user?.guildNickname || user?.name || 'Utilisateur';
  
  // Mode développement
  const hasAccess = true;
  
  
  // Génération des initiales
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

      useEffect(() => {
        let active = true;
        (async () => {
          try {
            setLoading(true);
            const res = await fetch('/api/effectifs');
            if (!res.ok) throw new Error('Erreur lors du chargement des effectifs');
            const data: Effectif[] = await res.json();
            if (active) setEffectifs(data);
          } catch (e: any) {
            if (active) setError(e?.message || 'Erreur inconnue');
          } finally {
            if (active) setLoading(false);
          }
        })();
        return () => {
          active = false;
        };
      }, []);
    

  // Vérification de l'authentification et des autorisations
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
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
    <FullscreenModal>
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <EffectifsSelection title="Sélectionner un effectif" effectifs={effectifs} />
      )}
    </FullscreenModal>
  );
}

// Simple full-screen modal container with backdrop and ESC/backdrop to close.
function FullscreenModal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.back();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [router]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={() => router.back()}
      aria-modal="true"
      role="dialog"
    >
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="w-full max-w-md rounded-2xl bg-white/95 shadow-2xl ring-1 ring-black/5 dark:bg-neutral-900/95"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </div>
  );
}

function EffectifsSelection({
  title,
  effectifs,
}: {
  title?: string;
  effectifs: Effectif[];
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const router = useRouter();

  const labelOf = (e: Effectif) => `${e.prenom} ${e.nom}`.trim();
  const sublabelOf = (e: Effectif) => [e.poste, e.grade || undefined].filter(Boolean).join(' • ');

  const filtered = effectifs.filter((e) => {
    const q = query.toLowerCase();
    if (!q) return true;
    return (
      labelOf(e).toLowerCase().includes(q) ||
      (e.poste || '').toLowerCase().includes(q) ||
      (e.grade || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="px-4 pt-4 pb-3 border-b border-neutral-200/70 dark:border-neutral-800/70">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            {title || 'Sélectionner'}
          </h2>
          <button
            onClick={() => router.back()}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>
        <div className="mt-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un effectif..."
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-neutral-400 focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:placeholder:text-neutral-500 dark:focus:border-blue-400"
          />
          <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="px-3 py-6 text-sm text-neutral-500">Aucun effectif trouvé.</div>
      ) : (
        <ul className="max-h-[60vh] overflow-auto p-2">
          {filtered.map((e) => {
            const isActive = selectedId === e.id;
            return (
              <li key={e.id} className="p-1">
                <button
                  type="button"
                  onClick={() => setSelectedId(e.id)}
                  onDoubleClick={() => router.back()}
                  className={
                    "w-full rounded-xl border px-3 py-2.5 text-left transition shadow-sm " +
                    (isActive
                      ? "border-blue-500 bg-blue-50/60 text-blue-700 ring-2 ring-blue-200 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-200 dark:ring-0"
                      : "border-neutral-200 hover:bg-neutral-50/70 dark:border-neutral-700 dark:hover:bg-neutral-800")
                  }
                >
                  <div className="flex items-center gap-3">
                    <div
                      aria-hidden
                      className={
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold " +
                        (isActive ? "bg-blue-600 text-white" : "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-100")
                      }
                    >
                      {labelOf(e)
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">{labelOf(e)}</div>
                      <div className="truncate text-xs text-neutral-500 dark:text-neutral-400">{sublabelOf(e)}</div>
                    </div>
                    <div className="ml-auto pl-2 text-neutral-400">›</div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="p-4 space-y-2">
      <div className="h-4 w-40 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 w-full rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
      ))}
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="p-4 text-sm text-red-600 dark:text-red-400">
      {message}
    </div>
  );
}


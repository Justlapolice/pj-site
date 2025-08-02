'use client';

import { useEffect, useState } from 'react';
import { FaTools, FaSync } from 'react-icons/fa';

export default function MaintenanceBanner() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier l'état de maintenance
  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const response = await fetch('/api/maintenance');
        const data = await response.json();
        setIsMaintenance(data.isMaintenance);
      } catch (error) {
        console.error('Erreur lors de la vérification de la maintenance:', error);
        // En cas d'erreur, considérer le site est en maintenance
        setIsMaintenance(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkMaintenance();
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  if (isLoading) {
    return null; // Ou un loader si vous préférez
  }

  if (!isMaintenance) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-[1.02]">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-full animate-pulse">
            <FaTools className="text-5xl text-amber-500 dark:text-amber-400" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
          Maintenance en cours
        </h2>
        
        <p className="mb-8 text-gray-600 dark:text-gray-300 leading-relaxed">
          Notre site est actuellement en maintenance. 
          <span className="block mt-2 text-sm text-amber-600 dark:text-amber-400">
            Nous serons de retour très bientôt !
          </span>
        </p>
        
        <button
          onClick={handleRetry}
          className="group relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium py-3 px-8 rounded-lg inline-flex items-center transition-all duration-300 shadow-lg hover:shadow-amber-500/20"
        >
          <span className="relative z-10 flex items-center">
            <FaSync className="mr-3 group-hover:animate-spin" />
            <span>Réessayer</span>
          </span>
          <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </button>
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Dernière mise à jour : {new Date().toLocaleString('fr-FR')}
          </p>
        </div>
      </div>
    </div>
  );
}

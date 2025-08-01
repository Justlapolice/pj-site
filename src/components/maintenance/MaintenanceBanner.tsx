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
        // En cas d'erreur, considérer que le site est en maintenance
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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <FaTools className="text-4xl text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Maintenance en cours</h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Notre site est actuellement en maintenance. Veuillez réessayer dans quelques instants.
        </p>
        <button
          onClick={handleRetry}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md inline-flex items-center transition-colors"
        >
          <FaSync className="mr-2" />
          Réessayer
        </button>
      </div>
    </div>
  );
}

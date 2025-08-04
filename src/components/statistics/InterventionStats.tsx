import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

interface StatItem {
  name: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

interface User extends Record<string, any> {
  roles?: string[];
}

const InterventionStats = () => {
  const { data: session } = useSession();
  const user = session?.user as User | undefined;
  const isAdmin = user?.roles?.includes('1331527328219529216') || false;
  
  const [stats, setStats] = useState<StatItem[]>([
    { name: 'BMU', value: 70, color: 'bg-blue-500', icon: '🏍️' },
    { name: 'MO', value: 10, color: 'bg-green-500', icon: '🛡️' },
    { name: 'Maritime', value: 5, color: 'bg-yellow-500', icon: '⛵' },
    { name: 'ERI', value: 5, color: 'bg-red-500', icon: '🚨' },
    { name: 'CRS 08', value: 4, color: 'bg-purple-500', icon: '👮' },
    { name: 'Secours en Montagne', value: 1, color: 'bg-indigo-500', icon: '🏔️' },
  ]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editableStats, setEditableStats] = useState<StatItem[]>([]);
  
  useEffect(() => {
    setEditableStats([...stats]);
  }, [stats]);
  
  const handleValueChange = (index: number, newValue: number) => {
    if (newValue < 0) newValue = 0;
    if (newValue > 100) newValue = 100;
    
    const updatedStats = [...editableStats];
    updatedStats[index].value = newValue;
    
    // Ajuster les autres valeurs pour que la somme fasse 100%
    const total = updatedStats.reduce((sum, stat, i) => 
      i === index ? sum + newValue : sum + stat.value, 0);
    
    if (total !== 100) {
      const remaining = 100 - newValue;
      const otherStats = updatedStats.filter((_, i) => i !== index);
      const otherTotal = otherStats.reduce((sum, stat) => sum + stat.value, 0);
      
      if (otherTotal > 0) {
        otherStats.forEach((stat, i) => {
          const originalIndex = updatedStats.findIndex(s => s.name === stat.name);
          updatedStats[originalIndex].value = Math.round((stat.value / otherTotal) * remaining);
        });
      }
    }
    
    setEditableStats(updatedStats);
  };
  
  const saveChanges = () => {
    // Ici, vous pourriez ajouter une requête API pour sauvegarder les changements
    setStats([...editableStats]);
    setIsEditing(false);
    
    // Afficher une notification de succès
    alert('Les modifications ont été enregistrées avec succès !');
  };
  
  const cancelEditing = () => {
    setEditableStats([...stats]);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Répartition des Interventions</h2>
        {isAdmin && !isEditing && (
          <button
          style={{ borderRadius: '10px' }}
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Modifier les pourcentages
          </button>
        )}
        {isAdmin && isEditing && (
          <div className="space-x-2">
            <button
            style={{ borderRadius: '10px' }}
              onClick={saveChanges}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Enregistrer
            </button>
            <button
            style={{ borderRadius: '10px' }}
              onClick={cancelEditing}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Annuler
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(isEditing ? editableStats : stats).map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{stat.icon}</div>
                <h3 className="text-lg font-semibold text-gray-100">{stat.name}</h3>
              </div>
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={stat.value}
                    onChange={(e) => handleValueChange(index, parseInt(e.target.value) || 0)}
                    className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-right"
                  />
                  <span className="text-2xl font-bold text-white">%</span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-white">{stat.value}%</span>
              )}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className={`${stat.color} h-2.5 rounded-full transition-all duration-300`}
                style={{ width: `${stat.value}%` }}
              ></div>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              {stat.value}% des interventions totales
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InterventionStats;

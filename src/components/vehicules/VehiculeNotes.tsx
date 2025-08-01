export const VehiculeNotes = () => {
  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 mb-8">
      <h3 className="text-xl font-semibold text-white mb-4">⚠️ Notes importantes ⚠️</h3>
      <ul className="space-y-2 text-gray-300">
        <li className="flex items-start">
          <span className="text-blue-400 mr-2">•</span>
          <span>Les véhicules doivent être utilisés conformément au règlement intérieur</span>
        </li>
        <li className="flex items-start">
          <span className="text-blue-400 mr-2">•</span>
          <span>En cas de doute, se référer à son supérieur hiérarchique</span>
        </li>
      </ul>
    </div>
  );
};

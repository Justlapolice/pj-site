export default function TestTailwindPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Test des classes Tailwind
        </h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-red-100 text-red-800 rounded-lg">
            Ceci est une alerte bleue avec des classes Tailwind.
          </div>
          
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
            Bouton vert
          </button>
          
          <div className="mt-6 p-4 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Carte de test</h2>
            <p className="text-gray-700">
              Cette carte utilise des classes Tailwind pour le style.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

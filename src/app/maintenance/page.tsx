export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🚧 Maintenance en cours
        </h1>
        <p className="text-gray-600 mb-6">
          Notre site est actuellement en cours de maintenance. De retour très
          bientôt !
        </p>
        <p className="text-sm text-gray-500">Merci de votre compréhension.</p>
      </div>
    </div>
  );
}

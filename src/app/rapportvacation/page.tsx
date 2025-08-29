"use client";

export default function RapportVacation() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#0f0f1a]">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Page non disponible en cours de développement
        </h1>
        <p className="mb-6 text-red-500 font-extrabold">
          Cette page est actuellement en cours de développement. Nous serons de
          retour très bientôt !
        </p>
        <p className="text-sm text-gray-500 font-bold">
          Cordialement, le meilleur 👀 (justforever974)
        </p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4"
          onClick={() => (window.location.href = "/accueil")}
        >
          Retour à l&apos;accueil
        </button>
      </div>
    </div>
  );
}

// Page authentification

"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import Image from "next/image"
import { SiDiscord } from "react-icons/si"
import { useRouter } from "next/navigation"

export default function Home() {
  const { data: session } = useSession()
  const displayName = session?.user?.name || "Utilisateur"
  const router = useRouter()

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url('/background.jpg')` }}
    >
      {/* Voile plus léger et flou réduit */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] z-0" />

      {/* Contenu principal */}
      <div className="relative z-10 flex flex-col md:flex-row w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl">
        {/* Partie gauche */}
       <div className="md:w-1/2 bg-gradient-to-br from-blue-950 via-indigo-800 to-purple-900 text-white p-10 flex flex-col justify-center items-center text-center">

          <Image src="/crslogo.svg" alt="CRS Logo" width={80} height={80} className="mb-6" />
          <h1 className="text-3xl font-bold mb-2 uppercase">INTRANET CRS</h1>
          <p className="text-sm text-gray-200">
            Portail sécurisé réservé aux membres de la Compagnie Républicaine de Sécurité.
          </p>
        </div>

        {/* Partie droite */}
        <div className="md:w-1/2 bg-blue/90 backdrop-blur-sm p-10 text-red-800 flex flex-col justify-center">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold">Connexion</h2>
            <p className="text-sm text-gray-600">Authentification sécurisée via Discord</p>
          </div>

          {!session ? (
            <button
              onClick={() => signIn("discord", { callbackUrl: "/accueil" })}
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-all rounded-xl"
            >
              <SiDiscord className="w-5 h-5" />
              Se connecter avec Discord
            </button>
          ) : (
            <>
              <p className="text-center text-gray-700 mb-4">
                Bienvenue <span className="font-semibold">{displayName}</span>
              </p>
              <button
                onClick={() => signOut()}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-all rounded-xl mb-4"
              >
                Se déconnecter
              </button>
              <button
                onClick={() => router.push("/accueil")}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-all rounded-xl"
              >
                Accéder à la page d'accueil
              </button>
            </>
          )}

          {/* Footer */}
          <div className="mt-8 text-xs text-center text-gray-500 space-y-1">
            <div className="flex items-center justify-center gap-2">
              <Image src="/crslogo.svg" alt="CRS" width={20} height={20} />
              <span>Direction Centrale des Compagnies Républicaines de Sécurité.</span>
            </div>
            <p>INTRANET CRS FRRP – par <a href="https://github.com/justforever974" 
            style={{ color: 'red', textDecoration: 'none' }}>@justforever974</a>.</p>

            <p className="text-[10px]">
              Ce site ne représente aucun cas la CRS.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

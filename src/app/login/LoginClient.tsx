// Page authentification

"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import Image from "next/image"
import { SiDiscord } from "react-icons/si"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FaShieldAlt, FaLock, FaUserShield, FaExclamationTriangle } from 'react-icons/fa'

export default function Home() {
  const { data: session } = useSession()
  const displayName = session?.user?.name || "Utilisateur"
  const router = useRouter()

  return (
    
    <div 
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{ backgroundImage: `url('/background.jpg')` }}
    >
      {/* Voile avec dégradé */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/100 via-white to-red-900/80 z-0" />

      {/* Contenu principal avec animation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col md:flex-row w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm bg-white/5 border border-white/10"
      >
        {/* Partie gauche */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white p-10 flex flex-col justify-center items-center text-center relative overflow-hidden">
          {/* Effet de particules subtil */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: Math.random() * 6 + 2 + 'px',
                  height: Math.random() * 6 + 2 + 'px',
                  top: Math.random() * 100 + '%',
                  left: Math.random() * 100 + '%',
                  animation: `float ${Math.random() * 5 + 5}s linear infinite`,
                  animationDelay: Math.random() * 5 + 's'
                }}
              />
            ))}
          </div>
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative z-10"
          >
            <div className="mb-6 transform hover:scale-105 transition-transform duration-300">
              <Image 
                src="/crslogo.svg" 
                alt="CRS Logo" 
                width={100} 
                height={100} 
                className="mx-auto"
                priority
              />
            </div>
            <h1 className="text-4xl font-extrabold mb-3 uppercase tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white">
              INTRANET CRS
            </h1>
            <p className="text-gray-300 mb-6 max-w-md mx-auto leading-relaxed">
              Portail sécurisé réservé aux membres de la Compagnie Républicaine de Sécurité.
            </p>
            
            <div className="mt-8 space-y-4 text-left max-w-xs mx-auto">
              <div className="flex items-center space-x-3">
                <FaShieldAlt className="text-blue-300 text-xl" />
                <span className="text-sm text-gray-200">Accès sécurisé et chiffré</span>
              </div>
              {/* <div className="flex items-center space-x-3">
                <FaLock className="text-blue-300 text-xl" />
                <span className="text-sm text-gray-200">Authentification à deux facteurs</span>
              </div> */}
              <div className="flex items-center space-x-3">
                <FaUserShield className="text-blue-300 text-xl" />
                <span className="text-sm text-gray-200">Réservé au personnel CRS</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Partie droite */}
        <div className="md:w-1/2 bg-blue p-10 flex flex-col justify-center relative overflow-hidden">
          {/* Effet de fond subtil */}
          {/* <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-90" /> */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          
          <div className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
                <FaLock className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Connexion</h2>
              <p className="text-gray-500">
                Accès au portail{' '}
                <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  CRS
                </span>
              </p>
            </motion.div>

            <div className="space-y-6">
              {!session ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <button
                    onClick={() => signIn("discord", { callbackUrl: "/accueil?justLoggedIn=1" })}
                    className="group w-full bg-[#5865F2] hover:bg-[#4752C4] text-white py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <SiDiscord className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Se connecter avec Discord</span>
                  </button>
                  
                  {/* <div className="relative flex items-center my-6">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-sm">OU EN DEVELOPPEMENT</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div> */}
                  
                  {/* <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Adresse email @interieur.gouv-just.fr 
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="votre@interieur.gouv-just.fr"
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Mot de passe
                      </label>
                      <input
                        type="password"
                        id="password"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                    <button
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                    >
                      Se connecter
                    </button>
                  </div> */}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="space-y-4"
                >
                  <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-gray-700">
                      Connecté en tant que <span className="font-semibold text-blue-700">{displayName}</span>
                    </p>
                  </div>
                  
                  <button
                    onClick={() => router.push("/accueil")}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>Accéder au tableau de bord</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => signOut()}
                    className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-xl font-medium transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Se déconnecter</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-12 pt-6 border-t border-gray-200/50"
          >
            <div className="flex flex-col items-center text-center text-xs text-gray-500 space-y-4">
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-blue-700 font-medium">Connexion sécurisée</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Image src="/crslogo.svg" alt="CRS" width={16} height={16} className="opacity-70" />
                <span className="text-sm text-blue-600">Direction Centrale des Compagnies Républicaines de Sécurité</span>
              </div>
              <p className="text-sm text-gray-500">
                INTRANET CRS FRRP – par{' '}
                <a 
                  href="https://github.com/justforever974" 
                  className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @justforever974
                </a>
              </p>
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <FaExclamationTriangle className="text-lg" />
                <span>
                  Ce site n’est en aucun cas affilié, associé ou approuvé par la Compagnie Républicaine de Sécurité et par le Ministère de l'Intérieur.
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

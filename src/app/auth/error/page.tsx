'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const router = useRouter()
  const [displayedText, setDisplayedText] = useState('')

  let message = 'Vous n\'êtes pas connecté via Discord. Accès au site refusé.'

  if (error === 'NOT_IN_GUILD') {
    message = 'Vous devez faire partie du serveur France RP et appartenir à la Police Nationale pour vous connecter.'
  } else if (error === 'MISSING_ROLE') {
    message = 'Vous n\'avez pas le rôle requis sur le serveur Discord.'
  } else if (error === 'OAuthCallback') {
    message = 'Erreur d\'authentification avec Discord. Veuillez réessayer.'
  }

  // Redirection automatique
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.push('/')
    }, 10000) // Augmenté à 10 secondes pour permettre la lecture
    return () => clearTimeout(timeoutId)
  }, [router])

  // Effet d'écriture
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i <= message.length) {
        setDisplayedText(message.slice(0, i))
        i++
      } else {
        clearInterval(interval)
      }
    }, 20) // Vitesse d'écriture légèrement plus rapide
    return () => clearInterval(interval)
  }, [message])

  return (
    <div className="relative h-screen w-full flex justify-center items-center bg-black overflow-hidden">
      {/* Fond animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black animate-gradient opacity-60"></div>
      
      {/* Particules flottantes */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto p-8">
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-700 p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-4 border-2 border-red-500/30">
              <svg 
                className="w-12 h-12 text-red-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Erreur d'authentification
            </h1>
            <p className="text-gray-300 text-sm">
              Impossible de poursuivre la connexion
            </p>
          </div>

          {/* Message d'erreur */}
          <div className="mb-8 p-4 bg-red-900/40 border border-red-800/50 rounded-lg text-left">
            <div className="flex items-start">
              <svg 
                className="flex-shrink-0 w-5 h-5 text-red-400 mt-0.5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <p className="text-red-100 text-sm leading-relaxed">
                {displayedText}
                <span className="inline-block w-1 h-4 bg-red-400 ml-1 animate-pulse"></span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <a
              href="/"
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Retour à l'accueil
            </a>
            <a
              href="/auth/signin"
              className="block w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 text-sm"
            >
              Réessayer la connexion
            </a>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-400">
              Redirection automatique dans quelques secondes...
            </p>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 300% 300%;
          animation: gradient 12s ease infinite;
        }
      `}</style>
    </div>
  )
}

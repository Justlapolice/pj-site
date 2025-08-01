'use client'

import { signIn, getProviders } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SignIn() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [providers, setProviders] = useState<any>(null)

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    fetchProviders()
  }, [])

  let errorMessage = ''
  if (error === 'Signin') {
    errorMessage = '❌ Erreur lors de la connexion. Veuillez réessayer.'
  } else if (error === 'OAuthSignin') {
    errorMessage = '❌ Erreur lors de la connexion Discord.'
  } else if (error === 'OAuthCallback') {
    errorMessage = '❌ Vous n\'êtes pas autorisé à accéder à ce site. Vérifiez que vous êtes membre du serveur Discord et que vous avez le bon rôle.'
  } else if (error === 'OAuthCreateAccount') {
    errorMessage = '❌ Impossible de créer votre compte.'
  } else if (error === 'EmailCreateAccount') {
    errorMessage = '❌ Impossible de créer votre compte avec cet email.'
  } else if (error === 'Callback') {
    errorMessage = '❌ Erreur d\'authentification. Vous devez être membre du serveur Discord avec le bon rôle.'
  } else if (error === 'OAuthAccountNotLinked') {
    errorMessage = '❌ Ce compte Discord n\'est pas autorisé.'
  } else if (error === 'EmailSignin') {
    errorMessage = '❌ Impossible d\'envoyer l\'email de connexion.'
  } else if (error === 'CredentialsSignin') {
    errorMessage = '❌ Identifiants incorrects.'
  } else if (error === 'SessionRequired') {
    errorMessage = '❌ Vous devez être connecté pour accéder à cette page.'
  }

  return (
    <div className="relative h-screen w-full flex justify-center items-center bg-black overflow-hidden">
      {/* Fond animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black animate-gradient opacity-60"></div>
      
      {/* Particules flottantes */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
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
          <h1 className="text-3xl font-bold text-white mb-6">
            🚔 Connexion CRS
          </h1>
          
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
              <p className="text-red-300 text-sm">{errorMessage}</p>
            </div>
          )}
          
          <p className="text-gray-300 mb-8 text-sm">
            Connectez-vous avec votre compte Discord pour accéder à l'intranet CRS de France RP.
            Vous devez être membre du serveur Discord avec le rôle approprié.
          </p>

          {providers && (
            <div className="space-y-4">
              {Object.values(providers).map((provider: any) => (
                <div key={provider.name}>
                  <button
                    onClick={() => signIn(provider.id, { callbackUrl: '/accueil' })}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                    Se connecter avec {provider.name}
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-400">
              En vous connectant, vous acceptez d'être membre du serveur Discord de la Police Nationale du serveur France RP.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

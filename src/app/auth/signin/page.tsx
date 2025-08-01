import { Suspense } from 'react'
import SignInClient from './SignInClient'

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-10">Chargement de la connexion...</div>}>
      <SignInClient />
    </Suspense>
  )
}

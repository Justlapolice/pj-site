// app/auth/error/page.tsx
import { Suspense } from 'react'
import AuthErrorClient from './AuthErrorClient'

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Chargement de l’erreur...</div>}>
      <AuthErrorClient />
    </Suspense>
  )
}

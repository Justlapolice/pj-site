import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/accueil", "/infocrs", "/organigramme", "/tenues", "/vehicules", "/documents", "/statistiques"];
const publicRoutes = ["/", "/auth/signin", "/auth/error"];
const maintenanceBypassRoutes = ["/maintenance"]; // Ajout de la route de maintenance

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Vérifier si le mode maintenance est activé
  if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true') {
    // Autoriser l'accès à la page de maintenance et aux routes publiques
    if (pathname === '/maintenance' || publicRoutes.some(route => pathname === route)) {
      return NextResponse.next();
    }
    // Rediriger vers la page de maintenance pour toutes les autres requêtes
    return NextResponse.rewrite(new URL('/maintenance', req.url));
  }

  // Vérifier si la route est publique
  if (publicRoutes.some(route => pathname === route)) {
    return NextResponse.next();
  }

  // Récupérer le token de session
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production'
  });

  // Si la route est protégée et qu'il n'y a pas de token, rediriger vers la page de connexion
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtected) {
    if (!token) {
      const url = new URL('/auth/signin', req.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

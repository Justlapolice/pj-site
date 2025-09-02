// Liste des routes autorisées dans l'application
export const appRoutes = {
  public: [
    { path: "/", label: "Accueil" },
    { path: "/login", label: "Connexion" },
    { path: "/auth/error", label: "Erreur" },
    { path: "/public/enquetes", label: "Enquetes" },
  ],

  // Routes protégées (nécessitent une authentification)
  protected: [
    { path: "/accueil", label: "Accueil", icon: "FaHome" },
    { path: "/infopj", label: "Informations sur la PJ", icon: "FaAddressBook" },
    { path: "/organigramme", label: "Organigramme", icon: "FaUserAlt" },
    { path: "/tenues", label: "Tenues", icon: "FaTshirt" },
    { path: "/vehicules", label: "Véhicules", icon: "FaCar" },
  ],
};

// Liste plate de toutes les routes protégées pour la vérification dans le middleware
export const protectedRoutes = appRoutes.protected.map((route) => route.path);

// Liste plate de toutes les routes publiques pour la vérification dans le middleware
export const publicRoutes = appRoutes.public.map((route) => route.path);

// Vérifie si une route est une route protégée
export const isProtectedRoute = (path: string) => {
  return protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
};

// Vérifie si une route est une route publique
export const isPublicRoute = (path: string) => {
  return publicRoutes.includes(path);
};

// Vérifie si une route est valide (publique ou protégée)
export const isValidRoute = (path: string) => {
  return (
    isPublicRoute(path) ||
    protectedRoutes.some(
      (route) => path === route || path.startsWith(`${route}/`)
    )
  );
};

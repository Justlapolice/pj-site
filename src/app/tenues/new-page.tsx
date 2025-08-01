'use client';
import React, { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/ui/sidebar';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Composant de tenue réutilisable
const OutfitCard = ({ 
  title, 
  items, 
  imageSrc,
  imageAlt 
}: { 
  title: string;
  items: { label: string; value: string }[];
  imageSrc: string;
  imageAlt: string;
}) => (
  <motion.div 
    className="bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <div className="relative h-48 w-full bg-gray-900">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover object-top"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">{title}</h3>
    </div>
    
    <div className="p-6">
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center border-b border-gray-700/50 pb-2">
            <span className="text-gray-400 text-sm">{item.label}</span>
            <span className="font-medium text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

// Données des tenues
const outfits = [
  {
    title: "Tenue Dispatch",
    image: "/outfits/dispatch.jpg",
    items: [
      { label: "Hauts & Vestes", value: "777" },
      { label: "Hauts & Vestes 2", value: "Vôtre Grade" },
      { label: "Sous-Vêtement", value: "259" },
      { label: "Gilet pare-balles 1", value: "173" },
      { label: "Gilet pare-balles 2", value: "Vôtre Grade" },
      { label: "Sacs & Parachutes", value: "137" },
      { label: "Mains & Bras", value: "30" },
      { label: "Jambes", value: "270" },
      { label: "Chaussures", value: "25" },
      { label: "Masques", value: "//" },
      { label: "Écharpes & Chaînes", value: "231" },
      { label: "Autocollants", value: "266" },
      { label: "Chapeaux & Casque", value: "117 / //" }
    ]
  },
  {
    title: "Tenue CRS Autoroutière",
    image: "/outfits/autoroutiere.jpg",
    items: [
      { label: "Hauts & Vestes", value: "760" },
      { label: "Hauts & Vestes 2", value: "Vôtre Grade" },
      { label: "Sous-Vêtement", value: "259" },
      { label: "Gilet pare-balles 1", value: "169" },
      { label: "Gilet pare-balles 2", value: "Variation 04+" },
      { label: "Sacs & Parachutes", value: "137" },
      { label: "Mains & Bras", value: "33" },
      { label: "Jambes", value: "271" },
      { label: "Chaussures", value: "25" },
      { label: "Masques", value: "101" },
      { label: "Écharpes & Chaînes", value: "251" },
      { label: "Autocollants", value: "264 / 52" },
      { label: "Chapeaux & Casque", value: "117 / 0" }
    ]
  },
  {
    title: "Tenue BMU Stagiaire",
    image: "/outfits/bmu-stagiaire.jpg",
    items: [
      { label: "Hauts & Vestes", value: "119 / 0" },
      { label: "Sous-Vêtement", value: "241" },
      { label: "Gilet pare-balles", value: "81" },
      { label: "Gilet grade", value: "Vôtre Grade" },
      { label: "Sacs & Parachutes", value: "133" },
      { label: "Mains & Bras", value: "96" },
      { label: "Jambes", value: "101" },
      { label: "Chaussures", value: "25" },
      { label: "Masques", value: "101" },
      { label: "Écharpes & Chaînes", value: "259" },
      { label: "Chapeaux & Casque", value: "245 / 02" }
    ]
  },
  {
    title: "Tenue BMU Titulaire",
    image: "/outfits/bmu-titulaire.jpg",
    items: [
      { label: "Hauts & Vestes", value: "674" },
      { label: "Grade", value: "Vôtre Grade" },
      { label: "Sous-Vêtement", value: "241" },
      { label: "Sacs & Parachutes", value: "133" },
      { label: "Mains & Bras", value: "96" },
      { label: "Jambes", value: "101" },
      { label: "Chaussures", value: "25" },
      { label: "Masques", value: "101" },
      { label: "Écharpes & Chaînes", value: "259" },
      { label: "Chapeaux & Casque", value: "245 / 02" }
    ]
  }
];

const additionalOutfits = [
  {
    title: "Tenue BMU Tout-Terrain",
    items: [
      { label: "Hauts & Vestes", value: "761 / Vôtre Grade" },
      { label: "Sous-Vêtement", value: "259" },
      { label: "Gilet pare-balles", value: "173 / Vôtre Grade" },
      { label: "Sacs & Parachutes", value: "137" },
      { label: "Mains & Bras", value: "30" },
      { label: "Jambes", value: "271" },
      { label: "Chaussures", value: "25" },
      { label: "Chapeaux & Casque", value: "245 / 02" }
    ],
    image: "/outfits/bmu-tout-terrain.jpg"
  },
  {
    title: "Tenue BMU Banalisé",
    items: [
      { label: "Hauts & Vestes", value: "379 / Vôtre Grade" },
      { label: "Sous-Vêtement", value: "156" },
      { label: "Gilet pare-balles", value: "173 / Vôtre Grade" },
      { label: "Sacs & Parachutes", value: "141" },
      { label: "Mains & Bras", value: "96" },
      { label: "Jambes", value: "280" },
      { label: "Chaussures", value: "25" },
      { label: "Chapeaux & Casque", value: "245 / 05" }
    ],
    image: "/outfits/bmu-ban.jpg"
  },
  {
    title: "Tenue MO",
    items: [
      { label: "Hauts & Vestes", value: "760 / Vôtre Grade" },
      { label: "Sous-Vêtement", value: "259" },
      { label: "Gilet pare-balles", value: "07 / //" },
      { label: "Sacs & Parachutes", value: "134" },
      { label: "Mains & Bras", value: "33" },
      { label: "Jambes", value: "130" },
      { label: "Chaussures", value: "25" },
      { label: "Chapeaux & Casque", value: "126 / 0" }
    ],
    image: "/outfits/mo.jpg"
  },
  {
    title: "Tenue Maritime",
    items: [
      { label: "Hauts & Vestes", value: "243 / 24" },
      { label: "Sous-Vêtement", value: "15" },
      { label: "Gilet pare-balles", value: "81 / Vôtre Grade" },
      { label: "Sacs & Parachutes", value: "137" },
      { label: "Mains & Bras", value: "33" },
      { label: "Jambes", value: "94 / 24" },
      { label: "Chaussures", value: "25" },
      { label: "Chapeaux & Casque", value: "150 / 0" }
    ],
    image: "/outfits/maritime.jpg"
  },
  {
    title: "Tenue ERI Banalisé",
    items: [
      { label: "Libre d'accès", value: "Sous conditions" },
      { label: "Équipement Obligatoire", value: "Gilet pare-balles 173" },
      { label: "Variation", value: "À partir de 14" },
      { label: "Accessoires", value: "PI, Brassard Police" },
      { label: "⚠️ Attention", value: "Sweat à capuche interdit" }
    ],
    image: "/outfits/eri.jpg"
  },
  {
    title: "Tenue CRS 8",
    items: [
      { label: "Hauts & Vestes", value: "779 / Variation 0" },
      { label: "Sous-Vêtement", value: "Ceinturons au choix" },
      { label: "Gilet pare-balles", value: "173 / Vôtre Grade" },
      { label: "Sacs & Parachutes", value: "137" },
      { label: "Mains & Bras", value: "33" },
      { label: "Jambes", value: "292" },
      { label: "Chaussures", value: "25" },
      { label: "Chapeaux & Casque", value: "89 / 0" }
    ],
    image: "/outfits/crs8.jpg"
  }
];

export default function TenuesCRS() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const displayName = session?.user?.guildNickname || session?.user?.name || 'Utilisateur';
  const pathname = usePathname();

  // Vérification de l'authentification
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Déconnexion automatique toutes les heures
  useEffect(() => {
    const timer = setInterval(() => {
      signOut({
        callbackUrl: '/',
      });
    }, 60 * 60 * 1000);

    return () => clearInterval(timer);
  }, []);

  // Génération des initiales
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (status === 'loading') {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-300">Chargement de la page {pathname} en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex bg-gray-900">
      <Sidebar displayName={displayName} initials={initials} />
      
      <div className="flex-1 relative z-10">
        {/* En-tête */}
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <a href="/accueil">
                  <img src="/crslogo.svg" alt="Logo CRS" className="h-10 w-auto" />
                </a>
                <a href="/accueil" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Intranet CRS
                </a>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <span className="text-gray-300 text-sm">
                  Connecté en tant que: <span className="text-blue-400 font-medium">{displayName}</span>
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <main className="p-6 lg:p-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Tenues Officielles CRS
              </h2>
              <div className="flex items-center space-x-2 bg-gray-800/50 px-4 py-2 rounded-lg">
                <span className="text-gray-300 text-sm">Connecté en tant que :</span>
                <span className="text-blue-400 font-medium">{displayName}</span>
              </div>
            </div>
            <p className="text-gray-400 mt-2">Consultez les tenues officielles et leurs configurations</p>
          </motion.div>

          {/* Grille de tenues principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
            {outfits.map((outfit, index) => (
              <OutfitCard
                key={index}
                title={outfit.title}
                items={outfit.items}
                imageSrc={outfit.image}
                imageAlt={`Tenue ${outfit.title}`}
              />
            ))}
          </div>

          {/* Section d'information */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Notes importantes</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>Les tenues doivent être portées conformément au règlement intérieur</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>Les grades doivent être correctement positionnés selon la tenue</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>En cas de doute, se référer à son supérieur hiérarchique</span>
              </li>
            </ul>
          </div>
          
          {/* Section des tenues supplémentaires */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-white mb-6">Autres tenues disponibles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {additionalOutfits.map((outfit, index) => (
                <OutfitCard
                  key={index}
                  title={outfit.title}
                  items={outfit.items}
                  imageSrc={outfit.image}
                  imageAlt={`Tenue ${outfit.title}`}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

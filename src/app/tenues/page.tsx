// Page tenues

'use client';
import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/ui/sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Composant Modal pour l'affichage des images en plein écran
const ImageModal = ({ isOpen, onClose, src, alt }: { isOpen: boolean; onClose: () => void; src: string; alt: string }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="relative w-full max-w-4xl max-h-[90vh]"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            aria-label="Fermer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative w-full h-full">
            <Image
              src={src}
              alt={alt}
              width={1200}
              height={800}
              className="w-full h-auto max-h-[80vh] object-contain"
              priority
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Composant de tenue réutilisable
// Types pour les tenues
type OutfitItem = {
  label: string;
  value: string;
};

type Outfit = {
  title: string;
  items: OutfitItem[];
  image: string;
  imageAlt?: string;
  secondImage?: string;
  secondImageAlt?: string;
};

// Type pour les props du composant OutfitCard
type OutfitCardProps = {
  title: string;
  items: OutfitItem[];
  imageSrc: string;
  imageAlt: string;
  secondImageSrc?: string;
  secondImageAlt?: string;
};

function OutfitCard({ 
  title, 
  items,
  imageSrc,
  imageAlt,
  secondImageSrc,
  secondImageAlt
}: OutfitCardProps) {
    
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState({ src: imageSrc, alt: imageAlt });
  
  const openModal = (src: string, alt: string) => {
    setCurrentImage({ src, alt });
    setIsModalOpen(true);
  };

  return (
    <div>
      <motion.div 
        className="bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
      <div className="flex flex-col h-full">
        <div className="flex h-48 w-full">
          {/* Première image */}
          <div 
            className={`relative ${secondImageSrc ? 'w-1/2' : 'w-full'} h-full bg-gray-900 cursor-pointer group transition-all duration-300`}
            onClick={() => openModal(imageSrc, imageAlt)}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover object-top group-hover:opacity-80 transition-opacity duration-200"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="bg-black/50 text-white p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Deuxième image - affichée uniquement si elle existe */}
          {secondImageSrc && (
            <div 
              className="relative w-1/2 h-full bg-gray-900 cursor-pointer group border-l border-gray-700/50"
              onClick={() => openModal(secondImageSrc, secondImageAlt || '')}
            >
              <Image
                src={secondImageSrc}
                alt={secondImageAlt || ''}
                fill
                className="object-cover object-top group-hover:opacity-80 transition-opacity duration-200"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-black/50 text-white p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
        <h3 className="px-4 pt-3 pb-2 text-xl font-bold text-white">{title}</h3>
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
  
      <ImageModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        src={currentImage.src} 
        alt={currentImage.alt} 
      />
    </div>
  );
}

// Données des tenues
const outfits: Outfit[] = [
  {
    title: "Tenue Dispatch",
    image: "/tenues/dispatchcrs.png",
    secondImage: "/tenues/dispatchcrs2.png",
    imageAlt: "Tenue de service dispatch CRS",
    secondImageAlt: "Vue de dos de la tenue dispatch CRS",
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
      { label: "Autocollants 2", value: "0" },
      { label: "Chapeaux & Casque", value: "117 " },
      { label: "Chapeaux & Casque 2", value: "0" },
    ]
  },
  {
    title: "Tenue CRS Autoroutière",
    image: "/tenues/autoroutierecrs.png",
    imageAlt: "Tenue CRS Autoroutière CRS",
    items: [
      { label: "Hauts & Vestes", value: "760" },
      { label: "Hauts & Vestes 2", value: "Vôtre Grade" },
      { label: "Sous-Vêtement", value: "259" },
      { label: "Gilet pare-balles 1", value: "169" },
      { label: "Gilet pare-balles 2", value: "Variation à partir de 4" },
      { label: "Sacs & Parachutes", value: "137" },
      { label: "Mains & Bras", value: "33" },
      { label: "Jambes", value: "271" },
      { label: "Chaussures", value: "25" },
      { label: "Masques", value: "101" },
      { label: "Écharpes & Chaînes", value: "251" },
      { label: "Autocollants", value: "264 " },
      { label: "Autocollants 2", value: "5" },
      { label: "Chapeaux & Casque", value: "117" },
      { label: "Chapeaux & Casque 2", value: "0" },
    ]
  },
  {
    title: "Tenue BMU Stagiaire",
    image: "/tenues/bmu-stagiaire.png",
    imageAlt: "Tenue BMU Stagiaire CRS",
    secondImage: "/tenues/bmu-stagiaire2.png",
    secondImageAlt: "Vue de dos de la tenue BMU Stagiaire CRS",
    items: [
      { label: "Hauts & Vestes", value: "119" },
      { label: "Hauts & Vestes 2", value: "0" },
      { label: "Sous-Vêtement", value: "241" },
      { label: "Gilet pare-balles 1", value: "81" },
      { label: "Gilet pare-balles 2", value: "Vôtre Grade" },
      { label: "Sacs & Parachutes", value: "133" },
      { label: "Mains & Bras", value: "96" },
      { label: "Jambes", value: "101" },
      { label: "Chaussures", value: "25" },
      { label: "Masques", value: "101" },
      { label: "Écharpes & Chaînes", value: "259" },
      { label: "Autocollants", value: "0" },
      { label: "Autocollants 2", value: "0" },
      { label: "Chapeaux & Casque", value: "245" },
      { label: "Chapeaux & Casque 2", value: "02" },
    ]
  },
  {
    title: "Tenue BMU Titulaire",
    image: "/tenues/bmu-titulaire.png",
    items: [
      { label: "Hauts & Vestes", value: "674" },
      { label: "Grade", value: "Vôtre Grade" },
      { label: "Sous-Vêtement", value: "241" },
      { label: "Gilet pare-balles", value: "0" },
      { label: "Gilet pare-balles 2", value: "0" },
      { label: "Sacs & Parachutes", value: "133" },
      { label: "Mains & Bras", value: "96" },
      { label: "Jambes", value: "271" },
      { label: "Chaussures", value: "25" },
      { label: "Masques", value: "101" },
      { label: "Écharpes & Chaînes", value: "259" },
      { label: "Autocollants", value: "0" },
      { label: "Autocollants 2", value: "0" },
      { label: "Chapeaux & Casque", value: "245" },
      { label: "Chapeaux & Casque 2", value: "02" },
    ]
  }
];

const additionalOutfits: Outfit[] = [
  {
    title: "Tenue BMU Tout-Terrain",
    items: [
      { label: "Hauts & Vestes", value: "761" },
      { label: "Hauts & Vestes 2", value: "Vôtre Grade" },
      { label: "Sous-Vêtement", value: "259" },
      { label: "Gilet pare-balles", value: "173" },
      { label: "Gilet pare-balles 2", value: "Vôtre Grade" },
      { label: "Sacs & Parachutes", value: "137" },
      { label: "Mains & Bras", value: "96" },
      { label: "Jambes", value: "271" },
      { label: "Chaussures", value: "25" },
      { label: "Masques", value: "101" },
      { label: "Écharpes & Chaînes", value: "259" },
      { label: "Autocollants", value: "266" },
      { label: "Autocollants 2", value: "0" },
      { label: "Chapeaux & Casque", value: "245" },
      { label: "Chapeaux & Casque 2", value: "02" },
    ],
    image: "/tenues/bmu-tout-terrain.png",
    imageAlt: "Tenue BMU Banalisé CRS",
    secondImage: "/tenues/bmu-tout-terrain2.png",
    secondImageAlt: "Vue alternative de la tenue BMU Banalisé"
  },
  {
    title: "Tenue BMU Banalisé",
    items: [
      { label: "Hauts & Vestes", value: "379" },
      { label: "Hauts & Vestes 2", value: "Vôtre Grade" },
      { label: "Sous-Vêtement", value: "15" },
      { label: "Gilet pare-balles", value: "173" },
      { label: "Gilet pare-balles 2", value: "Vôtre Grade" },
      { label: "Sacs & Parachutes", value: "141" },
      { label: "Mains & Bras", value: "96" },
      { label: "Jambes", value: "280" },
      { label: "Chaussures", value: "25" },
      { label: "Masques", value: "101" },
      { label: "Écharpes & Chaînes", value: "259" },
      { label: "Autocollants", value: "0" },
      { label: "Autocollants 2", value: "0" },
      { label: "Chapeaux & Casque", value: "245" },
      { label: "Chapeaux & Casque 2", value: "05" }
    ],
    image: "/tenues/bmu-bana.png",
    imageAlt: "Tenue BMU Banalisé CRS",
    secondImage: "/tenues/bmu-bana2.png",
    secondImageAlt: "Vue alternative de la tenue BMU Banalisé"
  },
  {
    title: "Tenue MO",
    items: [
      { label: "Hauts & Vestes", value: "760" },
      { label: "Hauts & Vestes 2", value: "Vôtre Grade" },
      { label: "Sous-Vêtement", value: "259" },
      { label: "Gilet pare-balles", value: "07" },
      { label: "Gilet pare-balles 2", value: "01" },
      { label: "Sacs & Parachutes", value: "134" },
      { label: "Mains & Bras", value: "33" },
      { label: "Jambes", value: "130" },
      { label: "Jambes 2", value: "01" },
      { label: "Chaussures", value: "25" },
      { label: "Masques", value: "101" },
      { label: "Écharpes & Chaînes", value: "249" },
      { label: "Autocollants", value: "265" },
      { label: "Autocollants 2", value: "17" },
      { label: "Chapeaux & Casque", value: "126" },
      { label: "Chapeaux & Casque 2", value: "0" }
    ],
    image: "/tenues/mo.png",
    imageAlt: "Tenue MO CRS",
    secondImage: "/tenues/mo2.png",
    secondImageAlt: "Vue alternative de la tenue MO"
  },
  {
    title: "Tenue Maritime",
    items: [
      { label: "Hauts & Vestes", value: "243" },
      { label: "Hauts & Vestes 2", value: "24" },
      { label: "Sous-Vêtement", value: "15" },
      { label: "Gilet pare-balles", value: "81" },
      { label: "Gilet pare-balles 2", value: "01" },
      { label: "Sacs & Parachutes", value: "137" },
      { label: "Mains & Bras", value: "33" },
      { label: "Jambes", value: "94" },
      { label: "Jambes 2", value: "24" },
      { label: "Chaussures", value: "25" },
      { label: "Masques", value: "101" },
      { label: "Écharpes & Chaînes", value: "249" },
      { label: "Autocollants", value: "265" },
      { label: "Autocollants 2", value: "17" },
      { label: "Chapeaux & Casque", value: "150" },
      { label: "Chapeaux & Casque 2", value: "0" }
    ],
    image: "/tenues/maritime.png",
    imageAlt: "Tenue Maritime CRS",
    secondImage: "/tenues/maritime2.png",
    secondImageAlt: "Vue alternative de la tenue Maritime"
  },
  {
    title: "Tenue ERI Banalisé",
    items: [
      { label: "Libre d'accès", value: "Sous conditions" },
      { label: "Équipement Obligatoire", value: "Gilet pare-balles 173" },
      { label: "Variation", value: "À partir de 14" },
      { label: "Accessoires", value: "PIE, Brassard Police" },
      { label: "⚠️ Attention", value: "Sweat à capuche interdit" }
    ],
    image: "/tenues/eri.png"
  },
  {
    title: "Tenue CRS 8",
    items: [
      { label: "Hauts & Vestes", value: "779" },
      { label: "Hauts & Vestes 2", value: "Variation 0" },
      { label: "Sous-Vêtement", value: "Ceinturons au choix" },
      { label: "Gilet pare-balles", value: "173" },
      { label: "Gilet pare-balles 2", value: "Vôtre Grade" },
      { label: "Sacs & Parachutes", value: "137" },
      { label: "Mains & Bras", value: "33" },
      { label: "Jambes", value: "292" },
      { label: "Chaussures", value: "25" },
      { label: "Masques", value: "101 ou au choix" },
      { label: "Écharpes & Chaînes", value: "237" },
      { label: "Autocollants", value: "0" },
      { label: "Autocollants 2", value: "//" },
      { label: "Chapeaux & Casque", value: "89" },
      { label: "Chapeaux & Casque 2", value: "0" }
    ],
    image: "/tenues/crs8.png",
    imageAlt: "Tenue CRS 8 CRS",
    secondImage: "/tenues/crs82.png",
    secondImageAlt: "Vue alternative de la tenue CRS 8"
  }
];

function TenuesCRS() {
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
      
      <div className="flex-1 relative z-0 ml-[270px] w-[calc(100%-270px)]">
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
            </div>
            <p className="text-gray-400 mt-2">Vous retrouvez ici les tenues de la CRS à porter en fonction de <span className="text-red-400 font-medium font-semibold">vos missions et grades</span></p>
          </motion.div>

                    {/* Section d'information */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">⚠️ Notes importantes ⚠️</h3>
            <ul className="space-y-2 text-gray-300">
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

          {/* Grille de tenues principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
            {outfits.map((outfit, index) => (
              <OutfitCard
                key={index}
                title={outfit.title}
                items={outfit.items}
                imageSrc={outfit.image}
                imageAlt={outfit.imageAlt || `Tenue ${outfit.title}`}
                secondImageSrc={outfit.secondImage}
                secondImageAlt={outfit.secondImageAlt || `Vue alternative de la tenue ${outfit.title}`}
              />
            ))}
          </div>
          
          {/* Section des tenues supplémentaires */}
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {additionalOutfits.map((outfit, index) => (
                <OutfitCard
                  key={index}
                  title={outfit.title}
                  items={outfit.items}
                  imageSrc={outfit.image}
                  imageAlt={outfit.imageAlt || `Tenue ${outfit.title}`}
                  secondImageSrc={outfit.secondImage}
                  secondImageAlt={outfit.secondImageAlt || `Vue alternative de la tenue ${outfit.title}`}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default TenuesCRS;

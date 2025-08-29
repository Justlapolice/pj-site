"use client";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "../../components/sidebar/sidebar";
import { motion } from "framer-motion";
import OutfitCard from "../../components/tenues/OutfitCard";
import { outfits, additionalOutfits } from "../../data/tenues";

function TenuesCRS() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const user = session?.user as
    | { guildNickname?: string; name?: string | null }
    | undefined;
  const displayName = user?.guildNickname || user?.name || "Utilisateur";

  // Vérification de l'authentification
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Déconnexion automatique toutes les heures
  useEffect(() => {
    const timer = setInterval(() => {
      signOut({
        callbackUrl: "/login",
      });
    }, 60 * 60 * 1000);

    return () => clearInterval(timer);
  }, []);

  // Génération des initiales
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // if (status === 'loading') {
  //   return (
  //     <div className="h-screen w-full flex items-center justify-center bg-gray-900">
  //       <div className="animate-pulse flex flex-col items-center">
  //         <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  //         <p className="mt-4 text-gray-300">Chargement de la page {pathname} en cours...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen text-white flex bg-gray-900">
      <Sidebar displayName={displayName} initials={initials} />

      <div className="flex-1 relative z-0 ml-[270px] w-[calc(100%-270px)]">
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <a href="/accueil">
                  <img
                    src="/pjlogo.png"
                    alt="Logo CRS"
                    className="h-10 w-auto"
                  />
                </a>
                <a
                  href="/accueil"
                  className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"
                >
                  Intranet CRS
                </a>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <span className="text-gray-300 text-sm">
                  Connecté en tant que:{" "}
                  <span className="text-blue-400 font-medium">
                    {displayName}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </header>

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
            <p className="text-gray-400 mt-2">
              Vous retrouvez ici les tenues de la CRS à porter en fonction de{" "}
              <span className="text-red-400 font-medium font-semibold">
                vos missions et grades
              </span>
            </p>
          </motion.div>

          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              ⚠️ Notes importantes ⚠️
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>
                  Les grades doivent être correctement positionnés selon la
                  tenue
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>
                  En cas de doute, se référer à son supérieur hiérarchique
                </span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
            {outfits.map((outfit, index) => (
              <OutfitCard
                key={index}
                title={outfit.title}
                items={outfit.items}
                imageSrc={outfit.image}
                imageAlt={outfit.imageAlt || `Tenue ${outfit.title}`}
                secondImageSrc={outfit.secondImage}
                secondImageAlt={
                  outfit.secondImageAlt ||
                  `Vue alternative de la tenue ${outfit.title}`
                }
                thirdImageSrc={outfit.thirdImage}
                thirdImageAlt={
                  outfit.thirdImageAlt ||
                  `Vue alternative de la tenue ${outfit.title}`
                }
                fourthImageSrc={outfit.fourthImage}
                fourthImageAlt={
                  outfit.fourthImageAlt ||
                  `Vue alternative de la tenue ${outfit.title}`
                }
                fifthImageSrc={outfit.fifthImage}
                fifthImageAlt={
                  outfit.fifthImageAlt ||
                  `Vue alternative de la tenue ${outfit.title}`
                }
              />
            ))}
          </div>

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
                  secondImageAlt={
                    outfit.secondImageAlt ||
                    `Vue alternative de la tenue ${outfit.title}`
                  }
                  thirdImageSrc={outfit.thirdImage}
                  thirdImageAlt={
                    outfit.thirdImageAlt ||
                    `Vue alternative de la tenue ${outfit.title}`
                  }
                  fourthImageSrc={outfit.fourthImage}
                  fourthImageAlt={
                    outfit.fourthImageAlt ||
                    `Vue alternative de la tenue ${outfit.title}`
                  }
                  fifthImageSrc={outfit.fifthImage}
                  fifthImageAlt={
                    outfit.fifthImageAlt ||
                    `Vue alternative de la tenue ${outfit.title}`
                  }
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

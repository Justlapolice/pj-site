"use client";

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaShieldAlt, FaExclamationCircle } from "react-icons/fa";
import { SiDiscord } from "react-icons/si";

export default function LoginClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === "loading";
  useEffect(() => {
    if (session) {
      router.push("/accueil");
    }
  }, [session, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b p-4">
      <div className="w-full max-w-md">
        <div className="bg-blue-800 px-8 py-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-full overflow-hidden w-20 h-20 flex items-center justify-center">
              <Image
                src="/pjlogo.png"
                alt="Logo PJ"
                width={80}
                height={80}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Portail Sécurisé</h1>
          <p className="text-blue-100 text-sm mt-1">
            Accès réservé au personnel habilité
          </p>
        </div>

        <div className="p-8 bg-gray-50 rounded-b-md">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Authentification
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Veuillez vous identifier pour continuer
            </p>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Authentification sécurisée
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() =>
                  signIn("discord", { callbackUrl: "/accueil?justLoggedIn=1" })
                }
                className="group w-full bg-[#5865F2] hover:bg-[#4752C4] text-white py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <SiDiscord className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Se connecter avec Discord</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-blue-800 px-8 py-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 text-xs text-white font-extrabold">
            <FaShieldAlt className="text-white" />
            <span>
              Accès sécurisé - Tous droits réservés © {new Date().getFullYear()}
            </span>
          </div>
        </div>

        {!session && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationCircle
                  className="h-5 w-5 text-red-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  L&apos;accès à cette application est strictement réservé au
                  personnel de la Police Judiciaire.
                </p>
                <p className="text-sm text-red-700">
                  Attention, ce site n&apos;est en aucun cas affilié au
                  Ministère de l&apos;Intérieur.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

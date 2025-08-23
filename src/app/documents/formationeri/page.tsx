"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Sidebar from "../../components/sidebar/sidebar";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export default function FormationERI() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const displayName =
    session?.user?.guildNickname || session?.user?.name || "Utilisateur";
  const pathname = usePathname();

  // Le style de fond est géré dans globals.css

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

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Sidebar en overlay */}
      <motion.div
        className="fixed top-0 left-0 h-full bg-[#081a6a] shadow-lg z-40 overflow-hidden"
        animate={{ width: sidebarOpen ? 256 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {sidebarOpen && (
          <Sidebar displayName={displayName} initials={initials} />
        )}
      </motion.div>

      {/* Bouton toggle en bas à droite */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-4 right-4 z-50 p-2 bg-[#081a6a] border rounded-full shadow hover:bg-gray-100 transition"
      >
        {sidebarOpen ? (
          <ChevronLeftIcon className="h-5 w-5 text-blue-700" />
        ) : (
          <ChevronRightIcon className="h-5 w-5 text-blue-700" />
        )}
      </button>

      {/* Contenu principal (Google Sheets) */}
      <motion.div
        className="h-full w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <iframe
          src="https://docs.google.com/document/d/1MyunRAL70GlAi8pMH8KVYcA1OAZYqdAe8M1ekyYrYn4/edit?usp=sharing
"
          className="w-full h-full border-none"
          title="Google Sheets"
        />
      </motion.div>
    </div>
  );
}

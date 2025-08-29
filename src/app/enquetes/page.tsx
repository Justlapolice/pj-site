"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Sidebar from "../../components/sidebar/sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { EyeIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import EnqueteModal from "../../components/ui/enquete-modal";
import { FaPen } from "react-icons/fa";
import { toast } from "../../components/ui/use-toast";

type Statut =
  | "Début"
  | "En cours"
  | "Rapport"
  | "Interpellation"
  | "Terminée"
  | "Annulée";

type Enquete = {
  id: number;
  objet: string;
  accusations: string;
  directeur: string;
  directeurAdjoint: string;
  statut: Statut;
  createdAt: Date;
  updatedAt: Date;
};

export default function Rapport() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as
    | { guildNickname?: string; name?: string | null }
    | undefined;
  const displayName = user?.guildNickname || user?.name || "Utilisateur";
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<{
    id: number | undefined;
    objet: string;
    accusations: string;
    directeur: string;
    directeurAdjoint: string;
    statut: Statut;
  }>({
    id: undefined,
    objet: "",
    accusations: "",
    directeur: "",
    directeurAdjoint: "",
    statut: "Début",
  });

  const [isEditing, setIsEditing] = useState(false);

  const [effectifs, setEffectifs] = useState<
    Array<{
      id: number;
      prenom: string;
      nom: string;
      nomComplet: string;
      poste: string;
      statut: string;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const [enquetes, setEnquetes] = useState<Enquete[]>([]);

  const statusColors = {
    Début: "bg-blue-500",
    "En cours": "bg-yellow-500",
    Rapport: "bg-purple-500",
    Interpellation: "bg-orange-500",
    Terminée: "bg-green-500",
    Annulée: "bg-red-500",
  };

  useEffect(() => {
    const fetchEffectifs = async () => {
      try {
        const response = await fetch("/api/effectifs");
        if (response.ok) {
          const data = await response.json();
          const formattedData = data.map((effectif: any) => ({
            ...effectif,
            nomComplet: `${effectif.prenom} ${effectif.nom}`,
          }));
          setEffectifs(formattedData);
        } else {
          console.error("Erreur lors de la récupération des effectifs");
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEffectifs();
  }, []);

  useEffect(() => {
    const fetchEnquetes = async () => {
      try {
        const response = await fetch("/api/enquetes");
        if (response.ok) {
          const data = await response.json();
          setEnquetes(data);
        } else {
          console.error("Erreur lors de la récupération des enquetes");
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnquetes();
  }, []);

  const loadEnquetes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/enquetes");
      if (response.ok) {
        const data = await response.json();
        setEnquetes(data);
      } else {
        console.error("Erreur lors de la récupération des enquetes");
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const directeurs = [...effectifs];
  const adjoints = [...effectifs];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      loadEnquetes();
    }
  }, [status, router]);
  // Déconnexion auto
  useEffect(() => {
    const timer = setInterval(() => {
      signOut({ callbackUrl: "/login" });
    }, 60 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  // Initiales utilisateur
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleOpenModal = (enquete?: Enquete) => {
    if (enquete) {
      const directeurId =
        directeurs
          .find((d) => d.nomComplet === enquete.directeur)
          ?.id?.toString() || "";
      const adjointId =
        adjoints
          .find((a) => a.nomComplet === enquete.directeurAdjoint)
          ?.id?.toString() || "";

      setFormData({
        id: enquete.id,
        objet: enquete.objet || "",
        accusations: enquete.accusations || "",
        directeur: directeurId,
        directeurAdjoint: adjointId,
        statut: enquete.statut || "Début",
      });
      setIsEditing(true);
    } else {
      setFormData({
        id: undefined,
        objet: "",
        accusations: "",
        directeur: "",
        directeurAdjoint: "",
        statut: "Début",
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const directeurSelectionne = directeurs.find(
        (d) => d.id.toString() === formData.directeur
      );
      const adjointSelectionne = adjoints.find(
        (a) => a.id.toString() === formData.directeurAdjoint
      );

      const enqueteData = {
        objet: formData.objet,
        accusations: formData.accusations,
        directeur: directeurSelectionne?.nomComplet || "",
        directeurAdjoint: adjointSelectionne?.nomComplet || "",
        statut: formData.statut,
      };

      const url =
        isEditing && formData.id
          ? `/api/enquetes/${formData.id}`
          : "/api/enquetes";

      const method = isEditing && formData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enqueteData),
      });

      if (!response.ok) {
        throw new Error(
          `Erreur lors de ${
            isEditing ? "la mise à jour" : "la création"
          } de l'enquête`
        );
      }

      await loadEnquetes();

      setFormData({
        id: undefined,
        objet: "",
        accusations: "",
        directeur: "",
        directeurAdjoint: "",
        statut: "Début",
      });
      setIsEditing(false);

      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur:", error);
      alert(
        `Une erreur est survenue lors de ${
          isEditing ? "la mise à jour" : "la création"
        } de l'enquête`
      );
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "id" ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette enquête ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/enquetes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'enquête");
      }

      await loadEnquetes();

      toast({
        variant: "success",
        title: "Enquête supprimée avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'enquête:", error);
      toast({
        variant: "error",
        title: "Erreur lors de la suppression de l'enquête",
      });
    }
  };

  if (status === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-300">Chargement...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen text-white flex">
      <Sidebar displayName={displayName} initials={initials} />
      <div className="flex-1 ml-[270px] relative z-10">
        <header className="bg-[rgba(5,12,48,1)] backdrop-blur-md border-b border-[rgba(10,20,60,0.6)] sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <a href="/accueil" className="flex items-center gap-2">
              <Image
                src="/pjlogo.png"
                alt="Logo PJ"
                width={40}
                height={40}
                priority
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Intranet Police Judiciaire
              </span>
            </a>
            <span className="text-gray-300 text-sm">
              Connecté en tant que:{" "}
              <span className="text-blue-400 font-medium">{displayName}</span>
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">
                Liste des enquêtes
              </h2>
              <div className="flex gap-2">
                <motion.button
                  onClick={() => handleOpenModal()}
                  className="bg-gradient-to-r from-blue-500 to-white text-black px-4 py-1.5 rounded-xl flex items-center gap-2 shadow-lg text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <PlusIcon className="h-4 w-4" /> Démarrer une nouvelle enquête
                </motion.button>
                <motion.button
                  onClick={() => alert("Archiver des enquêtes")}
                  className="bg-gradient-to-r from-blue-500 to-white text-black px-4 py-1.5 rounded-xl flex items-center gap-2 shadow-lg text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <TrashIcon className="h-4 w-4" /> Archiver une enquête
                </motion.button>
              </div>
            </div>

            <motion.div className="bg-[rgba(5,12,48,0.7)] backdrop-blur-md rounded-2xl border border-[rgba(10,20,60,0.6)] overflow-hidden shadow-md">
              <table className="min-w-full divide-y divide-[rgba(10,20,60,0.5)]">
                <thead className="bg-[rgba(10,20,60,0.6)]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium">
                      N°
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium">
                      Intitulé de l&apos;enquête
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium">
                      Accusations
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium">
                      Directeur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium">
                      Adjoint
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium">
                      Date de début
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {enquetes.map((enquete, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm font-medium">
                        {enquete.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {enquete.objet}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {enquete.accusations}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {enquete.directeur}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {enquete.directeurAdjoint}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[enquete.statut] || "bg-gray-500"
                          } text-white`}
                        >
                          {enquete.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {new Date(enquete.createdAt).toLocaleDateString(
                          "fr-FR"
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                            onClick={() => handleOpenModal(enquete)}
                          >
                            <FaPen />
                          </button>
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded"
                            onClick={() =>
                              router.push(`/public/enquete/${enquete.id}`)
                            }
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
                            onClick={() => handleDelete(enquete.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </motion.div>
        </main>
        <AnimatePresence>
          {isModalOpen && (
            <EnqueteModal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setIsEditing(false);
              }}
              onSubmit={handleSubmit}
              onInputChange={handleInputChange}
              formData={formData}
              setFormData={setFormData}
              directeurs={directeurs}
              adjoints={adjoints}
              isEditing={isEditing}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

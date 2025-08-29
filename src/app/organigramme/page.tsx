"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Sidebar from "../../components/sidebar/sidebar";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CardContent } from "../../components/ui/card";
import EffectifModal from "../../components/ui/effectif-modal";

type Statut = "Actif" | "Non actif";
type Formation = "PJ" | "PTS" | "Moto" | "Nautique" | "Négociateur";

const FORMATIONS: Formation[] = [
  "PJ",
  "PTS",
  "Moto",
  "Nautique",
  "Négociateur",
];

interface Effectif {
  id: number;
  prenom: string;
  nom: string;
  nomPJ: string;
  grade?: string;
  poste: string;
  statut: Statut;
  telephone?: string;
  formations: Formation[];
}

interface RawEffectif extends Omit<Effectif, "formations"> {
  formations: Formation[] | string | null;
}

interface User extends Record<string, any> {
  guildNickname?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  roles?: string[];
}

export default function GestionEffectifs() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [effectifs, setEffectifs] = useState<Effectif[]>([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEffectif, setCurrentEffectif] = useState<Partial<Effectif>>({
    formations: [] as Formation[],
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const user = session?.user as User | undefined;
  const displayName = user?.guildNickname || user?.name || "Utilisateur";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const canManageStaff = user?.roles?.includes("1331527328219529216") || false;

  const showToastMessage = (
    message: string,
    type: "success" | "error" | "warning" = "success"
  ) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 5000);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      signOut({
        callbackUrl: "/login",
      });
    }, 60 * 60 * 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      loadEffectifs();
    }
  }, [status, router]);

  const loadEffectifs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/effectifs");
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des effectifs");
      }
      const data: Array<Omit<Effectif, "id"> & { id?: number }> =
        await response.json();

      const formattedData: Effectif[] = data.map((effectif) => {
        let formations: Formation[] = [];

        if (Array.isArray(effectif.formations)) {
          formations = effectif.formations.filter((f): f is Formation =>
            FORMATIONS.includes(f as Formation)
          );
        } else if (
          effectif.formations &&
          FORMATIONS.includes(effectif.formations as Formation)
        ) {
          formations = [effectif.formations as Formation];
        }

        return {
          ...effectif,
          id: effectif.id || 0,
          formations,
        };
      });

      setEffectifs(formattedData);
      setTotalMembers(formattedData.length);
    } catch (error) {
      console.error("Erreur:", error);
      showToastMessage("Erreur lors du chargement des effectifs", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 5000);
  };

  const handleAddClick = () => {
    setCurrentEffectif({
      prenom: "",
      nomPJ: "",
      nom: "",
      poste: "",
      statut: "Actif",
      telephone: "",
      formations: [],
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditClick = (effectif: Effectif) => {
    const effectifFormations = Array.isArray(effectif.formations)
      ? effectif.formations
      : typeof effectif.formations === "string"
      ? [effectif.formations as Formation]
      : [];

    setCurrentEffectif({
      ...effectif,
      formations: effectifFormations,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const formationsList: Formation[] = [
    "PJ",
    "PTS",
    "Moto",
    "Nautique",
    "Négociateur",
  ];

  const GRADES = [
    "PA",
    "E_GPX",
    "GPX_S",
    "GPX",
    "B_C_Normal",
    "B_C_Sup",
    "MAJ",
    "MEEX",
    "MAJRULP",
    "E_CPT",
    "CPT_S",
    "LTN",
    "CNE",
    "CDT",
    "CDTD",
    "CDTEF",
    "E_COM",
    "COM",
    "CD",
    "CG",
  ];

  const formatGradeForDisplay = (grade?: string) => {
    if (!grade) return "Non spécifié";
    return grade
      .replace(/_/g, "-")
      .replace(/B-C/g, "B/C")
      .replace("B/C-Normal", "B/C Normal")
      .replace("B/C-Sup", "B/C Sup");
  };

  const formatGradeForDb = (grade: string) => {
    return grade.replace(/-/g, "_").replace(/\s+/g, "_");
  };

  const handleSaveNomPJ = async (id: number) => {
    try {
      const response = await fetch(`/api/effectifs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomPJ: editingValue,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour");

      setEffectifs(
        effectifs.map((eff) =>
          eff.id === id ? { ...eff, nomPJ: editingValue } : eff
        )
      );

      setEditingId(null);
      showToast("Nom PJ mis à jour avec succès", "success");
    } catch (error) {
      console.error("Erreur:", error);
      showToast("Erreur lors de la mise à jour du nom PJ", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentEffectif) {
      showToastMessage("Aucun effectif sélectionné", "error");
      return;
    }

    const {
      prenom,
      nom,
      nomPJ,
      grade,
      poste,
      statut,
      telephone,
      formations = [],
    } = currentEffectif;

    if (!prenom || !nom || !poste || !statut) {
      showToastMessage(
        "Veuillez remplir tous les champs obligatoires",
        "error"
      );
      return;
    }

    const validFormations = Array.isArray(formations)
      ? formations.filter((f): f is Formation =>
          FORMATIONS.includes(f as Formation)
        )
      : [];

    const effectifData = {
      prenom,
      nom,
      nomPJ,
      grade: grade ? formatGradeForDb(grade) : null,
      poste,
      statut,
      telephone: telephone || null,
      formations: validFormations,
    };

    try {
      const url =
        isEditing && currentEffectif.id
          ? `/api/effectifs/${currentEffectif.id}`
          : "/api/effectifs";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom,
          nom,
          nomPJ,
          poste,
          statut,
          telephone,
          formations,
          grade: grade || null,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de la sauvegarde");

      showToast(
        isEditing
          ? "Effectif mis à jour avec succès"
          : "Effectif ajouté avec succès",
        "success"
      );

      setIsModalOpen(false);
      loadEffectifs();
    } catch (error) {
      console.error("Erreur:", error);
      showToast("Erreur lors de la sauvegarde", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet effectif ?")) return;

    try {
      const response = await fetch(`/api/effectifs/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression");

      showToast("Effectif supprimé avec succès", "success");
      loadEffectifs();
    } catch (error) {
      console.error("Erreur:", error);
      showToast("Erreur lors de la suppression", "error");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentEffectif((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormationChange = (formation: Formation) => {
    setCurrentEffectif((prev: Partial<Effectif>) => {
      const currentFormations = Array.isArray(prev.formations)
        ? prev.formations
        : [];
      const newFormations = currentFormations.includes(formation)
        ? currentFormations.filter((f: Formation) => f !== formation)
        : [...currentFormations, formation];

      return {
        ...prev,
        formations: newFormations as Formation[],
      };
    });
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex">
      <Sidebar displayName={displayName} initials={initials} />
      <div className="flex-1 ml-[270px] relative z-10">
        <header className="bg-[rgba(5,12,48,0.95)] backdrop-blur-md border-b border-[rgba(10,20,60,0.6)] sticky top-0 z-10 shadow-md">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <a href="/accueil">
                  <img
                    src="/pjlogo.png"
                    alt="Logo CRS"
                    className="h-10 w-auto hover:scale-105 transition-transform duration-300"
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
                <span className="text-gray-200 text-sm">
                  Connecté en tant que:{" "}
                  <span className="text-blue-400 font-semibold">
                    {displayName}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Gestion des effectifs
            </h1>
            <CardContent className="text-gray-200 font-semibold text-lg bg-[rgba(5,12,48,0.5)] px-4 py-2 rounded-lg border border-[rgba(10,20,60,0.5)] shadow-sm">
              Nombre total de membres: {totalMembers || 0}
            </CardContent>
            {canManageStaff && (
              <motion.button
                onClick={handleAddClick}
                className="bg-blue-600/80 hover:bg-blue-500/90 text-white px-5 py-2 rounded-xl flex items-center gap-2 shadow-lg hover:scale-105 transition-transform duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Ajouter un effectif
                <img
                  src="/pjlogo.png"
                  alt="Logo CRS"
                  className="h-5 w-5 mr-2 "
                />
              </motion.button>
            )}
          </div>

          <motion.div
            className="bg-[rgba(5,12,48,0.7)] backdrop-blur-md rounded-2xl border border-[rgba(10,20,60,0.6)] overflow-hidden shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[rgba(10,20,60,0.5)]">
                <thead className="bg-[rgba(10,20,60,0.6)]">
                  <tr>
                    {[
                      "Nom",
                      "Nom PJ",
                      "Grade",
                      "Poste",
                      "Téléphone",
                      "Statut",
                      "Formation",
                      "Actions",
                    ].map((col) => (
                      <th
                        key={col}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(10,20,60,0.5)]">
                  {effectifs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-4 text-center text-gray-400"
                      >
                        Aucun effectif trouvé
                      </td>
                    </tr>
                  ) : (
                    [...effectifs]
                      .sort((a, b) => {
                        const postePriorite: Record<string, number> = {
                          Directeur: 1,
                          Responsable: 2,
                          "Responsable Adjoint": 3,
                          Formateur: 4,
                          Confirmé: 5,
                          Titulaire: 6,
                          Stagiaire: 7,
                        };

                        const gradePriorite: Record<string, number> = {
                          CG: 1,
                          CD: 2,
                          COM: 3,
                          E_COM: 4,
                          CDTEF: 5,
                          CDTD: 6,
                          CDT: 7,
                          CNE: 8,
                          LTN: 9,
                          CPT_S: 10,
                          E_CPT: 11,
                          MAJRULP: 12,
                          MEEX: 13,
                          MAJ: 14,
                          B_C_Sup: 15,
                          B_C_Normal: 16,
                          GPX: 17,
                          GPX_S: 18,
                          E_GPX: 19,
                          PA: 20,
                        };

                        const prioritePosteA = postePriorite[a.poste] || 7;
                        const prioritePosteB = postePriorite[b.poste] || 7;

                        if (prioritePosteA !== prioritePosteB) {
                          return prioritePosteA - prioritePosteB;
                        }

                        const gradeA = a.grade || "";
                        const gradeB = b.grade || "";
                        const prioriteGradeA = gradePriorite[gradeA] || 999;
                        const prioriteGradeB = gradePriorite[gradeB] || 999;

                        if (prioriteGradeA !== prioriteGradeB) {
                          return prioriteGradeA - prioriteGradeB;
                        }

                        return a.nom.localeCompare(b.nom);
                      })
                      .map((effectif) => (
                        <motion.tr
                          key={effectif.id}
                          className="hover:bg-[rgba(10,20,60,0.4)] transition-colors duration-200"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td className="px-6 py-4 flex items-center gap-3">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-blue-600/30 flex items-center justify-center text-blue-400 font-semibold">
                                {effectif.prenom[0]}
                                {effectif.nom[0]}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">
                                  {effectif.prenom} {effectif.nom}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 hover:bg-gray-700/50 cursor-pointer"
                            onClick={() => {
                              setEditingId(effectif.id);
                              setEditingValue(effectif.nomPJ || "");
                            }}
                          >
                            {editingId === effectif.id ? (
                              <div className="flex items-center">
                                <input
                                  type="text"
                                  value={editingValue}
                                  onChange={(e) =>
                                    setEditingValue(e.target.value)
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      handleSaveNomPJ(effectif.id);
                                    } else if (e.key === "Escape") {
                                      setEditingId(null);
                                    }
                                  }}
                                  onBlur={() => handleSaveNomPJ(effectif.id)}
                                  autoFocus
                                  className="bg-gray-700 border border-blue-500 text-white px-2 py-1 rounded w-full"
                                />
                              </div>
                            ) : (
                              <div className="min-h-[24px] flex items-center">
                                {effectif.nomPJ || (
                                  <span className="text-gray-500">
                                    Cliquez pour éditer
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {effectif.grade
                              ? formatGradeForDisplay(effectif.grade)
                              : "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {effectif.poste}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {effectif.telephone || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                effectif.statut === "Actif"
                                  ? "bg-green-100/10 text-green-400 border border-green-400/30"
                                  : "bg-red-100/10 text-red-400 border border-red-400/30"
                              }`}
                            >
                              {effectif.statut}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-2">
                              {Array.isArray(effectif.formations) &&
                              effectif.formations.length > 0 ? (
                                effectif.formations.map(
                                  (formation: Formation, index: number) => (
                                    <span
                                      key={index}
                                      className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100/10 text-blue-400 border border-blue-400/30"
                                    >
                                      {formation}
                                    </span>
                                  )
                                )
                              ) : (
                                <span className="text-gray-500 text-sm">
                                  Aucune formation
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {canManageStaff && (
                              <>
                                <button
                                  onClick={() => handleEditClick(effectif)}
                                  className="text-blue-400 hover:text-blue-300 mr-4"
                                  title="Modifier"
                                >
                                  <PencilIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(effectif.id)}
                                  className="text-red-400 hover:text-red-300"
                                  title="Supprimer"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </>
                            )}
                          </td>
                        </motion.tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          <EffectifModal
            isOpen={isModalOpen}
            isEditing={isEditing}
            effectif={currentEffectif}
            formationsList={formationsList}
            grades={GRADES}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
            onFormationChange={handleFormationChange}
            setEffectif={setCurrentEffectif}
          />
          {toast.show && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center ${
                toast.type === "error"
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              <span className="mr-2">{toast.message}</span>
              <button
                onClick={() => setToast((prev) => ({ ...prev, show: false }))}
                className="ml-2"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}

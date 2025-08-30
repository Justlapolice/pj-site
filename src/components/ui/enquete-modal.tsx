"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

type Statut =
  | "Début"
  | "En cours"
  | "Rapport"
  | "Interpellation"
  | "Terminée"
  | "Annulée";

interface EnqueteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  formData: {
    id?: number;
    objet: string;
    accusations: string;
    directeur: string;
    directeurAdjoint: string;
    statut: Statut;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      id?: number;
      objet: string;
      accusations: string;
      directeur: string;
      directeurAdjoint: string;
      statut: Statut;
    }>
  >;
  directeurs: Array<{ id: number; nomComplet: string }>;
  adjoints: Array<{ id: number; nomComplet: string }>;
  isEditing: boolean;
}

export default function EnqueteModal({
  isOpen,
  onClose,
  onSubmit,
  onInputChange,
  formData,
  directeurs,
  adjoints,
  isEditing,
}: EnqueteModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fond noir semi-transparent */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Contenu du modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              className="relative w-full max-w-lg bg-[#0D0F1A] text-white rounded-xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Titre et bouton de fermeture */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">
                    {isEditing
                      ? "Modifier l'enquête"
                      : "Démarrer une nouvelle enquête"}
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Formulaire */}
                <form onSubmit={onSubmit} className="space-y-5">
                  {/* Objet */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-300">
                      Objet de l&apos;enquête
                    </label>
                    <input
                      type="text"
                      name="objet"
                      value={formData.objet}
                      onChange={onInputChange}
                      required
                      className="w-full px-4 py-2 rounded-md bg-[#0D0F1A] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Accusations */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-300">
                      Chefs d&apos;accusations
                    </label>
                    <input
                      type="text"
                      name="accusations"
                      value={formData.accusations}
                      onChange={onInputChange}
                      required
                      className="w-full px-4 py-2 rounded-md bg-[#0D0F1A] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Directeur */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-300">
                      Directeur d&apos;enquête
                    </label>
                    <select
                      id="directeur"
                      name="directeur"
                      value={formData.directeur}
                      onChange={onInputChange}
                      required
                      className="w-full px-4 py-2 rounded-md bg-[#0D0F1A] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Sélectionner un directeur</option>
                      {directeurs.map((directeur) => (
                        <option key={directeur.id} value={directeur.id}>
                          {directeur.nomComplet}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Directeur adjoint */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-300">
                      Directeur adjoint d&apos;enquête
                    </label>
                    <select
                      id="directeurAdjoint"
                      name="directeurAdjoint"
                      value={formData.directeurAdjoint}
                      onChange={onInputChange}
                      required
                      className="w-full px-4 py-2 rounded-md bg-[#0D0F1A] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Sélectionner un adjoint</option>
                      {adjoints.map((adjoint) => (
                        <option key={adjoint.id} value={adjoint.id}>
                          {adjoint.nomComplet}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Bouton Submit */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full py-2 rounded-md text-white font-medium bg-indigo-600 hover:bg-indigo-700 transition-colors"
                    >
                      {isEditing ? "Mettre à jour" : "Créer"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

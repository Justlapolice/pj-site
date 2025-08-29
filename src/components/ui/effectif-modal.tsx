"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, PlusIcon, PencilIcon } from "@heroicons/react/24/outline";

type Statut = "Actif" | "Non actif";
type Formation = "PJ" | "PTS" | "Moto" | "Nautique" | "Négociateur";

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

interface EffectifModalProps {
  isOpen: boolean;
  isEditing: boolean;
  effectif: Partial<Effectif>;
  formationsList: Formation[];
  grades: string[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onFormationChange: (formation: Formation) => void;
  setEffectif: React.Dispatch<React.SetStateAction<Partial<Effectif>>>;
}

export default function EffectifModal({
  isOpen,
  isEditing,
  effectif,
  formationsList,
  grades,
  onClose,
  onSubmit,
  onInputChange,
  onFormationChange,
  setEffectif,
}: EffectifModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {isEditing ? "Modifier un effectif" : "Ajouter un effectif"}
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Prénom *
                      </label>
                      <input
                        style={{ borderRadius: "10px" }}
                        type="text"
                        name="prenom"
                        value={effectif.prenom || ""}
                        onChange={onInputChange}
                        required
                        placeholder="Entrez le prénom"
                        className="w-full px-4 py-2 text-sm rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Nom *
                      </label>
                      <input
                        style={{ borderRadius: "10px" }}
                        type="text"
                        name="nom"
                        value={effectif.nom || ""}
                        onChange={onInputChange}
                        required
                        placeholder="Entrez le nom"
                        className="w-full px-4 py-2 text-sm rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Nom PJ
                      </label>
                      <input
                        style={{ borderRadius: "10px" }}
                        type="text"
                        name="nomPJ"
                        value={effectif.nomPJ || ""}
                        onChange={onInputChange}
                        placeholder="Entrez le nom PJ"
                        className="w-full px-4 py-2 text-sm rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Grade
                      </label>
                      <select
                        style={{ borderRadius: "10px" }}
                        name="grade"
                        value={effectif.grade || ""}
                        onChange={onInputChange}
                        className="w-full px-4 py-2 text-sm rounded-lg bg-gray-700 border border-gray-600 text-white cursor-pointer"
                      >
                        <option value="">Grade</option>
                        {grades.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Poste *
                      </label>
                      <select
                        style={{ borderRadius: "10px" }}
                        name="poste"
                        value={effectif.poste || ""}
                        onChange={onInputChange}
                        required
                        className="w-full px-4 py-2 text-sm rounded-lg bg-gray-700 border border-gray-600 text-white cursor-pointer"
                      >
                        <option value="">Poste</option>
                        <option value="Stagiaire">Stagiaire</option>
                        <option value="Titulaire">Titulaire</option>
                        <option value="Confirmé">Confirmé</option>
                        <option value="Formateur">Formateur</option>
                        <option value="Responsable Adjoint">
                          Responsable Adjoint
                        </option>
                        <option value="Responsable">Responsable</option>
                        <option value="Directeur">Directeur</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Statut *
                      </label>
                      <select
                        style={{ borderRadius: "10px" }}
                        name="statut"
                        value={effectif.statut || "Actif"}
                        onChange={onInputChange}
                        required
                        className="w-full px-4 py-2 text-sm rounded-lg bg-gray-700 border border-gray-600 text-white cursor-pointer"
                      >
                        <option value="Actif">Actif</option>
                        <option value="Non actif">Non actif</option>
                      </select>
                    </div>

                    <div className="space-y-2 col-span-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Téléphone
                      </label>
                      <input
                        style={{ borderRadius: "10px" }}
                        type="tel"
                        name="telephone"
                        value={effectif.telephone || ""}
                        onChange={onInputChange}
                        placeholder="06.12.34.56.78"
                        pattern="^(\+33|0)[1-9]([-. ]?[0-9]{2}){4}$"
                        className="w-full px-4 py-2 text-sm rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 col-span-2 mt-2">
                    <h3 className="text-base font-medium text-gray-200 border-b border-gray-700 pb-1">
                      Formations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {formationsList.map((formation) => (
                        <label
                          key={formation}
                          className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700/50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={
                              effectif.formations?.includes(formation) || false
                            }
                            onChange={() => onFormationChange(formation)}
                            className="h-4 w-4 text-blue-500 rounded border-gray-500 bg-gray-600"
                          />
                          <span className="text-sm text-gray-200">
                            {formation}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 mt-6 border-t border-gray-700">
                    <button
                      style={{ borderRadius: "10px" }}
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg"
                    >
                      Annuler
                    </button>
                    <button
                      style={{ borderRadius: "10px" }}
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center"
                    >
                      {isEditing ? (
                        <>
                          <PencilIcon className="h-4 w-4 mr-2" /> Mettre à jour
                        </>
                      ) : (
                        <>
                          <PlusIcon className="h-4 w-4 mr-2" /> Ajouter
                        </>
                      )}
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

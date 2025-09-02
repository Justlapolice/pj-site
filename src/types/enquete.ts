export type Statut =
  | "Début"
  | "En cours"
  | "Rapport"
  | "Interpellation"
  | "Terminée"
  | "Annulée";

export interface Enquete {
  id: number;
  objet: string;
  accusations: string;
  directeur: string;
  directeurAdjoint: string;
  statut: Statut;
  archived?: boolean;
  createdAt: string;
  updatedAt: string;
}

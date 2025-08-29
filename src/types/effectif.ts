// Définition des types pour les effectifs
export type Statut = "Actif" | "Non actif";
export type Formation = "PJ" | "PTS" | "Moto" | "Nautique" | "Négociateur";

export interface Effectif {
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

export interface RawEffectif extends Omit<Effectif, "formations"> {
  formations: Formation[] | string | null;
}

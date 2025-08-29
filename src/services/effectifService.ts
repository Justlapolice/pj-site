interface Effectif {
  id: number;
  prenom: string;
  nom: string;
  nomPJ: string;
  grade?: string | null;
  poste: string;
  statut: string;
  telephone?: string | null;
  formations: string[];
  dateArrivee: Date;
  createdAt: Date;
  updatedAt: Date;
}

export async function getEffectifs(): Promise<Effectif[]> {
  try {
    const response = await fetch('/api/effectifs');
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des effectifs');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur dans getEffectifs:', error);
    return [];
  }
}

export function filterEffectifs(effectifs: Effectif[], filterFn: (e: Effectif) => boolean): { id: number; fullName: string }[] {
  return effectifs
    .filter(filterFn)
    .map(e => ({
      id: e.id,
      fullName: `${e.prenom} ${e.nom}${e.grade ? ` (${e.grade})` : ''}`
    }));
}

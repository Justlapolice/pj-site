// Page organigramme - Gestion des effectifs
'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/ui/sidebar';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { CardContent } from '@/components/ui/card';

// Définition des types
type Statut = 'Actif' | 'Non actif';
type Formation = 'CRS' | 'BMU' | 'MO' | 'Maritime' | 'ERI' | 'Secours en Montagne' | 'CRS 8';

// Liste des formations disponibles
const FORMATIONS: Formation[] = [
  'CRS',
  'BMU',
  'MO',
  'Maritime',
  'ERI',
  'Secours en Montagne',
  'CRS 8'
];

interface Effectif {
  id: number;
  prenom: string;
  nom: string;
  grade?: string;
  poste: string;
  statut: Statut;
  telephone?: string;
  formations: Formation[]; // Toujours un tableau de Formation
}

// Type pour les données brutes de l'API
interface RawEffectif extends Omit<Effectif, 'formations'> {
  formations: Formation[] | string | null;
}

interface User extends Record<string, any> {
  guildNickname?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  roles?: string[];
}

// Composant de carte réutilisable
const InfoCard = ({ title, children, icon }: { title: string; children: React.ReactNode; icon: React.ReactNode }) => (
  <motion.div 
    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 h-full flex flex-col"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <div className="flex items-center mb-4">
      <div className="p-2 bg-blue-600/20 rounded-lg mr-3">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
    </div>
    <div className="text-gray-300 flex-1">
      {children}
    </div>
  </motion.div>
);

export default function GestionEffectifs() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [effectifs, setEffectifs] = useState<Effectif[]>([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // État pour gérer les effectifs
  const [currentEffectif, setCurrentEffectif] = useState<Partial<Effectif>>({
    formations: [] as Formation[]
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Gestion sécurisée de la session utilisateur
  const user = session?.user as User | undefined;
  const displayName = user?.guildNickname || user?.name || 'Utilisateur';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
    
  // Vérifier si l'utilisateur a le rôle requis pour la gestion des effectifs
  const canManageStaff = user?.roles?.includes('1397621439388975274') || false;
  
  // Fonction utilitaire pour afficher les notifications
  const showToastMessage = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
  };

  // Déconnexion automatique toutes les heures
  useEffect(() => {
    const timer = setInterval(() => {
      signOut({
        callbackUrl: '/',
      });
    }, 60 * 60 * 1000);

    return () => clearInterval(timer);
  }, []);

  // Vérification de l'authentification
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      loadEffectifs();
    }
  }, [status, router]);

  // Charger les effectifs
  const loadEffectifs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/effectifs');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des effectifs');
      }
      const data: Array<Omit<Effectif, 'id'> & { id?: number }> = await response.json();
      
      // S'assurer que les formations sont toujours des tableaux de Formation
      const formattedData: Effectif[] = data.map(effectif => {
        let formations: Formation[] = [];
        
        if (Array.isArray(effectif.formations)) {
          // Si c'est déjà un tableau, on filtre pour ne garder que les valeurs valides
          formations = effectif.formations.filter((f): f is Formation => 
            FORMATIONS.includes(f as Formation)
          );
        } else if (effectif.formations && FORMATIONS.includes(effectif.formations as Formation)) {
          // Si c'est une seule formation valide
          formations = [effectif.formations as Formation];
        }
        
        return {
          ...effectif,
          id: effectif.id || 0, // Assure un ID par défaut si non fourni
          formations
        };
      });
      
      setEffectifs(formattedData);
      setTotalMembers(formattedData.length);
    } catch (error) {
      console.error('Erreur:', error);
      showToastMessage('Erreur lors du chargement des effectifs', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Afficher un message toast
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
  };

  // Ouvrir le modal d'ajout
  const handleAddClick = () => {
    setCurrentEffectif({
      prenom: '',
      nom: '',
      poste: '',
      statut: 'Actif',
      telephone: '',
      formations: []
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Ouvrir le modal d'édition
  const handleEditClick = (effectif: Effectif) => {
    // S'assurer que formations est toujours un tableau
    const effectifFormations = Array.isArray(effectif.formations) 
      ? effectif.formations 
      : typeof effectif.formations === 'string' 
        ? [effectif.formations as Formation]
        : [];
        
    setCurrentEffectif({
      ...effectif,
      formations: effectifFormations
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Liste des formations disponibles
  const formationsList: Formation[] = [
    'CRS',
    'BMU',
    'MO',
    'Maritime',
    'ERI',
    'Secours en Montagne',
    'CRS 8'
  ];

  // Liste des grades disponibles
  const GRADES = [
    'PA', 'E_GPX', 'GPX_S', 'GPX', 'B_C_Normal', 'B_C_Sup', 'MAJ', 'MEEX', 
    'MAJRULP', 'E_CPT', 'CPT_S', 'LTN', 'CNE', 'CDT', 'CDTD', 'CDTEF', 'E_COM', 'COM', 'CD', 'CG'
  ];

  // Fonction pour formater la valeur du grade pour l'affichage
  const formatGradeForDisplay = (grade?: string) => {
    if (!grade) return 'Non spécifié';
    // Remplacer les underscores par des tirets et B_C par B/C
    return grade
      .replace(/_/g, '-')
      .replace(/B-C/g, 'B/C')
      .replace('B/C-Normal', 'B/C Normal')
      .replace('B/C-Sup', 'B/C Sup');
  };

  // Fonction pour formater la valeur du grade pour la base de données
  const formatGradeForDb = (grade: string) => {
    // Remplacer les tirets par des underscores et les espaces par des underscores
    return grade.replace(/-/g, '_').replace(/\s+/g, '_');
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier si un effectif est sélectionné
    if (!currentEffectif) {
      showToastMessage('Aucun effectif sélectionné', 'error');
      return;
    }

    const { prenom, nom, grade, poste, statut, telephone, formations = [] } = currentEffectif;
    
    // Validation des champs obligatoires
    if (!prenom || !nom || !poste || !statut) {
      showToastMessage('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    // S'assurer que les formations sont valides
    const validFormations = Array.isArray(formations) 
      ? formations.filter((f): f is Formation => 
        FORMATIONS.includes(f as Formation)
      )
      : [];

    // Préparation des données à envoyer
    const effectifData = {
      prenom,
      nom,
      grade: grade ? formatGradeForDb(grade) : null,
      poste,
      statut,
      telephone: telephone || null,
      formations: validFormations
    };

    try {
      // Suppression du code en double

      const url = isEditing && currentEffectif.id 
        ? `/api/effectifs/${currentEffectif.id}`
        : '/api/effectifs';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prenom, 
          nom, 
          poste, 
          statut, 
          telephone, 
          formations,
          grade: grade || null
        })
      });

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');
      
      showToast(
        isEditing ? 'Effectif mis à jour avec succès' : 'Effectif ajouté avec succès',
        'success'
      );
      
      setIsModalOpen(false);
      loadEffectifs();
    } catch (error) {
      console.error('Erreur:', error);
      showToast('Erreur lors de la sauvegarde', 'error');
    }
  };

  // Supprimer un effectif
  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet effectif ?')) return;
    
    try {
      const response = await fetch(`/api/effectifs/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      
      showToast('Effectif supprimé avec succès', 'success');
      loadEffectifs();
    } catch (error) {
      console.error('Erreur:', error);
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  // Gérer les changements des champs du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentEffectif(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormationChange = (formation: Formation) => {
    setCurrentEffectif((prev: Partial<Effectif>) => {
      const currentFormations = Array.isArray(prev.formations) ? prev.formations : [];
      const newFormations = currentFormations.includes(formation)
        ? currentFormations.filter((f: Formation) => f !== formation)
        : [...currentFormations, formation];
      
      return {
        ...prev,
        formations: newFormations as Formation[]
      };
    });
  };

  // Formater la date d'arrivée
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (status === 'loading' || isLoading) {
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
        {/* En-tête */}
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <a href="/accueil"><img src="/crslogo.svg" alt="Logo CRS" className="h-10 w-auto" /></a>
                <a href="/accueil" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Intranet CRS
                </a>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <span className="text-gray-300 text-sm">Connecté en tant que: <span className="text-blue-400 font-medium">{displayName}</span></span>
              </div>
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <main className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Gestion des effectifs 
            </h1>
            <CardContent className="text-red-300 text-sm font-bold text-3xl">Nombre total de membres: {totalMembers || 0}</CardContent>
            {canManageStaff && (
              <motion.button
                onClick={handleAddClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
                style={{ borderRadius: '0.5rem' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Ajouter un effectif 
                <img src="/crslogo.svg" alt="Logo CRS" className="h-5 w-5 mr-2 " />
              </motion.button>
            )}
          </div>

          {/* Tableau des effectifs */}
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Nom
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Grade
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Poste
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Téléphone
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Statut
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Formation
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                  {effectifs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        Aucun effectif trouvé
                      </td>
                    </tr>
                  ) : (
                    // Trier les effectifs par ordre hiérarchique des postes, puis des grades, puis par nom
                    [...effectifs]
                      .sort((a, b) => {
                        // Définir l'ordre de priorité des postes (du plus haut au plus bas)
                        const postePriorite: Record<string, number> = {
                          'Directeur': 1,
                          'Responsable': 2,
                          'Responsable Adjoint': 3,
                          'Formateur': 4,
                          'Confirmé': 5,
                          'Stagiaire': 6
                        };
                        
                        // Définir l'ordre de priorité des grades
                        const gradePriorite: Record<string, number> = {
                          'CG': 1,
                          'CD': 2,
                          'COM': 3,
                          'E_COM': 4,
                          'CDTEF': 5,
                          'CDTD': 6,
                          'CDT': 7,
                          'CNE': 8,
                          'LTN': 9,
                          'CPT_S': 10,
                          'E_CPT': 11,
                          'MAJRULP': 12,
                          'MEEX': 13,
                          'MAJ': 14,
                          'B_C_Sup': 15,
                          'B_C_Normal': 16,
                          'GPX': 17,
                          'GPX_S': 18,
                          'E_GPX': 19,
                          'PA': 20
                        };
                        
                        // Récupérer la priorité des postes
                        const prioritePosteA = postePriorite[a.poste] || 7;
                        const prioritePosteB = postePriorite[b.poste] || 7;
                        
                        // Si les postes sont différents, trier par poste
                        if (prioritePosteA !== prioritePosteB) {
                          return prioritePosteA - prioritePosteB;
                        }
                        
                        // Si même poste, trier par grade
                        const gradeA = a.grade || '';
                        const gradeB = b.grade || '';
                        const prioriteGradeA = gradePriorite[gradeA] || 999;
                        const prioriteGradeB = gradePriorite[gradeB] || 999;
                        
                        if (prioriteGradeA !== prioriteGradeB) {
                          return prioriteGradeA - prioriteGradeB;
                        }
                        
                        // Si même grade et même poste, trier par nom de famille
                        return a.nom.localeCompare(b.nom);
                      })
                      .map((effectif) => (
                      <motion.tr 
                        key={effectif.id} 
                        className="hover:bg-gray-700/30 transition-colors"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-medium">
                              {effectif.prenom[0]}{effectif.nom[0]}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">{effectif.prenom} {effectif.nom}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {effectif.grade ? formatGradeForDisplay(effectif.grade) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {effectif.poste}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {effectif.telephone || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            effectif.statut === 'Actif' ? 'bg-green-100/10 text-green-400 border border-green-400/30' : 'bg-red-100/10 text-red-400 border border-red-400/30'
                          }`}>
                            {effectif.statut}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(effectif.formations) && effectif.formations.length > 0 ? (
                              effectif.formations.map((formation: Formation, index: number) => (
                                <span 
                                  key={index}
                                  className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100/10 text-blue-400 border border-blue-400/30"
                                >
                                  {formation}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-500 text-sm">Aucune formation</span>
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

          {/* Modal d'ajout/édition - Seulement pour les utilisateurs autorisés */}
          <AnimatePresence>
            {isModalOpen && canManageStaff && (currentEffectif && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                  onClick={() => setIsModalOpen(false)}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-title"
                />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.98 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                    className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6 ">
                        <h2 
                          id="modal-title"
                          className="text-xl font-bold text-gray-900 dark:text-white "
                        >
                          {isEditing ? 'Modifier un effectif' : 'Ajouter un effectif'}
                        </h2>
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                          aria-label="Fermer la fenêtre"
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Prénom *</label>
                            <input
                              style={{ borderRadius: '0.5rem' }}
                              type="text"
                              name="prenom"
                              value={currentEffectif.prenom || ''}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Nom *</label>
                            <label 
                              htmlFor="nom" 
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                            </label>
                            <input
                              style={{ borderRadius: '0.5rem' }}
                              type="text"
                              id="nom"
                              name="nom"
                              value={currentEffectif.nom || ''}
                              onChange={handleInputChange}
                              className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              required
                              aria-required="true"
                            />
                          </div>

                          <div className="relative">
                            <label 
                              htmlFor="grade" 
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                              Grade
                            </label>
                            <select
                              style={{ borderRadius: '0.5rem' }}
                              id="grade"
                              name="grade"
                              value={currentEffectif.grade || ''}
                              onChange={handleInputChange}
                              className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
                            >
                              <option value="">Sélectionner un grade</option>
                              {GRADES.map((grade) => (
                                <option key={grade} value={grade}>
                                  {grade}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>

                          <div className="relative">
                            <label 
                              htmlFor="poste" 
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                            </label>
                            <select
                              style={{ borderRadius: '0.5rem' }}
                              id="poste"
                              name="poste"
                              value={currentEffectif.poste || ''}
                              onChange={handleInputChange}
                              className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
                              required
                              aria-required="true"
                            >
                              <option value="">Sélectionner un poste</option>
                              <option value="Stagiaire">Stagiaire</option>
                              <option value="Confirmé">Confirmé</option>
                              <option value="Formateur">Formateur</option>
                              <option value="Responsable Adjoint">Responsable Adjoint</option>
                              <option value="Responsable">Responsable</option>
                              <option value="Directeur">Directeur</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>

                          <div className="relative">
                            <label 
                              htmlFor="statut" 
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                            </label>
                            <select
                              style={{ borderRadius: '0.5rem' }}
                              id="statut"
                              name="statut"
                              value={currentEffectif.statut || 'Actif'}
                              onChange={handleInputChange}
                              className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
                              required
                              aria-required="true"
                            >
                              <option value="Actif">Actif</option>
                              <option value="Non actif">Non actif</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>

                          <div className="relative">
                            <label 
                              htmlFor="telephone" 
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                              Téléphone
                            </label>
                            <div className="relative">
                              <input
                                style={{ borderRadius: '0.5rem' }}
                                type="tel"
                                id="telephone"
                                name="telephone"
                                value={currentEffectif.telephone || ''}
                                onChange={handleInputChange}
                                placeholder="06.12.34.56.78"
                                pattern="^(\+33|0)[1-9]([-. ]?[0-9]{2}){4}$"
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              />
                              {currentEffectif.telephone && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newEffectif = { ...currentEffectif, telephone: '' };
                                    setCurrentEffectif(newEffectif);
                                  }}
                                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                  aria-label="Effacer le numéro de téléphone"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Format: 06.12.34.56.78</p>
                          </div>

                          {/* Section Formations */}
                          <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-200 mb-3">Formations</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {formationsList.map((formation) => (
                                <label key={formation} className="flex items-center space-x-2 text-gray-200">
                                  <input
                                    style={{ borderRadius: '0.5rem' }}
                                    type="checkbox"
                                    checked={currentEffectif.formations?.includes(formation) || false}
                                    onChange={() => handleFormationChange(formation)}
                                    className="h-4 w-4 text-blue-600 rounded border-gray-600 bg-gray-700 focus:ring-blue-500"
                                  />
                                  <span>{formation}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                        </div>

                        <div className="mt-8 flex justify-end space-x-3">
                          <button
                            style={{ borderRadius: '0.5rem' }}
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                          >
                            Annuler
                          </button>
                          <button
                            style={{ borderRadius: '0.5rem' }}
                            type="submit"
                            className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 flex items-center "
                          >
                            {isEditing ? (
                              <>
                                <PencilIcon className="h-4 w-4 mr-2" />
                                Mettre à jour
                              </>
                            ) : (
                              <>
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Ajouter
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                </div>
              </>
            )
          )}
          </AnimatePresence>

          {/* Toast de notification */}
          {toast.show && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center ${
                toast.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}
            >
              <span className="mr-2">{toast.message}</span>
              <button
                onClick={() => setToast(prev => ({ ...prev, show: false }))}
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

'use client';
import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from'../../../components/sidebar/sidebar';
import { motion } from 'framer-motion';

// Types pour les composants
interface OptionType {
  value: string;
  label: string;
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  type?: string;
  [key: string]: any;
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: OptionType[];
  className?: string;
}

// Composant Input réutilisable
const InputField = ({ label, value, onChange, className = '', ...props }: InputFieldProps) => (
  <div className={`mb-4 ${className}`}>
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    />
  </div>
);

// Composant Select réutilisable
const SelectField = ({ label, value, onChange, options, className = '' }: SelectFieldProps) => (
  <div className={`mb-4 ${className}`}>
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map((option: OptionType) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default function RetentionPermis() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as { guildNickname?: string; name?: string | null } | undefined;
  const displayName = user?.guildNickname || user?.name || 'Utilisateur';
  const pathname = usePathname();
  const hasAccess = true;

  // État pour le formulaire
  const [formData, setFormData] = useState({
    nomPrenom: '',
    qualifJudiciaire: '',
    date: '',
    heure: '',
    lieu: '',
    motif: '',
    vitesseLimitée: '',
    vitesseEnregistrée: '',
    vitesseRetenue: '',
    typepersonne: '',
    profession: '',
    dateNaissance: '',
    lieuNaissance: '',
    adresse: '',
    domiciliation: '',
    mesurePrise: '',
    motifRetention: '',
    vehiculeImmatriculation: '',
    vehiculeMarque: '',
    vehiculeType: '',
    lieuInfraction: '',
    dateHeureInfraction: '',
    infractionArticle: '',
    infractionTexte: '',
    observations: '',
    officierNom: '',
    officierMatricule: '',
    dateEtablissement: new Date().toISOString().split('T')[0],
  });

  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de soumission du formulaire
    console.log('Formulaire soumis:', formData);
    // Ici, vous pourriez ajouter une logique pour sauvegarder les données
  };

  // Vérification de l'authentification
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && !hasAccess) {
      router.push('/accueil');
    }
  }, [status, hasAccess, router]);

  // Déconnexion automatique toutes les heures
  useEffect(() => {
    const timer = setInterval(() => {
      signOut({
        callbackUrl: '/',
      });
    }, 60 * 60 * 1000);

    return () => clearInterval(timer);
  }, []);

  // Génération des initiales
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

//   if (status === 'loading') {
//     return (
//       <div className="h-screen w-full flex items-center justify-center bg-gray-900">
//         <div className="animate-pulse flex flex-col items-center">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//           <p className="mt-4 text-gray-300">Chargement de la page {pathname} en cours...</p>
//         </div>
//       </div>
//     );
//   }

if (!hasAccess) {
  return null;
}

  return (
    <div className="min-h-screen text-white flex">
      <Sidebar displayName={displayName} initials={initials} />
      <div className="flex-1 ml-[270px] relative z-10">
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <a href="/accueil">
                  <img src="/crslogo.svg" alt="Logo CRS" className="h-10 w-auto" />
                </a>
                <a href="/accueil" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Intranet CRS
                </a>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <span className="text-gray-300 text-sm">
                  Connecté en tant que: <span className="text-blue-400 font-medium">{displayName}</span>
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 mb-8">
            <div className="text-center mb-8 space-y-6">
              <h1 className="text-2xl font-bold text-white mb-2">MINISTÈRE DE l’INTERIEUR DE LA SÉCURITÉ INTÉRIEURE ET DES
LIBERTÉS LOCALES</h1>
              <h2 className="bg-gray-900/60 p-6 rounded-lg mb-6 text-xl text-white mb-2 space-y-6 text-lg font-semibold text-blue-400 mb-4 border-b border-gray-700 pb-2">SERVICE DE POLICE NATIONALE <h3 className="text-lg text-blue-700">Compagnie <span className="text-white">Républicaine <span className="text-red-600">de Sécurité </span></span></h3></h2>
              <h3 className="text-lg text-gray-300">AVIS DE RÉTENTION D'UN PERMIS DE CONDUIRE</h3>
              <p className="text-sm text-gray-400 mt-2">
                (articles L. 224-1 à L. 224-3 et R. 224-1 à R. 224-19 du code de la route)
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1 : AUTORITÉ DÉCIDANT LA MESURE DE RÉTENTION */}
              <div className="bg-gray-900/30 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-4 border-b border-gray-700 pb-2">
                AUTORITÉ DÉCIDANT LA MESURE DE RÉTENTION
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Nom et prénom"
                    value={formData.nomPrenom}
                    onChange={handleInputChange('nomPrenom')}
                  />
                  <InputField
                    label="Qualification Judiciaire"
                    value={formData.qualifJudiciaire}
                    onChange={handleInputChange('qualifJudiciaire')}
                  />
                </div>
              </div>
            </form>  

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 2 : DATE, HEURE ET LIEU DE LA MESURE PORTANT INTERDICTION DE CONDUIRE */}
              <div className="bg-gray-900/30 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-4 border-b border-gray-700 pb-2">
                  DATE, HEURE ET LIEU DE LA MESURE PORTANT INTERDICTION DE CONDUIRE
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange('date')}
                  />
                  <InputField
                    label="Heure"
                    value={formData.heure}
                    onChange={handleInputChange('heure')}
                  />
                  <InputField
                    label="Lieu"
                    value={formData.lieu}
                    onChange={handleInputChange('lieu')}
                  />
                </div>
              </div>
            </form>  

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 3 : MOTIF DE LA DÉCISION DE RÉTENTION IMMÉDIATE */}
              <div className="bg-gray-900/30 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-4 border-b border-gray-700 pb-2">
                  MOTIF DE LA DÉCISION DE RÉTENTION IMMÉDIATE
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Le" 
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange('date')}    
                  />
                  <InputField
                    label="Heure"
                    value={formData.heure}
                    onChange={handleInputChange('heure')}
                  />
                  <InputField
                    label="Motif"
                    value={formData.motif}
                    onChange={handleInputChange('motif')}
                  />
                </div>
              </div>
            </form>  
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 4 : Si excès de vitesse */}
              <div className="bg-gray-900/30 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-4 border-b border-gray-700 pb-2">
                  SI EXCES DE VITESSE
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Vitesse limitée à :"
                  value={formData.vitesseLimitée || ''}  // Ajoutez cette ligne
                  onChange={handleInputChange('vitesseLimitée')}
                />
                <InputField
                  label="Vitesse enregistrée à :"
                  value={formData.vitesseEnregistrée || ''}  // Ajoutez cette ligne
                  onChange={handleInputChange('vitesseEnregistrée')}
                />
                <InputField
                  label="Vitesse retenue :"
                  value={formData.vitesseRetenue || ''}  // Ajoutez cette ligne
                  onChange={handleInputChange('vitesseRetenue')}
                />
                  
                </div>
              </div>
            </form>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 5 : Identification du contrevenant */}
              <div className="bg-gray-900/30 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-4 border-b border-gray-700 pb-2">
                RENSEIGNEMENTS SUR LE CONDUCTEUR OU L’ACCOMPAGNATEUR DE L'ÉLÈVE CONDUCTEUR

                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  label="Mr/Mme/Melle :"
                  value={formData.typepersonne}
                  onChange={handleInputChange('typepersonne')}
                  options={[
                    { value: '', label: 'Sélectionner le type de personne' },
                    { value: 'mr', label: 'Monsieur' },
                    { value: 'mme', label: 'Madame' },
                    { value: 'melle', label: 'Autre' },
                  ]}
                />
                  <InputField
                    label="Nom et prénom : "
                    value={formData.nomPrenom}
                    onChange={handleInputChange('nomPrenom')}
                  />
                  <InputField
                    label="Date de naissance : "
                    value={formData.dateNaissance}
                    onChange={handleInputChange('dateNaissance')}
                  />
                  <InputField
                    label="Profession : "
                    value={formData.profession}
                    onChange={handleInputChange('profession')}
                  />
                  <InputField
                    label="Domiciliation : "
                    value={formData.domiciliation}
                    onChange={handleInputChange('domiciliation')}
                  />
                </div>
              </div>

              {/* Section 6 : Détails du permis */}
              <div className="bg-gray-900/30 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-4 border-b border-gray-700 pb-2">
                  MESURES PRISES
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InputField
                    label="Mesure prise :"
                    value={formData.mesurePrise}
                    onChange={handleInputChange('mesurePrise')}
                  />
                </div>
              </div>

              {/* Section 7 : Détails */}
              <div className="bg-gray-900/30 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-4 border-b border-gray-700 pb-2">
                  DÉTAILS
                </h3>
            

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <InputField
                  label="Motif de la rétention"
                  value={formData.motifRetention}
                  onChange={handleInputChange('motifRetention')}
                />
                  <InputField
                    label="Véhicule - Immatriculation"
                    value={formData.vehiculeImmatriculation}
                    onChange={handleInputChange('vehiculeImmatriculation')}
                  />
                  <InputField
                    label="Marque"
                    value={formData.vehiculeMarque}
                    onChange={handleInputChange('vehiculeMarque')}
                  />
                  <InputField
                    label="Type"
                    value={formData.vehiculeType}
                    onChange={handleInputChange('vehiculeType')}
                  />
                </div>
              </div>

              {/* Section 7 : Observations */}
              <div className="bg-gray-900/30 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-red-500 mb-4 border-b border-gray-700 pb-2">
                SERVICE DÉTENTEUR DU PERMIS : LA PRÉFECTURE DE PARIS
                </h3>
                
                
              </div>

              {/* Section 8 : Signature */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="flex flex-col justify-end">
                  <div className="text-right">
                    <p className="text-sm text-gray-400 mb-2">Fait à ______________ le {new Date().toLocaleDateString('fr-FR')}</p>
                    <div className="mt-4 border-t border-gray-700 pt-4">
                      <p className="text-sm text-gray-300">Signature et cachet</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                >
                  Annuler
                </button>
                <div className="space-x-4">
                  <button
                    type="button"
                    className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors"
                  >
                    Enregistrer le brouillon
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  >
                    Valider et envoyer
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

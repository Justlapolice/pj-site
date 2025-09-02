"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FaCheck,
  FaLink,
  FaTrash,
  FaSave,
  FaTimes,
  FaPen,
} from "react-icons/fa";
import { EditableSection } from "../../../../components/editable/editable-section";
import { useSession } from "next-auth/react";
import { RichTextEditor } from "../../../../components/editable/rich-text-editor";
import Image from "next/image";

type Statut =
  | "Début"
  | "En cours"
  | "Rapport"
  | "Interpellation"
  | "Terminée"
  | "Annulée";

interface Enquete {
  id: number;
  objet: string;
  directeur: string;
  directeurAdjoint: string;
  statut: Statut;
  createdAt: string;
  updatedAt: string;
  accusations?: string;
}

interface Note {
  id: number;
  content: string;
  createdAt: string;
}

interface User {
  guildNickname?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  roles?: string[];
}

export default function EnquetePage() {
  const { data: session } = useSession();
  const user = session?.user as User | undefined;
  const params = useParams();
  const id = params?.id as string;

  const allowedRoles = ["1117516088196997181", "1358837249751384291"];
  const usernameBypass = "justforever974";
  const hasEditPermission =
    user?.roles?.some((role) => allowedRoles.includes(role)) ||
    session?.user?.name === usernameBypass;

  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [enquete, setEnquete] = useState<Enquete | null>(null);
  const [effectifDirecteur, setEffectifDirecteur] = useState<{
    grade?: string;
  } | null>(null);
  const [effectifDirecteurAdjoint, setEffectifDirecteurAdjoint] = useState<{
    grade?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const grades = {
    PA: "Policier Adjoint",
    E_GPX: "Élève Gardien de la Paix",
    GPX_S: "Gardien de la Paix Stagiaire",
    GPX: "Gardien de la Paix",
    B_C_Normal: "Brigadier Chef de Classe Normal",
    B_C_Sup: "Brigadier-Chef de Classe Supérieur",
    MAJ: "Major",
    MEEX: "Major Exeptionnel",
    MAJRULP: "Major-RULP",
    E_CPT: "Élève Officier",
    CPT_S: "Lieutenant Stagiaire",
    LTN: "Lieutenant",
    CNE: "Capitaine",
    CDT: "Commandant",
    CDTD: "Commandant Divisionnaire",
    CDTEF: "Commandant Divisionnaire Fonctionnel de la Police Nationale",
    E_COM: "Élève Commissaire",
    COM: "Commissaire",
    CD: "Commissaire Divisionnaire",
    CG: "Contrôleur Général",
  };

  const getGradeLabel = (gradeKey?: string | null) => {
    if (!gradeKey) return "";
    return grades[gradeKey as keyof typeof grades] || gradeKey;
  };
  const [rotations, setRotations] = useState({ dir: 0, adj: 0 });
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isEditingRichText, setIsEditingRichText] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  interface SectionData {
    [key: string]: string;
  }

  const [sectionsData, setSectionsData] = useState<Record<string, SectionData>>(
    {}
  );

  const statusColors = {
    Début: "bg-blue-500 hover:bg-blue-600",
    "En cours": "bg-yellow-500 hover:bg-yellow-600",
    Rapport: "bg-purple-500 hover:bg-purple-600",
    Interpellation: "bg-orange-500 hover:bg-orange-600",
    Terminée: "bg-green-500 hover:bg-green-600",
    Annulée: "bg-red-500 hover:bg-red-600",
  };

  const today = new Date();
  const jour = String(today.getDate()).padStart(2, "0"); // 29
  const mois = String(today.getMonth() + 1).padStart(2, "0"); // 08
  const annee = today.getFullYear(); // 2025

  const numeroEnquete = `PN17ARR${annee}${jour}${mois}`;

  const handleStatusChange = async (newStatus: Statut) => {
    if (!enquete) return;
    setSaving(true);

    try {
      const response = await fetch(`/api/enquetes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: newStatus }),
      });

      if (response.ok) {
        setEnquete({ ...enquete, statut: newStatus });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    } finally {
      setSaving(false);
      setShowStatusDropdown(false);
    }
  };

  useEffect(() => {
    const randomRotation = () => Math.random() * 6 - 3;
    setRotations({ dir: randomRotation(), adj: randomRotation() });

    const fetchEnquete = async () => {
      try {
        const [enqueteResponse, sectionsResponse] = await Promise.all([
          fetch(`/api/enquetes/${id}`),
          fetch(`/api/sections?enqueteId=${id}`),
        ]);

        if (enqueteResponse.ok) {
          const data = await enqueteResponse.json();
          setEnquete(data);
        } else {
          console.error("Erreur lors de la récupération de l'enquête");
        }

        if (sectionsResponse.ok) {
          const sections = await sectionsResponse.json();
          const sectionsMap = (
            sections as Array<{ sectionId: string; data: SectionData }>
          ).reduce<Record<string, SectionData>>((acc, section) => {
            acc[section.sectionId] = section.data;
            return acc;
          }, {});
          setSectionsData(sectionsMap);
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEnquete();
    }
  }, [id]);

  useEffect(() => {
    const fetchEffectifs = async () => {
      if (!enquete) return;

      try {
        const dirResponse = await fetch(
          `/api/effectifs?nomPJ=${enquete.directeur}`
        );
        if (dirResponse.ok) {
          const data = await dirResponse.json();
          setEffectifDirecteur(data[0] || {});
        }

        const adjResponse = await fetch(
          `/api/effectifs?nomPJ=${enquete.directeurAdjoint}`
        );
        if (adjResponse.ok) {
          const data = await adjResponse.json();
          setEffectifDirecteurAdjoint(data[0] || {});
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des effectifs:", error);
      }
    };

    if (enquete) {
      fetchEffectifs();
    }
  }, [enquete]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => alert("Lien copié dans le presse-papier !"))
      .catch((err) => console.error("Erreur lors de la copie :", err));
  };

  const fetchNotes = async () => {
    try {
      const response = await fetch(`/api/noteenquetes?enqueteId=${id}`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des notes:", error);
    }
  };

  useEffect(() => {
    if (id) fetchNotes();
  }, [id]);

  const addNote = async () => {
    if (!newNote.trim()) return;
    setSaving(true);

    try {
      const response = await fetch("/api/noteenquetes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enqueteId: Number(id),
          content: newNote.trim(),
        }),
      });

      if (response.ok) {
        const newNoteData = await response.json();
        setNotes([newNoteData, ...notes]);
        setNewNote("");
      } else {
        console.error("Erreur lors de la sauvegarde de la note");
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setSaving(false);
    }
  };

  const renderNoteContent = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);

    return (
      <>
        {parts.map((part, idx) => {
          try {
            const url = new URL(part.trim());
            const pathname = url.pathname.toLowerCase();

            if (
              pathname.endsWith(".png") ||
              pathname.endsWith(".jpg") ||
              pathname.endsWith(".jpeg") ||
              pathname.endsWith(".gif") ||
              pathname.endsWith(".webp")
            ) {
              return (
                <Image
                  key={idx}
                  src={part}
                  alt="note image"
                  className="max-w-full rounded cursor-pointer hover:opacity-80 transition my-1"
                  onClick={() => setLightboxImage(part)}
                />
              );
            }

            return (
              <a
                key={idx}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                {part}
              </a>
            );
          } catch (error) {
            console.error(
              "Erreur lors du traitement du contenu de la note:",
              error
            );
            return <span key={idx}>{part}</span>;
          }
        })}
      </>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f0f1a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!enquete) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f0f1a]">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Erreur 404</h1>
          <p className="mb-6 text-red-500 font-extrabold">
            L&apos;enquête n&apos;existe pas ou a été supprimée.
          </p>
          <p className="text-sm text-gray-500 font-bold">
            Cordialement, l&apos;équipe de la Police Judiciare
          </p>
        </div>
      </div>
    );
  }

  const handleSaveSection = async (
    sectionId: string,
    data: Record<string, string>
  ): Promise<void> => {
    try {
      const response = await fetch("/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enqueteId: id, sectionId, data }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde");
      }

      setSectionsData((prev) => ({
        ...prev,
        [sectionId]: data,
      }));

      // Mise à jour de la date après une sauvegarde réussie
      if (sectionId === "compteRendu") {
        setEnquete((prev) =>
          prev
            ? {
                ...prev,
                updatedAt: new Date().toISOString(),
              }
            : null
        );
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la section:", error);
    }
  };

  // Définition des types de champs autorisés
  type FieldType = "text" | "textarea" | "date" | "link" | "richtext";

  interface SectionField {
    key: string;
    label: string;
    type?: FieldType;
  }

  const sections = [
    {
      id: "enqueteurs",
      title: "ENQUÊTEUR(S)/ENQUÊTRICE(S)",
      icon: (
        <button
          onClick={() => alert("Modifier")}
          className="text-white hover:text-gray-200 transition"
        ></button>
      ),
      content: (
        <>
          Nous soussigné :{" "}
          <b>
            {getGradeLabel(effectifDirecteur?.grade)} {enquete.directeur}
          </b>
          , Officier de Police Judiciaire, en résidence à Paris 75000
          <br />
          Assisté de :{" "}
          <b>
            {getGradeLabel(effectifDirecteurAdjoint?.grade)}{" "}
            {enquete.directeurAdjoint}
          </b>
          , Officier de Police Judiciaire, en résidence à Paris 75000
        </>
      ),
    },
    {
      id: "identite",
      title: "IDENTITÉ DE L'ENQUÊTE",
      fields: [
        { key: "numeroEnquete", label: "Numéro d'enquête" },
        { key: "dateOuverture", label: "Date d'ouverture", type: "date" },
        { key: "lieu", label: "Lieu des faits" },
      ],
      initialData: sectionsData["identite"] || {},
    },
    {
      id: "documents",
      title: "DOCUMENTS RELATIFS À L'ENQUÊTE",
      fields: [
        { key: "pvi", label: "PVI", type: "link" },
        { key: "pva", label: "PVA", type: "link" },
        { key: "plainte", label: "Plainte", type: "link" },
        { key: "piecesJointes", label: "PJ", type: "link" },
      ],
      initialData: sectionsData["documents"] || {},
    },
    {
      id: "compteRendu",
      title: "COMPTE-RENDU DE L'ENQUÊTE",
      fields: [
        {
          key: "contenu",
          label: "Contenu du compte-rendu",
          type: "richtext" as const,
        },
      ] as SectionField[],
      initialData: sectionsData["compteRendu"] || {
        contenu: "",
        date: new Date().toISOString().split("T")[0],
      },
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0f0f1a] text-white p-6 space-y-6">
      {/* Header et statut */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {enquete && (
          <h1 className="text-2xl font-bold">
            Rapport de synthèse - Enquête n°PJ {id} {numeroEnquete}
            {/* <p className="text-lg font-semibold text-gray-400">
              - Objet de l&apos;enquête : {enquete.objet}
            </p>
            <p className="text-lg font-semibold text-gray-400">
              - Chefs Accusations : {enquete.accusations || "Non renseigné"}
            </p> */}
          </h1>
        )}

        <div className="relative">
          {hasEditPermission && (
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className={`px-4 py-1 rounded-full text-white font-medium text-sm ${
                statusColors[enquete.statut as keyof typeof statusColors] ||
                "bg-gray-500"
              } transition-colors flex items-center gap-2`}
              disabled={saving}
            >
              {enquete.statut}
              <svg
                className={`w-4 h-4 transition-transform ${
                  showStatusDropdown ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}
          {showStatusDropdown && (
            <div className="absolute z-10 mt-1 w-40 bg-[#1e1e2d] rounded-md shadow-lg border border-gray-700">
              {(Object.keys(statusColors) as Statut[]).map((statut) => (
                <button
                  key={statut}
                  onClick={() => handleStatusChange(statut)}
                  className={`w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2a2a3a] ${
                    statusColors[statut as keyof typeof statusColors]
                  }`}
                >
                  {statut}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 bg-yellow-600 px-3 py-1.5 rounded hover:bg-yellow-700 transition"
        >
          <FaLink /> Lien
        </button>

        {hasEditPermission && (
          <button
            onClick={() => handleStatusChange("Annulée")}
            className="flex items-center gap-2 bg-red-600 px-3 py-1.5 rounded hover:bg-red-700 transition"
          >
            <FaTrash /> Annuler
          </button>
        )}

        {hasEditPermission && (
          <button
            onClick={() => handleStatusChange("Terminée")}
            className="flex items-center gap-2 bg-green-600 px-3 py-1.5 rounded hover:bg-green-700 transition"
          >
            <FaCheck /> Clôturer
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Bloc Rapport */}
        <div className="flex-1 bg-[#161622] p-6 rounded-xl shadow-lg border border-[#222] space-y-6">
          {/* En-tête du rapport */}
          <div className="border border-[#070995] rounded-md overflow-hidden bg-[#161622]">
            <div className="grid grid-cols-3 divide-x divide-[#070995] items-stretch text-center">
              {/* Logo gauche */}
              <div className="flex justify-center items-center p-6">
                <Image
                  src="/pjlogo.png"
                  alt="Logo PJ"
                  className="h-20 w-auto"
                  width={80}
                  height={80}
                />
              </div>

              {/* Bloc central */}
              <div className="flex flex-col justify-center items-center p-6">
                <Image
                  src="/logopn.png"
                  alt="Logo Police Nationale"
                  className="h-16 w-auto mb-2"
                  width={80}
                  height={80}
                />
                <h2 className="font-bold text-lg">Rapport de synthèse</h2>
                <p className="text-gray-300">Police Judiciaire</p>
                <p className="text-gray-300">---</p>
              </div>

              {/* Texte République Française */}
              <div className="flex flex-col justify-center items-center text-sm leading-5 text-white p-6">
                <p>RÉPUBLIQUE FRANÇAISE MINISTÈRE DE L&apos;INTÉRIEUR</p>
                <p>DIRECTION CENTRALE DE LA POLICE NATIONALE</p>
                <p>PRÉFECTURE DE POLICE DE PARIS</p>
                <p>-------</p>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.id}>
                {/* Header */}
                <div className="flex justify-between items-center bg-[#3b26b1] px-3 py-1 rounded-t-md">
                  <h3 className="font-bold text-sm">{section.title}</h3>
                </div>

                {/* Body */}
                <div className="bg-[#1d1d2f] p-3 rounded-b-md">
                  {section.id === "enqueteurs" ? (
                    <div className="text-white">{section.content}</div>
                  ) : section.id === "compteRendu" ? (
                    <div className="mt-2">
                      {/* Boutons modifier / annuler / enregistrer */}
                      {hasEditPermission && (
                        <div className="flex justify-end mb-2">
                          {!isEditingRichText ? (
                            <button
                              onClick={() => setIsEditingRichText(true)}
                              className="text-gray-400 hover:text-white transition"
                              aria-label="Modifier"
                            >
                              <FaPen className="h-4 w-4" />
                            </button>
                          ) : (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setIsEditingRichText(false)}
                                className="text-gray-400 hover:text-white transition"
                                disabled={saving}
                                aria-label="Annuler"
                              >
                                <FaTimes className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  const form = document.querySelector(
                                    `form[data-section="${section.id}"]`
                                  ) as HTMLFormElement;
                                  if (form) form.requestSubmit();
                                }}
                                className="text-green-400 hover:text-green-300 transition"
                                disabled={saving}
                                aria-label="Enregistrer"
                              >
                                <FaSave className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Contenu */}
                      {isEditingRichText && hasEditPermission ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSaveSection(section.id, {
                              ...(section.initialData || {}),
                              contenu: section.initialData?.contenu || "",
                            });
                            setIsEditingRichText(false);
                          }}
                          data-section={section.id}
                          className="space-y-3"
                        >
                          <RichTextEditor
                            value={section.initialData?.contenu || ""}
                            onChange={(content) => {
                              setSectionsData((prev) => ({
                                ...prev,
                                [section.id]: {
                                  ...section.initialData,
                                  contenu: content,
                                },
                              }));
                            }}
                            readOnly={!isEditingRichText}
                            allowedRoles={allowedRoles}
                          />
                        </form>
                      ) : (
                        <div className="prose prose-invert max-w-none p-3 rounded-md bg-[#0f0f1a]">
                          <div
                            dangerouslySetInnerHTML={{
                              __html:
                                section.initialData?.contenu ||
                                "<p class='text-gray-500'>Aucun contenu saisi</p>",
                            }}
                          />
                        </div>
                      )}

                      <p className="mt-4 text-sm text-gray-400">
                        Fait à Paris le{" "}
                        {new Date(enquete.createdAt).toLocaleDateString(
                          "fr-FR"
                        )}{" "}
                        à{" "}
                        {new Date(enquete.createdAt).toLocaleTimeString(
                          "fr-FR"
                        )}
                      </p>
                    </div>
                  ) : (
                    <EditableSection
                      fields={section.fields || []}
                      initialContent={section.initialData || {}}
                      onSave={(data) => handleSaveSection(section.id, data)}
                      allowedRoles={hasEditPermission ? allowedRoles : []}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Signatures */}
          <div className="mt-6 flex justify-around items-end gap-12">
            <div className="text-center signature-container">
              <p
                className="signature font-signature text-2xl"
                style={{ transform: `rotate(${rotations.dir}deg)` }}
              >
                {enquete.directeur}
              </p>
              <p className="text-sm text-gray-400">Directeur d&apos;enquête</p>
            </div>
            <div className="text-center signature-container">
              <p
                className="signature font-signature text-2xl"
                style={{ transform: `rotate(${rotations.adj}deg)` }}
              >
                {enquete.directeurAdjoint}
              </p>
              <p className="text-sm text-gray-400">
                Directeur Adjoint d&apos;enquête
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="w-full lg:w-80 bg-[#161622] p-4 rounded-xl shadow-lg border border-[#222]">
          <div className="p-4 bg-[#1e1e2e] rounded-lg mb-4">
            <h3 className="font-bold mb-2">Notes</h3>

            <div className="flex gap-2 mb-4">
              {hasEditPermission && (
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !saving && addNote()}
                  placeholder="Ajouter une note..."
                  className={`w-full p-2 rounded bg-[#2a2a3a] text-white border ${
                    saving
                      ? "border-gray-600"
                      : "border-[#3a3a4a] focus:border-indigo-500"
                  } focus:outline-none`}
                  disabled={saving}
                />
              )}
              {hasEditPermission && (
                <button
                  onClick={addNote}
                  disabled={saving}
                  className={`px-4 py-2 rounded transition ${
                    saving
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {saving ? "Enregistrement..." : "Ajouter"}
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {notes.length === 0 ? (
                <p className="text-gray-400 text-sm italic">
                  Aucune note pour le moment
                </p>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 bg-[#2a2a3a] rounded border border-[#3a3a4a] text-sm"
                  >
                    <div className="text-xs text-gray-400 mb-1">
                      {new Date(note.createdAt).toLocaleString()}
                    </div>
                    {renderNoteContent(note.content)}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <Image
            src={lightboxImage}
            className="max-h-full max-w-full rounded shadow-lg"
            alt="Note image"
          />
        </div>
      )}
    </div>
  );
}

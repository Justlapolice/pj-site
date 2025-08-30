"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { FaCheck, FaLink, FaTrash } from "react-icons/fa";
import { EditableSection } from "@/components/editable-section";

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

export default function EnquetePage() {
  const params = useParams();
  const id = params?.id as string;

  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [enquete, setEnquete] = useState<Enquete | null>(null);
  const [loading, setLoading] = useState(true);
  const [rotations, setRotations] = useState({ dir: 0, adj: 0 });
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  interface SectionData {
    [key: string]: string | number | boolean | null | undefined;
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

  // Construit ton numéro d'enquête
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
                <img
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
          } catch (e) {
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
  ) => {
    try {
      const response = await fetch("/api/sections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enqueteId: id,
          sectionId,
          data,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde");
      }

      setSectionsData((prev) => ({
        ...prev,
        [sectionId]: data,
      }));

      return true;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la section:", error);
      return false;
    }
  };

  const sections = [
    {
      id: "enqueteurs",
      title: "ENQUÊTEUR(S)/ENQUÊTRICE(S)",
      fields: [
        { key: "directeur", label: "Directeur", type: "text" },
        { key: "directeurAdjoint", label: "Directeur adjoint", type: "text" },
      ],
      initialData: {
        directeur: enquete.directeur || "",
        directeurAdjoint: enquete.directeurAdjoint || "",
      },
    },
    {
      id: "identite",
      title: "IDENTITÉ DU MIS EN CAUSE",
      fields: [
        { key: "nom", label: "Nom", type: "text" },
        { key: "prenom", label: "Prénom", type: "text" },
        { key: "dateNaissance", label: "Date de naissance", type: "date" },
        { key: "lieuNaissance", label: "Lieu de naissance", type: "text" },
        { key: "adresse", label: "Adresse", type: "text" },
        { key: "profession", label: "Profession", type: "text" },
        { key: "telephone", label: "Numéro de téléphone", type: "text" },
        { key: "groupe", label: "Groupe", type: "text" },
      ],
      initialData: sectionsData["identite"] || {},
    },
    {
      id: "documents",
      title: "DOCUMENTS RELATIFS À L'ENQUÊTE",
      fields: [
        { key: "pvi", label: "PVI", type: "text" },
        { key: "pva", label: "PVA", type: "text" },
        { key: "plainte", label: "Dépôt de plainte", type: "text" },
        { key: "piecesJointes", label: "Pièces jointes", type: "text" },
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
          type: "textarea",
        },
      ],
      initialData: sectionsData["compteRendu"] || {
        date: new Date().toISOString().split("T")[0],
      },
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0f0f1a] text-white p-6 space-y-6">
      {/* Header et statut */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">
          Rapport de synthèse - Enquête n°PJ {id}
          {numeroEnquete}
          <p className="text-lg font-semibold text-gray-400">
            - Objet de l&apos;enquête : {enquete.objet}
          </p>
          <p className="text-lg font-semibold text-gray-400">
            - Chefs Accusations : {enquete.accusations}
          </p>
        </h1>

        <div className="relative">
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
          className="flex items-center gap-2 bg-gray-600 px-3 py-1.5 rounded hover:bg-gray-700 transition"
        >
          <FaLink /> Lien
        </button>

        <button
          onClick={() => handleStatusChange("Annulée")}
          className="flex items-center gap-2 bg-red-600 px-3 py-1.5 rounded hover:bg-red-700 transition"
        >
          <FaTrash /> Annuler
        </button>

        <button
          onClick={() => handleStatusChange("Terminée")}
          className="flex items-center gap-2 bg-green-600 px-3 py-1.5 rounded hover:bg-green-700 transition"
        >
          <FaCheck /> Clôturer
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Bloc Rapport */}
        <div className="flex-1 bg-[#161622] p-6 rounded-xl shadow-lg border border-[#222] space-y-6">
          {/* En-tête du rapport */}
          <div className="border border-[#070995] rounded-md overflow-hidden bg-[#161622]">
            <div className="grid grid-cols-3 divide-x divide-[#070995] items-stretch text-center">
              {/* Logo gauche */}
              <div className="flex justify-center items-center p-6">
                <img src="/pjlogo.png" alt="Logo PJ" className="h-20 w-auto" />
              </div>

              {/* Bloc central */}
              <div className="flex flex-col justify-center items-center p-6">
                <img
                  src="/logopn.png"
                  alt="Logo Police Nationale"
                  className="h-16 w-auto mb-2"
                />
                <h2 className="font-bold text-lg">Rapport de synthèse</h2>
                <p className="text-gray-300">Police Judiciaire</p>
                <p className="text-gray-300">---</p>
              </div>

              {/* Texte République Française */}
              <div className="flex flex-col justify-center items-center text-sm leading-5 text-gray-400 p-6">
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
                  <EditableSection
                    // title={section.title}
                    fields={section.fields}
                    initialContent={section.initialData}
                    onSave={(data) => handleSaveSection(section.id, data)}
                  />
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
          <img
            src={lightboxImage}
            className="max-h-full max-w-full rounded shadow-lg"
            alt="Note image"
          />
        </div>
      )}
    </div>
  );
}

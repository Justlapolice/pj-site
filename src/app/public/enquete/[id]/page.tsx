"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FaLink, FaTrash } from "react-icons/fa";

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
  accusations: string;
  directeur: string;
  directeurAdjoint: string;
  statut: Statut;
  createdAt: string;
  updatedAt: string;
}

interface Note {
  id: number;
  content: string;
  createdAt: string;
}

export default function EnquetePage() {
  const params = useParams();
  const id = params?.id ?? "";

  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [enquete, setEnquete] = useState<Enquete | null>(null);
  const [loading, setLoading] = useState(true);
  const [rotations, setRotations] = useState({ dir: 0, adj: 0 });
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const today = new Date();
  const jour = String(today.getDate()).padStart(2, "0");
  const mois = String(today.getMonth() + 1).padStart(2, "0");
  const annee = today.getFullYear();

  const numeroEnquete = `PN17ARR${annee}${jour}${mois}`;

  const statusColors = {
    Début: "bg-blue-500 hover:bg-blue-600",
    "En cours": "bg-yellow-500 hover:bg-yellow-600",
    Rapport: "bg-purple-500 hover:bg-purple-600",
    Interpellation: "bg-orange-500 hover:bg-orange-600",
    Terminée: "bg-green-500 hover:bg-green-600",
    Annulée: "bg-red-600 hover:bg-red-700",
  };

  const handleStatusChange = async (newStatus: Statut) => {
    if (!enquete) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/enquetes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: newStatus }),
      });
      if (response.ok) setEnquete({ ...enquete, statut: newStatus });
      else console.error("Erreur lors de la mise à jour du statut");
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
        setLoading(true);
        const response = await fetch(`/api/enquetes/${id}`);
        if (response.ok) {
          const data = await response.json();
          setEnquete(data);
        } else {
          console.error("Erreur lors de la récupération de l'enquête");
          setEnquete(null);
        }
      } catch (error) {
        console.error("Erreur:", error);
        setEnquete(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEnquete();
  }, [id]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`/api/noteenquetes?enqueteId=${id}`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      } else {
        console.error("Erreur lors du chargement des notes");
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
          } catch {
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
            Cordialement, l&apos;équipe de la Police Judiciaire
          </p>
        </div>
      </div>
    );
  }

  const sections = [
    {
      title: "ENQUÊTEUR(S)/ENQUÊTRICE(S)",
      content: (
        <>
          Nous soussigné : <b>{enquete.directeur}</b>, Officier de Police
          Judiciaire, en résidence à Paris 75000
          <br />
          Assisté de : <b>{enquete.directeurAdjoint}</b>, Officier de Police
          Judiciaire, en résidence à Paris 75000
        </>
      ),
    },
    {
      title: "IDENTITÉ DU MIS EN CAUSE",
      content: (
        <>
          <p>Nom : </p>
          <p>Prénom : </p>
          <p>Date de naissance : </p>
          <p>Lieu de naissance : </p>
          <p>Adresse : </p>
          <p>Profession : </p>
          <p>Numéro de téléphone : </p>
          <p>Groupe : </p>
        </>
      ),
    },
    {
      title: "DOCUMENTS RELATIFS À L'ENQUÊTE",
      content: (
        <>
          <p>PVI : </p>
          <p>PVA : </p>
          <p>Dépôt de plainte : </p>
          <p>Pièces jointes : </p>
        </>
      ),
    },
    {
      title: "COMPTE-RENDU DE L'ENQUÊTE",
      content: (
        <div className="">
          Fait à Paris le{" "}
          <span className="underline">
            {new Date(enquete.createdAt).toLocaleDateString("fr-FR")}
          </span>{" "}
          à{" "}
          <span className="underline">
            {new Date(enquete.createdAt).toLocaleTimeString("fr-FR")}
          </span>
        </div>
      ),
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

      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            const url = window.location.href;
            navigator.clipboard
              .writeText(url)
              .then(() => alert("Lien copié dans le presse-papier !"))
              .catch((err) => console.error("Erreur lors de la copie :", err));
          }}
          className="flex items-center gap-2 bg-gray-600 px-3 py-1.5 rounded hover:bg-gray-700 transition"
        >
          <FaLink /> Lien
        </button>

        <button
          onClick={() => handleStatusChange("Annulée")}
          className="flex items-center gap-2 bg-red-600 px-3 py-1.5 rounded hover:bg-red-700 transition"
          disabled={saving}
        >
          <FaTrash /> Annuler
        </button>
      </div>

      {/* Sections */}
      {sections.map(({ title, content }) => (
        <section key={title} className="border border-gray-700 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2 border-b border-gray-600 pb-1">
            {title}
          </h2>
          <div className="text-gray-300">{content}</div>
        </section>
      ))}

      {/* Notes */}
      <section className="border border-gray-700 p-4 rounded max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Notes</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Ajouter une note..."
            className="flex-grow px-3 py-2 rounded bg-[#1a1a2e] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={addNote}
            disabled={saving || newNote.trim() === ""}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded disabled:opacity-50 transition"
          >
            Ajouter
          </button>
        </div>

        <ul className="space-y-3 max-h-80 overflow-y-auto">
          {notes.map((note) => (
            <li
              key={note.id}
              className="bg-[#22223b] p-3 rounded border border-gray-600"
            >
              <div className="text-gray-400 text-xs mb-1">
                {new Date(note.createdAt).toLocaleString("fr-FR")}
              </div>
              <div className="break-words">
                {renderNoteContent(note.content)}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <img
            src={lightboxImage}
            alt="Image agrandie"
            className="max-h-full max-w-full"
          />
        </div>
      )}
    </div>
  );
}

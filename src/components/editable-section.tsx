"use client";
import { useState } from "react";
import { FaPen, FaSave, FaTimes } from "react-icons/fa";

interface EditableSectionProps {
  title?: string;
  initialContent: Record<string, string>;
  fields: Array<{
    key: string;
    label: string;
    type?: "text" | "textarea" | "date";
  }>;
  onSave: (data: Record<string, string>) => Promise<void>;
  asButton?: boolean;
  buttonClassName?: string;
}

export function EditableSection({
  title,
  initialContent,
  fields,
  onSave,
  asButton = false,
  buttonClassName = "",
}: EditableSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>(initialContent);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Si c'est un bouton, on affiche juste le bouton d'édition
  if (asButton) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className={`text-gray-400 hover:text-white transition ${buttonClassName}`}
        aria-label="Modifier"
      >
        <FaPen className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="mb-8 bg-[#1a1a2e] p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-indigo-400">{title}</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-white transition"
            aria-label="Modifier"
          >
            <FaPen className="h-4 w-4" />
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-400 hover:text-white transition"
              disabled={isSaving}
              aria-label="Annuler"
            >
              <FaTimes className="h-4 w-4" />
            </button>
            <button
              onClick={handleSubmit}
              className="text-green-400 hover:text-green-300 transition"
              disabled={isSaving}
              aria-label="Enregistrer"
            >
              <FaSave className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {field.label} :
              </label>
              {field.type === "textarea" ? (
                <textarea
                  value={formData[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full bg-[#0f0f1a] text-white border border-gray-700 rounded p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={4}
                />
              ) : (
                <input
                  type={field.type || "text"}
                  value={formData[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full bg-[#0f0f1a] text-white border border-gray-700 rounded p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              )}
            </div>
          ))}
        </form>
      ) : (
        <div className="space-y-2">
          {fields.map((field) => (
            <p key={field.key}>
              <span className="font-medium">{field.label}</span> :{" "}
              {formData[field.key] || "Non renseigné"}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

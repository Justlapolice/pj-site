"use client";

import { useState } from "react";
import { FaPen, FaSave, FaTimes } from "react-icons/fa";
import { useSession } from "next-auth/react";

interface EditableSectionProps {
  initialContent: Record<string, string>;
  fields: Array<{
    key: string;
    label: string;
    type?: "text" | "textarea" | "date" | "link" | "richtext";
  }>;
  onSave: (data: Record<string, string>) => Promise<void>;
  asButton?: boolean;
  buttonClassName?: string;
  allowedRoles?: string[];
}

interface User {
  guildNickname?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  roles?: string[];
}

export function EditableSection({
  initialContent,
  fields,
  onSave,
  asButton = false,
  buttonClassName = "",
}: EditableSectionProps) {
  const { data: session } = useSession();
  const user = session?.user as User | undefined;

  const allowedRoles = ["1117516088196997181", "1358837249751384291"];
  const usernameBypass = "justforever974";
  const hasEditPermission =
    user?.roles?.some((role) => allowedRoles.includes(role)) ||
    session?.user?.name === usernameBypass;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] =
    useState<Record<string, string>>(initialContent);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
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

  if (asButton && !hasEditPermission) return null;

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
    <div>
      {/* Actions (éditer / annuler / sauvegarder) */}
      {hasEditPermission && (
        <div className="flex justify-end mb-2">
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
      )}

      {/* Contenu */}
      {isEditing && hasEditPermission ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {field.label} :
              </label>

              {field.type === "link" ? (
                <input
                  type="url"
                  value={formData[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full bg-[#0f0f1a] text-white border border-gray-700 rounded p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="https://"
                />
              ) : field.type === "textarea" ? (
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
        <div className="space-y-1">
          {fields.map((field) => (
            <div key={field.key}>
              {field.type === "link" && formData[field.key] ? (
                <div>
                  <span className="font-medium">{field.label}</span> :{" "}
                  <a
                    href={formData[field.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline inline-block"
                  >
                    [{field.label.toUpperCase()}]
                  </a>
                </div>
              ) : field.type === "link" ? (
                <div>
                  <span className="font-medium">{field.label}</span> :{" "}
                  <span className="text-gray-500">
                    [{field.label.toUpperCase()}]
                  </span>
                </div>
              ) : (
                <p>
                  <span className="font-medium">{field.label}</span> :{" "}
                  {formData[field.key] || "Non renseigné"}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import MenuBar from "./MenuBar";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "../../components/ui/use-toast";

interface BlocNoteProps {
  roles: string[];
}

export default function BlocNote({ roles }: BlocNoteProps) {
  const [initialContent, setInitialContent] = useState("<p>Chargement...</p>");
  const [isEditing, setIsEditing] = useState(false);

  const { data: session } = useSession();

  const allowedRoles = ["1117516088196997181", "1358837249751384291"];
  const usernameBypass = "justforever974";

  const canEdit =
    roles.some((role) => allowedRoles.includes(role)) ||
    session?.user?.name === usernameBypass;

  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color],
    content: initialContent,
    onUpdate: ({ editor }) => saveNote(editor.getHTML()),
    immediatelyRender: false,
  });

  useEffect(() => {
    const fetchNote = async () => {
      const res = await fetch("/api/note");
      if (res.ok) {
        const data = await res.json();
        const content = data.content || "<p></p>";
        setInitialContent(content);
        editor?.commands.setContent(content);
      }
    };
    fetchNote();
  }, [editor]);

  const saveNote = async (content: string) => {
    if (!canEdit) return;
    try {
      await fetch("/api/note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
    } catch (err) {
      console.error("Erreur sauvegarde note:", err);
    }
  };

  if (!editor) return <p>Chargement de l’éditeur…</p>;

  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 shadow-lg">
      <AnimatePresence>
        {!isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <div
              className="bg-gray-800 text-gray-200 p-4 min-h-[200px] rounded-md overflow-auto"
              dangerouslySetInnerHTML={{ __html: initialContent }}
            />
            {canEdit && (
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded shadow transition"
              >
                Modifier
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditing && canEdit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-2"
          >
            <MenuBar editor={editor} />
            <EditorContent
              editor={editor}
              className="bg-white text-black p-3 min-h-[200px] rounded-md shadow-inner focus:outline-none"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => {
                  setInitialContent(editor.getHTML());
                  setIsEditing(false);
                  toast({
                    variant: "success",
                    title: "Note modifiée avec succès",
                  });
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded shadow transition"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

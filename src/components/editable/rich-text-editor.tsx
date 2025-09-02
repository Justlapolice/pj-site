"use client";

import { useEditor, EditorContent, Editor as EditorType } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

interface User {
  guildNickname?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  roles?: string[];
}

export function RichTextEditor({
  value,
  onChange,
  readOnly = false,
  className = "",
}: {
  value: string;
  onChange: (content: string) => void;
  readOnly?: boolean;
  className?: string;
  allowedRoles?: string[];
}) {
  const { data: session } = useSession();
  const user = session?.user as User | undefined;
  const allowedRoles = ["1117516088196997181", "1358837249751384291"];
  const usernameBypass = "justforever974";
  const hasEditPermission =
    user?.roles?.some((role) => allowedRoles.includes(role)) ||
    session?.user?.name === usernameBypass;

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Image,
      Link.configure({
        autolink: true,
        linkOnPaste: true,
        openOnClick: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !readOnly,
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return <div>Chargement de l&apos;éditeur...</div>;

  return (
    <div className={`rich-text-editor ${className}`}>
      {hasEditPermission && <MenuBar editor={editor} />}
      <EditorContent
        editor={editor}
        className={`prose prose-invert max-w-none p-3 rounded-md ${
          hasEditPermission
            ? "bg-[#0f0f1a] border border-gray-700"
            : "bg-transparent"
        } ${className}
          prose-a:text-blue-500 prose-a:underline hover:prose-a:text-blue-400
          prose-p:!text-inherit prose-span:!text-inherit prose-strong:!text-inherit prose-em:!text-inherit`}
        readOnly={!hasEditPermission}
      />
    </div>
  );
}

function MenuBar({ editor }: { editor: EditorType | null }) {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Entrez l'URL de l'image");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-[#1e1e2d] rounded-t-md border border-gray-700 border-b-0">
      {/* Gras */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          editor.chain().focus().toggleBold().run();
        }}
        className={`p-1 rounded ${
          editor.isActive("bold")
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-700"
        }`}
        title="Gras (Ctrl+B)"
      >
        <strong>B</strong>
      </button>

      {/* Italique */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          editor.chain().focus().toggleItalic().run();
        }}
        className={`p-1 rounded ${
          editor.isActive("italic")
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-700"
        }`}
        title="Italique (Ctrl+I)"
      >
        <em>I</em>
      </button>

      {/* Souligné */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          editor.chain().focus().toggleUnderline().run();
        }}
        className={`p-1 rounded ${
          editor.isActive("underline")
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-700"
        }`}
        title="Souligné (Ctrl+U)"
      >
        <u>U</u>
      </button>

      <div className="border-l border-gray-600 mx-1"></div>

      {/* Titre */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
        className={`p-1 rounded ${
          editor.isActive("heading", { level: 2 })
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-700"
        }`}
        title="Titre"
      >
        T
      </button>

      <div className="border-l border-gray-600 mx-1"></div>

      {/* Liste à puces */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          editor.chain().focus().toggleBulletList().run();
        }}
        className={`p-1 rounded ${
          editor.isActive("bulletList")
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-700"
        }`}
        title="Liste à puces"
      >
        •
      </button>

      {/* Liste numérotée */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          editor.chain().focus().toggleOrderedList().run();
        }}
        className={`p-1 rounded ${
          editor.isActive("orderedList")
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-700"
        }`}
        title="Liste numérotée"
      >
        1.
      </button>

      <div className="border-l border-gray-600 mx-1"></div>

      {/* Palette de couleur */}
      {/* Palette de couleur */}
      <input
        type="color"
        onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
          editor.chain().focus().setColor(event.target.value).run();
        }}
        value="#ffffff"
        className="w-6 h-6 bg-transparent border-0 cursor-pointer"
        title="Couleur du texte"
      />

      <div className="border-l border-gray-600 mx-1"></div>

      {/* Insérer une image */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          addImage();
        }}
        className="p-1 rounded text-gray-300 hover:bg-gray-700"
        title="Insérer une image"
      >
        🖼️
      </button>

      {/* Ajouter un lien */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const url = window.prompt("Entrez l'URL du lien");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className="p-1 rounded text-gray-300 hover:bg-gray-700"
        title="Ajouter un lien"
      >
        🔗
      </button>
    </div>
  );
}

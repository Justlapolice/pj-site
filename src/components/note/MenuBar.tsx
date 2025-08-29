"use client";

import { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { toast } from "../../components/ui/use-toast";

export default function MenuBar({ editor }: { editor: Editor | null }) {
  const [color, setColor] = useState("#000000");
  const [fontSize, setFontSize] = useState("16px");

  if (!editor) return null;

  useEffect(() => {
    const updateUI = () => {
      const attrs = editor.getAttributes("textStyle");
      if (attrs.color) setColor(attrs.color);
      if (attrs.fontSize) setFontSize(attrs.fontSize);
    };

    editor.on("selectionUpdate", updateUI);
    editor.on("transaction", updateUI);
    return () => {
      editor.off("selectionUpdate", updateUI);
      editor.off("transaction", updateUI);
    };
  }, [editor]);
  const applyStyle = (newAttrs: { color?: string; fontSize?: string }) => {
    editor
      .chain()
      .focus()
      .extendMarkRange("textStyle")
      .setMark("textStyle", newAttrs)
      .run();

    if (newAttrs.color) setColor(newAttrs.color);
    if (newAttrs.fontSize) setFontSize(newAttrs.fontSize);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-2 bg-gray-800 p-2 rounded-md shadow-inner items-center">
      {["bold", "italic", "underline", "strike"].map((mark) => (
        <button
          key={mark}
          onClick={() =>
            editor
              .chain()
              .focus()
              [`toggle${mark[0].toUpperCase() + mark.slice(1)}`]()
              .run()
          }
          className={`px-2 py-1 rounded transition ${
            editor.isActive(mark)
              ? "bg-blue-500 text-white"
              : "bg-gray-700 text-gray-200"
          }`}
        >
          {mark[0].toUpperCase()}
        </button>
      ))}

      <input
        type="color"
        value={color}
        onChange={(e) => applyStyle({ color: e.target.value })}
        className="w-8 h-8 p-0 border-none rounded cursor-pointer"
        style={{ backgroundColor: color }}
      />

      <select
        value={fontSize}
        onChange={(e) => applyStyle({ fontSize: e.target.value })}
        className="px-2 py-1 rounded bg-gray-700 text-gray-200"
      >
        {["12px", "14px", "16px", "18px", "24px", "32px"].map((size) => (
          <option key={size} value={size}>
            {size.replace("px", "")}
          </option>
        ))}
      </select>

      <button
        onClick={() => {
          applyStyle({ color, fontSize });
          toast({
            variant: "success",
            title: "Style appliqué avec succès",
          });
        }}
        className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600 transition"
      >
        Appliquer à tout
      </button>
    </div>
  );
}

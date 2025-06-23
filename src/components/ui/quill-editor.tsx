"use client";

import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface QuillEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function QuillEditor({ value, onChange }: QuillEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const isUserTyping = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            ['link', 'image', 'video'],
             
          ],
        },
        placeholder: "Enter your content here...",
      });

      if (value) {
        quillRef.current.root.innerHTML = value;
      }

      quillRef.current.on("text-change", () => {
        isUserTyping.current = true;
        const content = quillRef.current?.root.innerHTML || "";
        onChange(content);
        isUserTyping.current = false;
      });
    }

    return () => {
      if (quillRef.current) {
        quillRef.current.off("text-change");
        quillRef.current = null;
      }
    };
  });

  useEffect(() => {
    if (quillRef.current && !isUserTyping.current) {
      const currentContent = quillRef.current.root.innerHTML;
      if (currentContent !== value) {
        quillRef.current.root.innerHTML = value;
      }
    }
  }, [value]);

  return <div ref={editorRef} style={{ height: "250px" }} />;
}

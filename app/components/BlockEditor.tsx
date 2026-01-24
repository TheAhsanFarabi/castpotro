"use client";

import { useEffect, useState, useMemo } from "react";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import { Loader2 } from "lucide-react";

interface BlockEditorProps {
  initialContent?: string; // JSON string or Plain Text
  editable?: boolean;
  onChange?: (content: string) => void;
}

export default function BlockEditor({ 
  initialContent, 
  editable = true, 
  onChange 
}: BlockEditorProps) {
  const [mounted, setMounted] = useState(false);

  // 1. SAFELY PARSE CONTENT
  const initialBlocks = useMemo(() => {
    if (!initialContent) return undefined;
    
    try {
      // Try to parse as JSON (New Format)
      return JSON.parse(initialContent) as PartialBlock[];
    } catch (e) {
      // If parsing fails, it's Plain Text (Old Format).
      // Convert it into a single paragraph block so we don't lose data.
      return [
        {
          type: "paragraph",
          content: initialContent // BlockNote handles string as simple text content
        }
      ] as PartialBlock[];
    }
  }, [initialContent]);

  const editor = useCreateBlockNote({
    initialContent: initialBlocks,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 text-slate-400 p-4 bg-slate-50 rounded-lg">
        <Loader2 className="animate-spin" size={16} /> Loading Editor...
      </div>
    );
  }

  return (
    <div className={`notion-wrapper ${!editable ? "readonly-mode" : ""} -ml-4`}>
      <BlockNoteView 
        editor={editor} 
        editable={editable}
        theme="light"
        onChange={() => {
           if (onChange) {
             onChange(JSON.stringify(editor.document));
           }
        }}
      />
      
      <style jsx global>{`
        .notion-wrapper .bn-editor {
          background: transparent;
        }
        .readonly-mode .bn-editor {
           pointer-events: none;
        }
        /* Hide the slash menu hint in read-only mode if needed */
        .readonly-mode .bn-block-content[data-is-empty-and-focused] {
           display: none;
        }
      `}</style>
    </div>
  );
}
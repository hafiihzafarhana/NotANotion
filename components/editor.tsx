"use client";
import React, { useMemo } from "react";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";
import { Theme } from "emoji-picker-react";
import { useEdgeStore } from "@/lib/edgestore";

interface EditorInterface {
  onChange: (value: string) => void;
  initialContent?: string; // JSON string
  editable?: boolean;
}

const Editor = ({
  onChange,
  initialContent,
  editable = true,
}: EditorInterface) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();
  const parsedInitialContent = useMemo(() => {
    if (!initialContent) return undefined;
    try {
      return JSON.parse(initialContent);
    } catch (err) {
      console.error("Invalid initialContent JSON:", err);
      return undefined;
    }
  }, [initialContent]);

  const handleUpload = async (file: File): Promise<string> => {
    const res = await edgestore.publicFiles.upload({ file });
    return res.url;
  };

  const editor = useCreateBlockNote({
    initialContent: parsedInitialContent,
    animations: true,
    // autofocus: true,
    uploadFile: handleUpload,
  });

  return (
    <BlockNoteView
      editor={editor}
      theme={resolvedTheme === "dark" ? Theme.DARK : Theme.LIGHT}
      editable={editable}
      onChange={() => {
        const blocks = editor.topLevelBlocks ?? editor.document;
        onChange(JSON.stringify(blocks, null, 2));
      }}
    />
  );
};

export default Editor;

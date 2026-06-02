import { useState } from "react";
import type { Editor } from "@tiptap/core";

const useEditorStore = () => {
  const [editor, setEditor] = useState<Editor | null>(null);

  return {
    editor,
    setEditor,
  };
};

export { useEditorStore };
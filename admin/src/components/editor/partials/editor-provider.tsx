"use client";

import { createContext, useContext } from "react";

import type { Editor } from "@tiptap/react";

export interface EditorContextProps {
  editor: Editor;
}

export const EditorContext = createContext<EditorContextProps | null>(null);

interface EditorProviderProps {
  editor: Editor;
  children: React.ReactNode;
}

export const EditorProvider = ({ editor, children }: EditorProviderProps) => {
  return (
    <EditorContext.Provider value={{ editor }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = () => {
  const context = useContext(EditorContext);

  if (!context) {
    throw new Error("useEditorContext must be used within a EditorProvider");
  }

  return context;
};

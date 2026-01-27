import { createContext, useContext, useState } from "react";

import type { Editor } from "@tiptap/react";

export interface EditorContextProps {
  editor: Editor;
  isCodeModalOpen: boolean;
  setIsCodeModalOpen: (isOpen: boolean) => void;
}

export const EditorContext = createContext<EditorContextProps | null>(null);

interface EditorProviderProps {
  editor: Editor;
  children: React.ReactNode;
}

export const EditorProvider = ({ editor, children }: EditorProviderProps) => {
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  return (
    <EditorContext.Provider value={{ editor, isCodeModalOpen, setIsCodeModalOpen }}>
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

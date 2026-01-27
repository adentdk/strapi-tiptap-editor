import { createContext, useContext, useState } from "react";

import type { Editor } from "@tiptap/react";

export interface EditorContextProps {
  editor: Editor;
  isCodeMode: boolean;
  setIsCodeMode: (isCodeMode: boolean) => void;
}

export const EditorContext = createContext<EditorContextProps | null>(null);

interface EditorProviderProps {
  editor: Editor;
  children: React.ReactNode;
}

export const EditorProvider = ({ editor, children }: EditorProviderProps) => {
  const [isCodeMode, setIsCodeMode] = useState(false);

  return (
    <EditorContext.Provider value={{ editor, isCodeMode, setIsCodeMode }}>
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

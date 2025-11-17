import { createContext, useContext, useState, useCallback } from "react";
import { Editor } from "@tiptap/core";
import { CustomComponentAttributes } from "./types";

interface EditState {
  isOpen: boolean;
  editor: Editor | null;
  pos: number | null;
  attrs: CustomComponentAttributes | null;
  provider: string | null;
  contextName: string | null;
}

interface EditContextValue extends EditState {
  open: (
    editor: Editor,
    pos: number,
    attrs: CustomComponentAttributes,
    provider?: string,
    contextName?: string
  ) => void;
  close: () => void;
  update: (newAttrs: Partial<CustomComponentAttributes>) => void;
}

const CustomComponentContext = createContext<EditContextValue | undefined>(undefined);

export const CustomComponentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<EditState>({
    isOpen: false,
    editor: null,
    pos: null,
    attrs: null,
    provider: null,
    contextName: null,
  });

  const open = useCallback(
    (
      editor: Editor,
      pos: number,
      attrs: CustomComponentAttributes,
      provider?: string,
      contextName?: string
    ) => {
      editor.commands.setNodeSelection(pos);

      setState({
        isOpen: true,
        editor,
        pos,
        attrs,
        provider: provider ?? null,
        contextName: contextName ?? null,
      });
    },
    []
  );

  const close = useCallback(() => {
    setState((s) => ({
      ...s,
      isOpen: false,
      editor: null,
      pos: null,
      attrs: null,
      provider: null,
      contextName: null,
    }));
  }, []);

  const update = useCallback((newAttrs: Partial<CustomComponentAttributes>) => {
    setState((s) => {
      if (s.editor && s.pos !== null && s.attrs) {
        s.editor
          .chain()
          .focus()
          .updateAttributes("customComponent", {
            ...s.attrs,
            ...newAttrs,
          })
          .setNodeSelection(s.pos)
          .run();
      }
      return {
        ...s,
        isOpen: false,
        editor: null,
        pos: null,
        attrs: null,
      };
    });
  }, []);

  return (
    <CustomComponentContext.Provider
      value={{
        ...state,
        open,
        close,
        update,
      }}
    >
      {children}
    </CustomComponentContext.Provider>
  );
};

export const useCustomComponentEdit = () => {
  const context = useContext(CustomComponentContext);
  if (!context)
    throw new Error("useCustomComponentEdit must be used inside <CustomComponentProvider>");
  return context;
};

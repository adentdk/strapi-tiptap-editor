// src/tiptap/extensions/custom-component/store.ts
import { create } from 'zustand';
import { Editor } from '@tiptap/core';
import { CustomComponentAttributes } from './types';

interface EditStore {
  isOpen: boolean;
  editor: Editor | null;
  pos: number | null;
  attrs: CustomComponentAttributes | null;
  open: (editor: Editor, pos: number, attrs: CustomComponentAttributes) => void;
  close: () => void;
  update: (newAttrs: Partial<CustomComponentAttributes>) => void;
}

export const useCustomComponentEdit = create<EditStore>((set, get) => ({
  isOpen: false,
  editor: null,
  pos: null,
  attrs: null,
  open: (editor, pos, attrs) => {
    editor.commands.setNodeSelection(pos);
    set({ isOpen: true, editor, pos, attrs });
  },
  close: () => set({ isOpen: false, editor: null, pos: null, attrs: null }),
  update: (newAttrs) => {
    const state = get();
    if (state.editor && state.pos !== null && state.attrs) {
      state.editor
        .chain()
        .focus()
        .updateAttributes('customComponent', { ...state.attrs, ...newAttrs })
        .setNodeSelection(state.pos)
        .run();
      get().close();
    }
  },
}));
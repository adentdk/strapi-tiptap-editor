import { useRef } from "react";

import { type Editor } from "@tiptap/core";

import {
  ToolbarButtons,
  type ToolbarButtonsType,
} from "./partials/toolbar-buttons";
import { BaseEditor, type BaseEditorProps } from "./_base-editor";

export type SimpleEditorProps = BaseEditorProps & {
  toolbars?: ToolbarButtonsType[];
};

function SimpleEditor({ toolbars, ...restProps }: SimpleEditorProps) {
  const editorRef = useRef<Editor | null>(null);

  return (
    <BaseEditor
      ref={editorRef}
      toolbar={<ToolbarButtons toolbars={toolbars} />}
      {...restProps}
    />
  );
}

SimpleEditor.displayName = "SimpleEditor";

export { SimpleEditor };

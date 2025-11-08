import { useRef } from "react";

import { type Editor } from "@tiptap/core";

import { NoNewLine } from "./extensions/no-new-line";
import { BaseEditor, type BaseEditorProps } from "./_base-editor";

export type InlineEditorProps = Omit<BaseEditorProps, "toolbar">;


function InlineEditor({ extensions = [], ...props }: InlineEditorProps) {
  const editorRef = useRef<Editor | null>(null);

  return (
    <BaseEditor
      extensions={[NoNewLine, ...extensions]}
      ref={editorRef}
      {...props}
    />
  );
}

InlineEditor.displayName = "InlineEditor";

export { InlineEditor };

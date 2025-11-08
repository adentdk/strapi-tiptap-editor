import { useCallback } from "react";

import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import Bulletlist from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import History from "@tiptap/extension-history";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Italic from "@tiptap/extension-italic";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import {
  type Content,
  type Editor,
  type Extensions,
  useEditor as useEditorPrimitive,
  type UseEditorOptions as UseEditorPrimitiveOptions,
} from "@tiptap/react";
import { useDebounceCallback } from "usehooks-ts";

import { cn } from "@/lib/utils/classnames";

import { ResetMarksOnEnter } from "./extensions/reset-marks-on-enter";

export interface UseEditorOptions
  extends Omit<UseEditorPrimitiveOptions, "onUpdate" | "onBlur"> {
  value?: Content;
  placeholder?: string;
  throttleDelay?: number;
  output?: "html" | "json" | "text";
  onUpdate?: (value: Content) => void;
  onBlur?: (content: Content) => void;
}

const createExtensions = (
  options: Pick<UseEditorOptions, "placeholder">,
): Extensions => [
  Document,
  Blockquote,
  Bulletlist,
  OrderedList,
  ListItem,
  CodeBlock,
  HardBreak,
  Heading.configure({
    levels: [1, 2, 3, 4],
  }),
  Paragraph,
  HorizontalRule,
  Text,
  Bold,
  Code,
  Italic,
  Strike,
  Dropcursor,
  Gapcursor,
  History.configure({
    depth: 50,
  }),
  ResetMarksOnEnter,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  TextStyle,
  Placeholder.configure({
    placeholder: options.placeholder,
  }),
];

const getOutput = (
  editor: Editor,
  output: UseEditorOptions["output"],
): Content => {
  if (output === "html") {
    return editor.getHTML();
  }

  if (output === "json") {
    return editor.getJSON();
  }

  return editor.getText();
};

export const useEditor = ({
  content,
  extensions = [],
  editorProps: { attributes: editorAttributes = {}, ...editorProps } = {},
  placeholder = "Write something...",
  throttleDelay = 0,
  output,
  onUpdate,
  onCreate,
  onBlur,
  value,
  ...options
}: UseEditorOptions) => {
  const throttledSetValue = useDebounceCallback((v: Content) => {
    onUpdate?.(v);
  }, throttleDelay);

  const handleUpdate = useCallback(
    (editor: Editor) => {
      return throttledSetValue(getOutput(editor, output));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [output],
  );

  const handleCreate = useCallback(
    (editor: Editor) => {
      if (value && editor.isEmpty) {
        editor.commands.setContent(value);
      }
    },
    [value],
  );

  const handleBlur = useCallback(
    (editor: Editor) => onBlur?.(getOutput(editor, output)),
    [output, onBlur],
  );

  const editor = useEditorPrimitive({
    extensions: [...extensions, ...createExtensions({ placeholder })].filter(
      (ext, index, self) =>
        self.findIndex((e) => e.name === ext.name) === index,
    ),
    content,
    immediatelyRender: false,
    editorProps: {
      ...editorProps,
      attributes: {
        ...editorAttributes,
        class: cn("prose focus:outline-none", (editorAttributes as any).class),
      },
    },
    onUpdate: ({ editor }) => handleUpdate(editor),
    onBlur: ({ editor }) => handleBlur(editor),
    onCreate: ({ editor }) => handleCreate(editor),
    ...options,
  });

  return editor;
};

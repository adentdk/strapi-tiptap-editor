import { useRef } from "react";

import { type Editor } from "@tiptap/core";
import Color from "@tiptap/extension-color";
import Gapcursor from "@tiptap/extension-gapcursor";
import Highlight from "@tiptap/extension-highlight";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";

import { FileHandler } from "./extensions/file-handler";
import { Iframe } from "./extensions/iframe";
import { ImageExtension } from "./extensions/image";
import { ImagePlaceholder } from "./extensions/image-placeholder";
import { Link } from "./extensions/link";
import { SearchAndReplace } from "./extensions/search-and-replace";
import {
  ToolbarButtons,
  type ToolbarButtonsType,
} from "./partials/toolbar-buttons";
import { BaseEditor, type BaseEditorProps } from "./_base-editor";

import '@/src/styles.css'

export type FullEditorProps = BaseEditorProps & {
  toolbars?: ToolbarButtonsType[];
};

function FullEditor({
  toolbars = [
    "UndoToolbar",
    "RedoToolbar",
    "Separator",
    "HeadingTooolbar",
    "ColorAndHighlightToolbar",
    "BoldToolbar",
    "ItalicToolbar",
    "AlignmentToolbar",
    "CodeBlockToolbar",
    "CodeToolbar",
    "BulletListToolbar",
    "OrderedListToolbar",
    "Separator",
    "HardBreakToolbar",
    "HorizontalRuleToolbar",
    "LinkToolbar",
    "Separator",
    "ImagePlaceholderToolbar",
    "SearchAndReplaceToolbar",
  ],
  extensions = [],
  ...restProps
}: FullEditorProps) {
  const editorRef = useRef<Editor | null>(null);

  return (
    <BaseEditor
      ref={editorRef}
      extensions={[
        ...extensions,
        Link,
        SearchAndReplace,
        ImagePlaceholder,
        ImageExtension,
        FileHandler,
        Iframe,
        Color,
        Gapcursor,
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
        Highlight.configure({
          multicolor: true,
        }),
      ]}
      toolbar={<ToolbarButtons toolbars={toolbars} />}
      {...restProps}
    />
  );
}

FullEditor.displayName = "FullEditor";

export { FullEditor };

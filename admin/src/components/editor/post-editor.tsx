import { useRef } from "react";

import { type Editor } from "@tiptap/core";
import Color from "@tiptap/extension-color";
import Document from "@tiptap/extension-document";
import Gapcursor from "@tiptap/extension-gapcursor";
import Heading, { Level } from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import { textblockTypeInputRule } from "@tiptap/react";
import '@/src/styles.css'
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

export type PostEditorProps = BaseEditorProps & {
  toolbars?: ToolbarButtonsType[];
};

function PostEditor({
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
}: PostEditorProps) {
  const editorRef = useRef<Editor | null>(null);

  const adjustLevel = (level: Level) => (+level === 1 ? 2 : level);

  return (
    <BaseEditor
      ref={editorRef}
      extensions={[
        ...extensions,
        Document.extend({
          content: "title block+",
        }),
        Heading.extend({
          name: "title",
          group: "title",
          parseHTML: () => [{ tag: "h1:first-child" }],
        }).configure({ levels: [1] }),
        Placeholder.configure({
          showOnlyCurrent: false,
          placeholder: ({ node }) => {
            if (node.type.name === "title") {
              return "What's the title?";
            }

            return "What's the story?";
          },
        }),
        Heading.extend({
          // this code was copied from the Heading extension
          // and modified to turn all `h1`s into `h2`s
          parseHTML() {
            return this.options.levels.map((level: Level) => ({
              tag: `h${level}`,
              attrs: { level: adjustLevel(level) },
            }));
          },
          addKeyboardShortcuts() {
            return this.options.levels.reduce(
              (items: any, level: Level) => ({
                ...items,
                ...{
                  [`Mod-Alt-${level}`]: () =>
                    this.editor.commands.toggleHeading({
                      level: adjustLevel(level),
                    }),
                },
              }),
              {},
            );
          },
          addInputRules() {
            return this.options.levels.map((level: Level) => {
              return textblockTypeInputRule({
                find: new RegExp(`^(#{1,${level}})\\s$`),
                type: this.type,
                getAttributes: {
                  level: adjustLevel(level),
                },
              });
            });
          },
        }).configure({
          levels: [2, 3, 4],
        }),
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

PostEditor.displayName = "PostEditor";

export { PostEditor };

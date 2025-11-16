// src/tiptap/toolbar/HTMLToolbar.tsx
import { forwardRef, useState } from "react";
import { Code2 } from "lucide-react";
import { useEditorContext } from "../partials/editor-provider";
import ToolbarButton, { type ToolbarButtonProps } from "../partials/toolbar-button";
import styled from "styled-components";
import { Dialog, Textarea } from "@strapi/design-system";
import { generateHTML, generateJSON } from '@tiptap/html';
import { Link } from "../extensions/link";
import { CustomComponent } from "../extensions/custom-component/custom-component-extension";
import { SearchAndReplace } from "../extensions/search-and-replace";
import { ImagePlaceholder } from "../extensions/image-placeholder";
import { ImageExtension } from "../extensions/image";
import { FileHandler } from "../extensions/file-handler";
import { Iframe } from "../extensions/iframe";
import Color from "@tiptap/extension-color";
import Gapcursor from "@tiptap/extension-gapcursor";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Highlight from "@tiptap/extension-highlight";
import { createExtensions } from "../use-editor";

const CodeIcon = styled(Code2)`
  width: 16px;
  height: 16px;
`;

const DialogContent = styled(Dialog.Content)`
  max-width: 90%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
`;

const MonoTextarea = styled(Textarea)`
  font-family: monospace;
  font-size: 12px;
  height: 100%;
  resize: none;
  min-height: 400px;
  flex: 1;
`;

const HTMLToolbar = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useEditorContext();
    const [html, setHtml] = useState("");

    const extensions = [...createExtensions({}), Link,
      CustomComponent,
      SearchAndReplace,
      ImagePlaceholder,
      ImageExtension,
      FileHandler,
      Iframe,
      Color,
    Table.configure({
      resizable: true,
    }),
      TableRow,
      TableHeader,
      TableCell,
    Highlight.configure({
      multicolor: true,
    }),]

    // JSON → HTML
    const jsonToHTML = (json: any) => {
      return generateHTML(json, extensions);
    };

    // HTML → JSON
    const htmlToJSON = (html: string) => {
      return generateJSON(html, extensions);
    };

    const handleOpen = () => {
      if (editor) {
        const json = editor.getJSON();
        const htmlOutput = jsonToHTML(json);
        setHtml(htmlOutput);
      }
    };

    const handleApply = () => {
      if (editor && html.trim()) {
        try {
          const json = htmlToJSON(html);
          editor.commands.setContent(json, false);
        } catch (err) {
          console.error("Invalid HTML:", err);
          alert("HTML tidak valid. Pastikan format benar.");
        }
      }
    };

    return (
      <Dialog.Root
        onOpenChange={(open) => {
          if (open) {
            handleOpen();
          } else {
            setHtml("");
          }
        }}
      >
        <Dialog.Trigger>
          <ToolbarButton
            tooltip="View/Edit HTML"
            aria-label="View and edit HTML source"
            isActive={false}
            disabled={!editor}
            ref={ref}
            {...props}
            onClick={(e) => {
              onClick?.(e);
            }}
          >
            {children || <CodeIcon />}
          </ToolbarButton>
        </Dialog.Trigger>

        <DialogContent>
          <Dialog.Header>
            <h1>Edit HTML Source</h1>
            <Dialog.Description>
              Edit HTML secara langsung. Hati-hati: format salah bisa merusak konten.
            </Dialog.Description>
          </Dialog.Header>

          <MonoTextarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="<p>Hello world</p>..."
          />

          <Dialog.Footer>
            <Dialog.Action>Cancel</Dialog.Action>
            <Dialog.Action onClick={handleApply}>Apply HTML</Dialog.Action>
          </Dialog.Footer>
        </DialogContent>
      </Dialog.Root>
    );
  }
);

HTMLToolbar.displayName = "HTMLToolbar";

export { HTMLToolbar };
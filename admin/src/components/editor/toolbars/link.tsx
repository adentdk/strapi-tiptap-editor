import { forwardRef, useCallback, useState } from "react";

import { Link2 } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useEditorContext } from "../partials/editor-provider";
import { LinkEditBlock } from "../partials/link-edit-block";
import ToolbarButton, { ToolbarButtonProps } from "../partials/toolbar-button";

const LinkToolbar = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useEditorContext();
    const [open, setOpen] = useState(false);

    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, " ");

    const onSetLink = useCallback(
      (url: string, text?: string, openInNewTab?: boolean) => {
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .insertContent({
            type: "text",
            text: text || url,
            marks: [
              {
                type: "link",
                attrs: {
                  href: url,
                  target: openInNewTab ? "_blank" : "",
                },
              },
            ],
          })
          .setLink({ href: url })
          .run();

        editor.commands.enter();
      },
      [editor],
    );

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <ToolbarButton
            isActive={editor.isActive("link")}
            tooltip="Link"
            aria-label="Insert link"
            disabled={editor.isActive("codeBlock")}
            {...props}
          >
            <Link2 className="size-5" />
          </ToolbarButton>
        </PopoverTrigger>
        <PopoverContent className="w-full min-w-80" align="end" side="bottom">
          <LinkEditBlock onSave={onSetLink} defaultText={text} />
        </PopoverContent>
      </Popover>
    );
  },
);

export { LinkToolbar };

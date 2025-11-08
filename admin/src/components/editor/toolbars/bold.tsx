import { forwardRef, Fragment } from "react";

import type { Extension } from "@tiptap/core";
import { BoldIcon } from "lucide-react";

import { useEditorContext } from "@/src/components/editor/partials/editor-provider";

import ToolbarButton, { ToolbarButtonProps } from "../partials/toolbar-button";

const BoldToolbar = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useEditorContext();
    return (
      <ToolbarButton
        tooltip={
          <Fragment>
            <span>Bold</span>
            <span className="ml-1 text-xs text-gray-11">(cmd + b)</span>
          </Fragment>
        }
        aria-label="Set bold"
        isActive={editor?.isActive("bold")}
        onClick={(e) => {
          editor?.chain().focus().toggleBold().run();
          onClick?.(e);
        }}
        disabled={!editor?.can().chain().focus().toggleBold().run()}
        ref={ref}
        {...props}
      >
        {children || <BoldIcon className="size-4" />}
      </ToolbarButton>
    );
  },
);

BoldToolbar.displayName = "BoldToolbar";

export { BoldToolbar };

"use client";

import { forwardRef } from "react";

import { TextQuote } from "lucide-react";

import { useEditorContext } from "@/components/editor/partials/editor-provider";

import ToolbarButton, {
  type ToolbarButtonProps,
} from "../partials/toolbar-button";

const BlockquoteToolbar = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useEditorContext();
    return (
      <ToolbarButton
        tooltip="Blockquote"
        aria-label="Insert blockquote"
        isActive={editor?.isActive("blockquote")}
        onClick={(e) => {
          editor?.chain().focus().toggleBlockquote().run();
          onClick?.(e);
        }}
        disabled={!editor?.can().chain().focus().toggleBlockquote().run()}
        ref={ref}
        {...props}
      >
        {children || <TextQuote className="size-4" />}
      </ToolbarButton>
    );
  },
);

BlockquoteToolbar.displayName = "BlockquoteToolbar";

export { BlockquoteToolbar };

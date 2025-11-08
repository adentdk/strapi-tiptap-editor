"use client";

import { forwardRef } from "react";

import { Undo2 } from "lucide-react";

import { useEditorContext } from "@/components/editor/partials/editor-provider";

import ToolbarButton, { ToolbarButtonProps } from "../partials/toolbar-button";

const UndoToolbar = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useEditorContext();

    return (
      <ToolbarButton
        tooltip="Undo"
        aria-label="Undo"
        onClick={(e) => {
          editor?.chain().focus().undo().run();
          onClick?.(e);
        }}
        disabled={!editor?.can().chain().focus().undo().run()}
        ref={ref}
        {...props}
      >
        {children || <Undo2 className="size-4" />}
      </ToolbarButton>
    );
  },
);

UndoToolbar.displayName = "UndoToolbar";

export { UndoToolbar };

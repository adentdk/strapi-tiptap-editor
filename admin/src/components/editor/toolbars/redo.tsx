import { forwardRef } from "react";

import { Redo2 } from "lucide-react";

import { useEditorContext } from "../partials/editor-provider";

import ToolbarButton, { ToolbarButtonProps } from "../partials/toolbar-button";

const RedoToolbar = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useEditorContext();

    return (
      <ToolbarButton
        tooltip="Redo"
        aria-label="Redo"
        onClick={(e) => {
          editor?.chain().focus().redo().run();
          onClick?.(e);
        }}
        disabled={!editor?.can().chain().focus().redo().run()}
        ref={ref}
        {...props}
      >
        {children || <Redo2 className="size-4" />}
      </ToolbarButton>
    );
  },
);

RedoToolbar.displayName = "RedoToolbar";

export { RedoToolbar };

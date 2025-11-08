import { forwardRef } from "react";

import { WrapText } from "lucide-react";

import { useEditorContext } from "../partials/editor-provider";

import ToolbarButton, { ToolbarButtonProps } from "../partials/toolbar-button";

const HardBreakToolbar = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useEditorContext();
    return (
      <ToolbarButton
        tooltip="Hard break"
        aria-label="Insert hard break"
        onClick={(e) => {
          editor?.chain().focus().setHardBreak().run();
          onClick?.(e);
        }}
        ref={ref}
        {...props}
      >
        {children || <WrapText className="size-4" />}
      </ToolbarButton>
    );
  },
);

HardBreakToolbar.displayName = "HardBreakToolbar";

export { HardBreakToolbar };

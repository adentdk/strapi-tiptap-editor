import { forwardRef, Fragment } from "react";

import { Strikethrough } from "lucide-react";

import { useEditorContext } from "@/src/components/editor/partials/editor-provider";

import ToolbarButton, { ToolbarButtonProps } from "../partials/toolbar-button";

const StrikeThroughToolbar = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useEditorContext();
    return (
      <ToolbarButton
        tooltip={
          <Fragment>
            <span>Strikethrough</span>
            <span className="ml-1 text-xs text-gray-11">(cmd + shift + x)</span>
          </Fragment>
        }
        aria-label="Set strikethrough"
        isActive={editor?.isActive("strike")}
        onClick={(e) => {
          editor?.chain().focus().toggleStrike().run();
          onClick?.(e);
        }}
        disabled={!editor?.can().chain().focus().toggleStrike().run()}
        ref={ref}
        {...props}
      >
        {children || <Strikethrough className="size-4" />}
      </ToolbarButton>
    );
  },
);

StrikeThroughToolbar.displayName = "StrikeThroughToolbar";

export { StrikeThroughToolbar };

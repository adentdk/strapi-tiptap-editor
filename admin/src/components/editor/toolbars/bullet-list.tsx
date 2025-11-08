import { forwardRef } from "react";

import { List } from "lucide-react";

import { useEditorContext } from "@/src/components/editor/partials/editor-provider";

import ToolbarButton, { ToolbarButtonProps } from "../partials/toolbar-button";

const BulletListToolbar = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useEditorContext();

    return (
      <ToolbarButton
        tooltip="Bullet list"
        aria-label="Insert bullet list"
        isActive={editor?.isActive("bulletList")}
        onClick={(e) => {
          editor?.chain().focus().toggleBulletList().run();
          onClick?.(e);
        }}
        disabled={!editor?.can().chain().focus().toggleBulletList().run()}
        ref={ref}
        {...props}
      >
        {children || <List className="size-4" />}
      </ToolbarButton>
    );
  },
);

BulletListToolbar.displayName = "BulletListToolbar";

export { BulletListToolbar };

import { forwardRef } from "react";
import { List } from "lucide-react";
import { useEditorContext } from "../partials/editor-provider";
import ToolbarButton, { ToolbarButtonProps } from "../partials/toolbar-button";
import styled from "styled-components";

// Styled Components
const ListIcon = styled(List)`
  width: 16px;
  height: 16px;
`;

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
        {children || <ListIcon />}
      </ToolbarButton>
    );
  },
);

BulletListToolbar.displayName = "BulletListToolbar";

export { BulletListToolbar };
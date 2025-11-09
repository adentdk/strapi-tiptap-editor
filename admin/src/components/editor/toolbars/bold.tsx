import { forwardRef, Fragment } from "react";
import type { Extension } from "@tiptap/core";
import { BoldIcon } from "lucide-react";
import { useEditorContext } from "../partials/editor-provider";
import ToolbarButton, { ToolbarButtonProps } from "../partials/toolbar-button";
import styled from "styled-components";

// Styled Components
const BoldIconStyled = styled(BoldIcon)`
  width: 16px;
  height: 16px;
`;

const TooltipContent = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ShortcutText = styled.span`
  font-size: 11px;
  color: ${props => props.theme.colors.neutral600};
`;

const BoldToolbar = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useEditorContext();
    return (
      <ToolbarButton
        tooltip={
          <Fragment>
            <TooltipContent>
              <span>Bold</span>
              <ShortcutText>(cmd + b)</ShortcutText>
            </TooltipContent>
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
        {children || <BoldIconStyled />}
      </ToolbarButton>
    );
  },
);

BoldToolbar.displayName = "BoldToolbar";

export { BoldToolbar };
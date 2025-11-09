import { forwardRef, Fragment } from "react";
import { Strikethrough } from "lucide-react";
import { useEditorContext } from "../partials/editor-provider";
import ToolbarButton, { ToolbarButtonProps } from "../partials/toolbar-button";
import styled from "styled-components";

const StrikethroughIcon = styled(Strikethrough)`
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

const StrikeThroughToolbar = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useEditorContext();
    return (
      <ToolbarButton
        tooltip={
          <Fragment>
            <TooltipContent>
              <span>Strikethrough</span>
              <ShortcutText>(cmd + shift + x)</ShortcutText>
            </TooltipContent>
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
        {children || <StrikethroughIcon />}
      </ToolbarButton>
    );
  },
);

StrikeThroughToolbar.displayName = "StrikeThroughToolbar";

export { StrikeThroughToolbar };
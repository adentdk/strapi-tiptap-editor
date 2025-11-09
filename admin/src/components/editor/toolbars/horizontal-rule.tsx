import { forwardRef } from "react";
import { SeparatorHorizontal } from "lucide-react";
import { useEditorContext } from "../partials/editor-provider";
import ToolbarButton, { ToolbarButtonProps } from "../partials/toolbar-button";
import styled from "styled-components";

// Styled Components
const SeparatorHorizontalIcon = styled(SeparatorHorizontal)`
  width: 16px;
  height: 16px;
`;

const HorizontalRuleToolbar = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useEditorContext();
    return (
      <ToolbarButton
        tooltip="Horizontal Rule"
        aria-label="Insert horizontal rule"
        onClick={(e) => {
          editor?.chain().focus().setHorizontalRule().run();
          onClick?.(e);
        }}
        ref={ref}
        {...props}
      >
        {children || <SeparatorHorizontalIcon />}
      </ToolbarButton>
    );
  },
);

HorizontalRuleToolbar.displayName = "HorizontalRuleToolbar";

export { HorizontalRuleToolbar };
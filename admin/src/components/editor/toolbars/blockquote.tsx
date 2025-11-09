import { forwardRef } from "react";
import { TextQuote } from "lucide-react";
import { useEditorContext } from "../partials/editor-provider";
import ToolbarButton, {
  type ToolbarButtonProps,
} from "../partials/toolbar-button";
import styled from "styled-components";

// Styled Components
const QuoteIcon = styled(TextQuote)`
  width: 16px;
  height: 16px;
`;

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
        {children || <QuoteIcon />}
      </ToolbarButton>
    );
  },
);

BlockquoteToolbar.displayName = "BlockquoteToolbar";

export { BlockquoteToolbar };
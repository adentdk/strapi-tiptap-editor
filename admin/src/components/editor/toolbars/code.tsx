import { forwardRef } from "react";
import { Code2 } from "lucide-react";
import { useEditorContext } from "../partials/editor-provider";
import ToolbarButton, { ToolbarButtonProps } from "../partials/toolbar-button";
import styled from "styled-components";

// Styled Components
const CodeIcon = styled(Code2)`
  width: 16px;
  height: 16px;
`;

const CodeToolbar = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useEditorContext();
    return (
      <ToolbarButton
        tooltip="Code"
        aria-label="Insert code"
        isActive={editor?.isActive("code")}
        onClick={(e) => {
          editor?.chain().focus().toggleCode().run();
          onClick?.(e);
        }}
        disabled={!editor?.can().chain().focus().toggleCode().run()}
        ref={ref}
        {...props}
      >
        {children || <CodeIcon />}
      </ToolbarButton>
    );
  },
);

CodeToolbar.displayName = "CodeToolbar";

export { CodeToolbar };
import { forwardRef, Fragment } from "react";
import { Code2Icon } from "lucide-react";
import { useEditorContext } from "../partials/editor-provider";
import ToolbarButton, { ToolbarButtonProps } from "../partials/toolbar-button";
import styled from "styled-components";

// Styled Components
const CodeIconStyled = styled(Code2Icon)`
  width: 16px;
  height: 16px;
`;

const TooltipContent = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CodeModeToolbar = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { isCodeModalOpen, setIsCodeModalOpen } = useEditorContext();
    return (
      <ToolbarButton
        tooltip={
          <Fragment>
            <TooltipContent>
              <span>Code Mode</span>
            </TooltipContent>
          </Fragment>
        }
        aria-label="Toggle code mode"
        isActive={isCodeModalOpen}
        onClick={(e) => {
          setIsCodeModalOpen(!isCodeModalOpen);
          onClick?.(e);
        }}
        ref={ref}
        {...props}
      >
        {children || <CodeIconStyled />}
      </ToolbarButton>
    );
  },
);

CodeModeToolbar.displayName = "CodeModeToolbar";

export { CodeModeToolbar };

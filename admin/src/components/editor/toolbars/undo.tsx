import { forwardRef } from "react";

import { Undo2 } from "lucide-react";



import { useEditorContext } from "../partials/editor-provider";

import ToolbarButton, { ToolbarButtonProps } from "../partials/toolbar-button";
import styled from "styled-components";

const UndoIcon = styled(Undo2)`
  width: 16px;
  height: 16px;
`;
const UndoToolbar = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useEditorContext();

    return (
      <ToolbarButton
        tooltip="Undo"
        aria-label="Undo"
        onClick={(e) => {
          editor?.chain().focus().undo().run();
          onClick?.(e);
        }}
        disabled={!editor?.can().chain().focus().undo().run()}
        ref={ref}
        {...props}
      >
        {children || <UndoIcon />}
      </ToolbarButton>
    );
  },
);

UndoToolbar.displayName = "UndoToolbar";

export { UndoToolbar };

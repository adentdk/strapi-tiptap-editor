import { forwardRef } from "react";
import { ListOrdered } from "lucide-react";
import { useEditorContext } from "../partials/editor-provider";
import ToolbarButton, { ToolbarButtonProps } from "../partials/toolbar-button";
import styled from "styled-components";

const ListOrderedIcon = styled(ListOrdered)`
  width: 16px;
  height: 16px;
`;

const OrderedListToolbar = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useEditorContext();
    return (
      <ToolbarButton
        tooltip="Ordered list"
        aria-label="Insert ordered list"
        isActive={editor?.isActive("orderedList")}
        onClick={(e) => {
          editor?.chain().focus().toggleOrderedList().run();
          onClick?.(e);
        }}
        disabled={!editor?.can().chain().focus().toggleOrderedList().run()}
        ref={ref}
        {...props}
      >
        {children || <ListOrderedIcon />}
      </ToolbarButton>
    );
  },
);

OrderedListToolbar.displayName = "OrderedListToolbar";

export { OrderedListToolbar };
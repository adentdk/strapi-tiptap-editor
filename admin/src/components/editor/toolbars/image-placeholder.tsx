import { forwardRef } from "react";
import { LucideImage } from "lucide-react";
import { useEditorContext } from "../partials/editor-provider";
import ToolbarButton, { ToolbarButtonProps } from "../partials/toolbar-button";
import styled from "styled-components";

// Styled Components
const ImageIcon = styled(LucideImage)`
  width: 16px;
  height: 16px;
`;

const ImagePlaceholderToolbar = forwardRef<
  HTMLButtonElement,
  ToolbarButtonProps
>(({ className, onClick, children, ...props }, ref) => {
  const { editor } = useEditorContext();
  return (
    <ToolbarButton
      tooltip="Image"
      aria-label="Insert image"
      isActive={editor?.isActive("image-placeholder")}
      onClick={(e) => {
        editor?.chain().focus().insertImagePlaceholder().run();
        onClick?.(e);
      }}
      ref={ref}
      {...props}
    >
      {children || <ImageIcon />}
    </ToolbarButton>
  );
});

ImagePlaceholderToolbar.displayName = "ImagePlaceholderToolbar";

export { ImagePlaceholderToolbar };
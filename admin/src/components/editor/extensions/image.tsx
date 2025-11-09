import { useEffect, useRef, useState } from "react";
import { NodeViewProps } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { ReactNodeViewRenderer } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Copy,
  Maximize,
  MoreVertical,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Separator } from "../../ui/separator";
import { duplicateContent } from "../utils";
import { Button } from "../../ui/button";
import styled from "styled-components";

export const ImageExtension = Image.extend({
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: "90%",
      },
      height: {
        default: null,
      },
      align: {
        default: "center",
      },
      srcset: { 
        default: null 
      },
      // New attributes for better control
      maxWidth: {
        default: "100%",
      },
      aspectRatio: {
        default: null,
      },
      objectFit: {
        default: "contain",
      },
    };
  },

  addNodeView: () => {
    return ReactNodeViewRenderer(TiptapImageComponent);
  },

  // Tambahkan parseHTML dan renderHTML untuk handle paste
  parseHTML() {
    return [
      {
        tag: 'img[src]',
        getAttrs: (dom) => {
          if (typeof dom === 'string') return {}
          const element = dom as HTMLImageElement
          
          return {
            src: element.getAttribute('src'),
            alt: element.getAttribute('alt'),
            title: element.getAttribute('title'),
            width: element.getAttribute('width') || "90%",
            height: element.getAttribute('height'),
            align: "center", // Default untuk gambar yang di-paste
            srcset: element.getAttribute('srcset'),
            maxWidth: "100%",
            objectFit: "contain",
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', HTMLAttributes]
  },
});

// Styled Components (tetap sama seperti sebelumnya)
const ImageWrapper = styled(NodeViewWrapper)<{
  $selected?: boolean;
  $align?: string;
  $width?: string;
  $maxWidth?: string;
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  border: 2px solid transparent;
  width: ${props => props.$width || "90%"};
  max-width: ${props => props.$maxWidth || "100%"};
  margin: 0 auto;
  
  ${props => props.$selected && `
    border-color: ${props.theme.colors.primary500};
  `}
  
  ${props => {
    switch (props.$align) {
      case "left":
        return `
          margin-left: 0;
          margin-right: auto;
        `;
      case "right":
        return `
          margin-left: auto;
          margin-right: 0;
        `;
      case "center":
      default:
        return `
          margin-left: auto;
          margin-right: auto;
        `;
    }
  }}
`;

const ImageContainer = styled.div<{ 
  $resizing?: boolean;
  $objectFit?: string;
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  overflow: hidden;
  cursor: ${props => props.$resizing ? 'col-resize' : 'default'};
  
  img {
    object-fit: ${props => props.$objectFit || 'contain'};
    transition: all 0.2s ease;
  }
`;

const StyledImage = styled.img<{
  $aspectRatio?: string;
}>`
  display: block;
  width: 100%;
  height: auto;
  ${props => props.$aspectRatio && `
    aspect-ratio: ${props.$aspectRatio};
  `}
`;

const AltTextBadge = styled.span`
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  max-width: calc(100% - 24px);
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.neutral300};
  background-color: ${props => props.theme.colors.neutral0};
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  border-radius: 4px;
  backdrop-filter: blur(4px);
`;

const AltTextStatus = styled.span`
  flex: none;
  font-size: 14px;
  font-weight: bold;
`;

const AltTextContent = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AltTextButton = styled.button`
  flex: none;
  border: 0;
  padding: 4px 8px;
  background-color: transparent;
  appearance: none;
  text-decoration: underline;
  color: ${props => props.theme.colors.primary500};
  cursor: pointer;
  border-radius: 3px;
  font-size: 12px;
  
  &:hover {
    color: ${props => props.theme.colors.primary600};
    background-color: ${props => props.theme.colors.primary100};
  }
`;

const Toolbar = styled.div<{ $resizing?: boolean; $openedMore?: boolean }>`
  position: absolute;
  right: 16px;
  top: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.neutral300};
  background-color: ${props => props.theme.colors.neutral0};
  padding: 6px;
  opacity: ${props => props.$openedMore ? 1 : 0.5};
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    opacity: 1;
  }
`;

const ToolbarButton = styled(Button)<{ $active?: boolean }>`
  width: 32px;
  height: 32px;
  padding: 0;
  
  ${props => props.$active && `
    background-color: ${props.theme.colors.primary100};
    color: ${props.theme.colors.primary600};
  `}
`;

const SizeIndicator = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: ${props => props.theme.colors.neutral800};
  color: ${props => props.theme.colors.neutral0};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${ImageWrapper}:hover & {
    opacity: 0.8;
  }
`;

const StyledDropdownMenuContent = styled(DropdownMenuContent)`
  margin-top: 4px;
  font-size: 14px;
  min-width: 200px;
`;

const DropdownMenuItemStyled = styled(DropdownMenuItem)`
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  
  &.destructive {
    color: ${props => props.theme.colors.danger500};
    
    &:focus {
      color: ${props => props.theme.colors.danger500};
      background-color: ${props => props.theme.colors.danger100};
    }
  }
`;

const SizePresetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  padding: 8px;
`;

const SizePresetButton = styled.button<{ $active?: boolean }>`
  padding: 6px 8px;
  border: 1px solid ${props => props.theme.colors.neutral300};
  background-color: ${props => props.$active ? props.theme.colors.primary100 : props.theme.colors.neutral0};
  color: ${props => props.$active ? props.theme.colors.primary600 : props.theme.colors.neutral700};
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary100};
    border-color: ${props => props.theme.colors.primary500};
  }
`;

// Helper function untuk mendeteksi dan menormalisasi atribut gambar
const normalizeImageAttributes = (attrs: any) => {
  const normalized = { ...attrs };
  
  // Jika hanya ada src tanpa atribut lain, set default values
  if (attrs.src && !attrs.width && !attrs.align) {
    normalized.width = "90%";
    normalized.align = "center";
    normalized.maxWidth = "100%";
    normalized.objectFit = "contain";
  }
  
  // Normalize width value
  if (typeof normalized.width === 'number') {
    normalized.width = `${normalized.width}px`;
  }
  
  return normalized;
};

export function TiptapImageComponent(props: NodeViewProps) {
  const { node, editor, selected, deleteNode, updateAttributes } = props;
  const imageRef = useRef<HTMLImageElement | null>(null);
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [resizing, setResizing] = useState(false);
  const [resizingPosition, setResizingPosition] = useState<"left" | "right">("left");
  const [resizeInitialWidth, setResizeInitialWidth] = useState(0);
  const [resizeInitialMouseX, setResizeInitialMouseX] = useState(0);
  const [openedMore, setOpenedMore] = useState(false);

  // Normalize attributes ketika komponen mount
  useEffect(() => {
    const normalizedAttrs = normalizeImageAttributes(node.attrs);
    const needsUpdate = Object.keys(normalizedAttrs).some(
      key => normalizedAttrs[key] !== node.attrs[key]
    );
    
    if (needsUpdate) {
      updateAttributes(normalizedAttrs);
    }
  }, [node.attrs, updateAttributes]);

  // Size presets
  const sizePresets = [
    { label: "Small", value: "30%" },
    { label: "Medium", value: "60%" },
    { label: "Large", value: "90%" },
    { label: "Full", value: "100%" },
    { label: "Fit", value: "fit-content" },
    { label: "Auto", value: "auto" },
  ];

  // Object fit options
  const objectFitOptions = [
    { label: "Contain", value: "contain" },
    { label: "Cover", value: "cover" },
    { label: "Fill", value: "fill" },
  ];

  function handleResizingPosition({
    e,
    position,
  }: {
    e: React.MouseEvent<HTMLDivElement, MouseEvent>;
    position: "left" | "right";
  }) {
    startResize(e);
    setResizingPosition(position);
  }

  function startResize(event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setResizing(true);
    setResizeInitialMouseX(event.clientX);
    if (imageRef.current) {
      setResizeInitialWidth(imageRef.current.offsetWidth);
    }
  }

  function resize(event: MouseEvent) {
    if (!resizing) {
      return;
    }

    let dx = event.clientX - resizeInitialMouseX;
    if (resizingPosition === "left") {
      dx = -dx;
    }

    const newWidth = Math.max(resizeInitialWidth + dx, 100); // Minimum 100px
    const parentWidth = nodeRef.current?.parentElement?.offsetWidth || 0;

    if (newWidth <= parentWidth) {
      updateAttributes({
        width: `${newWidth}px`,
      });
    }
  }

  function endResize() {
    setResizing(false);
    setResizeInitialMouseX(0);
    setResizeInitialWidth(0);
  }

  function handleTouchStart(
    event: React.TouchEvent,
    position: "left" | "right",
  ) {
    event.preventDefault();
    setResizing(true);
    setResizingPosition(position);
    setResizeInitialMouseX(event.touches[0].clientX);
    if (imageRef.current) {
      setResizeInitialWidth(imageRef.current.offsetWidth);
    }
  }

  function handleTouchMove(event: TouchEvent) {
    if (!resizing) {
      return;
    }

    let dx = event.touches[0].clientX - resizeInitialMouseX;
    if (resizingPosition === "left") {
      dx = -dx;
    }

    const newWidth = Math.max(resizeInitialWidth + dx, 100);
    const parentWidth = nodeRef.current?.parentElement?.offsetWidth || 0;

    if (newWidth <= parentWidth) {
      updateAttributes({
        width: `${newWidth}px`,
      });
    }
  }

  function handleTouchEnd() {
    setResizing(false);
    setResizeInitialMouseX(0);
    setResizeInitialWidth(0);
  }

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", endResize);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", endResize);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [resizing, resizeInitialMouseX, resizeInitialWidth]);

  const { alt, width, align, objectFit } = node.attrs;

  const onEditAlt = () => {
    const newAlt = prompt("Set alt text:", alt || "");
    if (newAlt !== null) {
      updateAttributes({ alt: newAlt });
    }
  };

  const getDisplayWidth = () => {
    if (typeof width === 'string') {
      return width;
    }
    if (typeof width === 'number') {
      return `${width}px`;
    }
    return 'auto';
  };

  return (
    <ImageWrapper
      ref={nodeRef}
      $selected={selected}
      $align={align}
      $width={getDisplayWidth()}
      $maxWidth={node.attrs.maxWidth}
    >
      <ImageContainer 
        $resizing={resizing}
        $objectFit={objectFit}
      >
        <StyledImage
          ref={imageRef}
          src={node.attrs.src}
          alt={alt}
          title={node.attrs.title}
          $aspectRatio={node.attrs.aspectRatio}
        />
        
        {editor?.isEditable && (
          <AltTextBadge>
            <AltTextStatus style={{
              color: alt ? "green" : "red"
            }}>
              {alt ? "✔" : "!"}
            </AltTextStatus>
            <AltTextContent>
              {alt ? `Alt: "${alt}"` : `Alt text missing`}
            </AltTextContent>
            <AltTextButton type="button" onClick={onEditAlt}>
              Edit
            </AltTextButton>
          </AltTextBadge>
        )}

        <SizeIndicator>
          {getDisplayWidth()}
        </SizeIndicator>

        <NodeViewContent as="div" style={{ textAlign: "center", padding: "8px" }}>
          {node.attrs.title}
        </NodeViewContent>

        {editor?.isEditable && (
          <>
            <Toolbar $resizing={resizing} $openedMore={openedMore}>
              {/* Alignment Controls */}
              <ToolbarButton
                $active={align === "left"}
                variant="ghost"
                onClick={() => updateAttributes({ align: "left" })}
                title="Align Left"
              >
                <AlignLeft width={16} height={16} />
              </ToolbarButton>
              <ToolbarButton
                $active={align === "center"}
                variant="ghost"
                onClick={() => updateAttributes({ align: "center" })}
                title="Align Center"
              >
                <AlignCenter width={16} height={16} />
              </ToolbarButton>
              <ToolbarButton
                $active={align === "right"}
                variant="ghost"
                onClick={() => updateAttributes({ align: "right" })}
                title="Align Right"
              >
                <AlignRight width={16} height={16} />
              </ToolbarButton>
              
              <Separator orientation="vertical" style={{ height: "20px" }} />
              
              {/* More Options */}
              <DropdownMenu
                open={openedMore}
                onOpenChange={setOpenedMore}
              >
                <DropdownMenuTrigger asChild>
                  <ToolbarButton variant="ghost" title="More options">
                    <MoreVertical width={16} height={16} />
                  </ToolbarButton>
                </DropdownMenuTrigger>
                <StyledDropdownMenuContent align="start" alignOffset={-90}>
                  {/* Size Presets */}
                  <div style={{ padding: "8px 12px 4px 12px", fontSize: "12px", fontWeight: "600", color: "var(--neutral-600)" }}>
                    Size Presets
                  </div>
                  <SizePresetGrid>
                    {sizePresets.map((preset) => (
                      <SizePresetButton
                        key={preset.value}
                        $active={width === preset.value}
                        onClick={() => updateAttributes({ width: preset.value })}
                      >
                        {preset.label}
                      </SizePresetButton>
                    ))}
                  </SizePresetGrid>
                  
                  <DropdownMenuSeparator />
                  
                  {/* Object Fit Options */}
                  <div style={{ padding: "8px 12px 4px 12px", fontSize: "12px", fontWeight: "600", color: "var(--neutral-600)" }}>
                    Image Fit
                  </div>
                  <div style={{ padding: "0 8px 8px 8px" }}>
                    {objectFitOptions.map((option) => (
                      <SizePresetButton
                        key={option.value}
                        $active={objectFit === option.value}
                        onClick={() => updateAttributes({ objectFit: option.value })}
                        style={{ width: "100%", marginBottom: "4px" }}
                      >
                        {option.label}
                      </SizePresetButton>
                    ))}
                  </div>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItemStyled
                    onClick={() => duplicateContent(editor)}
                  >
                    <Copy width={16} height={16} />
                    Duplicate
                  </DropdownMenuItemStyled>
                  <DropdownMenuItemStyled
                    onClick={() => updateAttributes({ width: "100%" })}
                  >
                    <Maximize width={16} height={16} />
                    Full Width
                  </DropdownMenuItemStyled>
                  <DropdownMenuItemStyled
                    onClick={() => updateAttributes({ width: "auto", height: "auto" })}
                  >
                    <Maximize width={16} height={16} />
                    Original Size
                  </DropdownMenuItemStyled>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItemStyled
                    className="destructive"
                    onClick={deleteNode}
                  >
                    <Trash width={16} height={16} />
                    Delete Image
                  </DropdownMenuItemStyled>
                </StyledDropdownMenuContent>
              </DropdownMenu>
            </Toolbar>
          </>
        )}
      </ImageContainer>
    </ImageWrapper>
  );
}
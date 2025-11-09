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
    };
  },

  addNodeView: () => {
    return ReactNodeViewRenderer(TiptapImageComponent);
  },
});

// Styled Components
const ImageWrapper = styled(NodeViewWrapper)<{ 
  $selected?: boolean; 
  $align?: string;
  $width?: string;
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  border: 2px solid transparent;
  width: ${props => props.$width || "90%"};
  
  ${props => props.$selected && `
    border-color: ${props.theme.colors.primary500};
  `}
  
  ${props => props.$align === "left" && `
    left: 0;
    transform: translateX(0);
  `}
  
  ${props => props.$align === "center" && `
    left: 50%;
    transform: translateX(-50%);
  `}
  
  ${props => props.$align === "right" && `
    left: 100%;
    transform: translateX(-100%);
  `}
`;

const ImageContainer = styled.div<{ $resizing?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  group: hover;
`;

const StyledImage = styled.img`
  display: block;
  max-width: 100%;
  height: auto;
`;

const AltTextBadge = styled.span`
  position: absolute;
  bottom: 12px;
  left: 12px;
  max-width: calc(100% - 20px);
  padding: 4px 8px;
  border: 1px solid ${props => props.theme.colors.neutral300};
  background-color: ${props => props.theme.colors.neutral0}CC;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
`;

const AltTextStatus = styled.span`
  flex: none;
  font-size: 16px;
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
  padding: 0;
  background-color: transparent;
  appearance: none;
  text-decoration: underline;
  color: ${props => props.theme.colors.primary500};
  cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.colors.primary600};
  }
`;

const ResizeHandle = styled.div<{ $position: "left" | "right" }>`
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 20;
  width: 25px;
  display: flex;
  cursor: col-resize;
  align-items: center;
  justify-content: ${props => props.$position === "left" ? "flex-start" : "flex-end"};
  padding: 8px;
  
  ${props => props.$position === "left" ? "left: 0;" : "right: 0;"}
`;

const ResizeHandleBar = styled.div`
  z-index: 20;
  height: 70px;
  width: 4px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.neutral800};
  background-color: ${props => props.theme.colors.neutral800}99;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  
  ${ResizeHandle}:hover & {
    opacity: 1;
  }
`;

const Toolbar = styled.div<{ $resizing?: boolean; $openedMore?: boolean }>`
  position: absolute;
  right: 16px;
  top: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.colors.neutral300};
  background-color: ${props => props.theme.colors.neutral0};
  padding: 4px;
  opacity: ${props => props.$openedMore ? 1 : 0};
  transition: opacity 0.2s ease-in-out;
  
  &:hover {
    opacity: 1;
  }
`;

const ToolbarButton = styled(Button)<{ $active?: boolean }>`
  width: 28px;
  height: 28px;
  
  ${props => props.$active && `
    background-color: ${props.theme.colors.neutral100};
  `}
`;

const StyledDropdownMenuContent = styled(DropdownMenuContent)`
  margin-top: 4px;
  font-size: 14px;
`;

const DropdownMenuItemStyled = styled(DropdownMenuItem)`
  font-size: 14px;
  display: flex;
  align-items: center;
  
  &.destructive {
    color: ${props => props.theme.colors.danger500};
    
    &:focus {
      color: ${props => props.theme.colors.danger500};
    }
  }
`;

const Icon = styled.div`
  width: 16px;
  height: 16px;
  margin-right: 8px;
`;

export function TiptapImageComponent(props: NodeViewProps) {
  const { node, editor, selected, deleteNode, updateAttributes } = props;
  const imageRef = useRef<HTMLImageElement | null>(null);
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [resizing, setResizing] = useState(false);
  const [resizingPosition, setResizingPosition] = useState<"left" | "right">("left");
  const [resizeInitialWidth, setResizeInitialWidth] = useState(0);
  const [resizeInitialMouseX, setResizeInitialMouseX] = useState(0);
  const [openedMore, setOpenedMore] = useState(false);

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
      dx = resizeInitialMouseX - event.clientX;
    }

    const newWidth = Math.max(resizeInitialWidth + dx, 150);
    const parentWidth = nodeRef.current?.parentElement?.offsetWidth || 0;

    if (newWidth < parentWidth) {
      updateAttributes({
        width: newWidth,
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
      dx = resizeInitialMouseX - event.touches[0].clientX;
    }

    const newWidth = Math.max(resizeInitialWidth + dx, 150);
    const parentWidth = nodeRef.current?.parentElement?.offsetWidth || 0;

    if (newWidth < parentWidth) {
      updateAttributes({
        width: newWidth,
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

  const { alt } = node.attrs;

  const onEditAlt = () => {
    const newAlt = prompt("Set alt text:", alt || "");
    updateAttributes({ alt: newAlt });
  };

  return (
    <ImageWrapper
      ref={nodeRef}
      $selected={selected}
      $align={node.attrs.align}
      $width={node.attrs.width}
    >
      <ImageContainer $resizing={resizing}>
        <StyledImage
          ref={imageRef}
          src={node.attrs.src}
          alt={alt}
          title={node.attrs.title}
        />
        <AltTextBadge>
          <AltTextStatus style={{ 
            color: alt ? "green" : "red" 
          }}>
            {alt ? "✔" : "!"}
          </AltTextStatus>
          <AltTextContent>
            {alt ? `Alt text: "${alt}"` : `Alt text missing.`}
          </AltTextContent>
          <AltTextButton type="button" onClick={onEditAlt}>
            Edit
          </AltTextButton>
        </AltTextBadge>
        <NodeViewContent as="div" style={{ textAlign: "center" }}>
          {node.attrs.title}
        </NodeViewContent>

        {editor?.isEditable && (
          <>
            <ResizeHandle 
              $position="left"
              onMouseDown={(event) => {
                handleResizingPosition({ e: event, position: "left" });
              }}
              onTouchStart={(event) => handleTouchStart(event, "left")}
            >
              <ResizeHandleBar />
            </ResizeHandle>
            <ResizeHandle 
              $position="right"
              onMouseDown={(event) => {
                handleResizingPosition({ e: event, position: "right" });
              }}
              onTouchStart={(event) => handleTouchStart(event, "right")}
            >
              <ResizeHandleBar />
            </ResizeHandle>
            <Toolbar $resizing={resizing} $openedMore={openedMore}>
              <ToolbarButton
                $active={node.attrs.align === "left"}
                variant="ghost"
                onClick={() => {
                  updateAttributes({
                    align: "left",
                  });
                }}
              >
                <AlignLeft width={16} height={16} />
              </ToolbarButton>
              <ToolbarButton
                $active={node.attrs.align === "center"}
                variant="ghost"
                onClick={() => {
                  updateAttributes({
                    align: "center",
                  });
                }}
              >
                <AlignCenter width={16} height={16} />
              </ToolbarButton>
              <ToolbarButton
                $active={node.attrs.align === "right"}
                variant="ghost"
                onClick={() => {
                  updateAttributes({
                    align: "right",
                  });
                }}
              >
                <AlignRight width={16} height={16} />
              </ToolbarButton>
              <Separator orientation="vertical" style={{ height: "20px" }} />
              <DropdownMenu
                open={openedMore}
                onOpenChange={(val) => {
                  setOpenedMore(val);
                }}
              >
                <DropdownMenuTrigger asChild>
                  <ToolbarButton variant="ghost">
                    <MoreVertical width={16} height={16} />
                  </ToolbarButton>
                </DropdownMenuTrigger>
                <StyledDropdownMenuContent align="start" alignOffset={-90}>
                  <DropdownMenuItemStyled
                    onClick={() => {
                      duplicateContent(editor);
                    }}
                  >
                    <Icon><Copy width={16} height={16} /></Icon>
                    Duplicate
                  </DropdownMenuItemStyled>
                  <DropdownMenuItemStyled
                    onClick={() => {
                      updateAttributes({
                        width: "fit-content",
                      });
                    }}
                  >
                    <Icon><Maximize width={16} height={16} /></Icon>
                    Full Screen
                  </DropdownMenuItemStyled>
                  <DropdownMenuSeparator />
                  <DropdownMenuItemStyled
                    className="destructive"
                    onClick={() => {
                      deleteNode();
                    }}
                  >
                    <Icon><Trash width={16} height={16} /></Icon>
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
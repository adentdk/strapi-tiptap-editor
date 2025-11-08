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
import { Button } from "../../ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Separator } from "../../ui/separator";
import { cn } from "../../../utils/utils"
import { duplicateContent } from "../utils";

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

export function TiptapImageComponent(props: NodeViewProps) {
  const { node, editor, selected, deleteNode, updateAttributes } = props;
  const imageRef = useRef<HTMLImageElement | null>(null);
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [resizing, setResizing] = useState(false);
  const [resizingPosition, setResizingPosition] = useState<"left" | "right">(
    "left",
  );
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

    const newWidth = Math.max(resizeInitialWidth + dx, 150); // Minimum width: 150
    const parentWidth = nodeRef.current?.parentElement?.offsetWidth || 0; // Get the parent element's width

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // Mouse events
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", endResize);
    // Touch events
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", endResize);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resizing, resizeInitialMouseX, resizeInitialWidth]);

  const { alt } = node.attrs;

  const onEditAlt = () => {
    const newAlt = prompt("Set alt text:", alt || "");
    updateAttributes({ alt: newAlt });
  };

  return (
    <NodeViewWrapper
      ref={nodeRef}
      className={cn(
        "relative flex flex-col rounded-md border-2 border-transparent",
        selected ? "border-blue-300" : "",
        node.attrs.align === "left" && "left-0 -translate-x-0",
        node.attrs.align === "center" && "left-1/2 -translate-x-1/2",
        node.attrs.align === "right" && "left-full -translate-x-full",
      )}
      style={{ width: node.attrs.width }}
    >
      <div
        className={cn(
          "group relative flex flex-col rounded-md",
          resizing && "",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imageRef}
          src={node.attrs.src}
          alt={alt}
          title={node.attrs.title}
        />
        <span className="text-xs absolute bottom-3 left-3 max-w-[calc(100%-20px)] px-2 border border-border bg-background/80 inline-flex items-center overflow-hidden gap-1">
          <span className="flex-none text-xl font-bold">
            {alt ? (
              <span className="text-safe">✔</span>
            ) : (
              <span className="text-destructive">!</span>
            )}
          </span>
          <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
            {alt ? `Alt text: "${alt}"` : `Alt text missing.`}
          </span>
          <button
            className="flex-none border-0 p-0 bg-transparent appearance-none underline"
            type="button"
            onClick={onEditAlt}
          >
            Edit
          </button>
        </span>
        <NodeViewContent as="div" className="text-center">
          {node.attrs.title}
        </NodeViewContent>

        {editor?.isEditable && (
          <>
            <div
              className="absolute inset-y-0 z-20 flex w-[25px] cursor-col-resize items-center justify-start p-2"
              style={{ left: 0 }}
              onMouseDown={(event) => {
                handleResizingPosition({ e: event, position: "left" });
              }}
              onTouchStart={(event) => handleTouchStart(event, "left")}
            >
              <div className="z-20 h-[70px] w-1 rounded-xl border bg-[rgba(0,0,0,0.65)] opacity-0 transition-all group-hover:opacity-100" />
            </div>
            <div
              className="absolute inset-y-0 z-20 flex w-[25px] cursor-col-resize items-center justify-end p-2"
              style={{ right: 0 }}
              onMouseDown={(event) => {
                handleResizingPosition({ e: event, position: "right" });
              }}
              onTouchStart={(event) => handleTouchStart(event, "right")}
            >
              <div className="z-20 h-[70px] w-1 rounded-xl border bg-[rgba(0,0,0,0.65)] opacity-0 transition-all group-hover:opacity-100" />
            </div>
            <div
              className={cn(
                "absolute right-4 top-4 flex items-center gap-1 rounded-md border bg-background p-1 opacity-0 transition-opacity",
                !resizing && "group-hover:opacity-100",
                openedMore && "opacity-100",
              )}
            >
              <Button
                size="icon"
                className={cn(
                  "size-7",
                  node.attrs.align === "left" && "bg-accent",
                )}
                variant="ghost"
                onClick={() => {
                  updateAttributes({
                    align: "left",
                  });
                }}
              >
                <AlignLeft className="size-4" />
              </Button>
              <Button
                size="icon"
                className={cn(
                  "size-7",
                  node.attrs.align === "center" && "bg-accent",
                )}
                variant="ghost"
                onClick={() => {
                  updateAttributes({
                    align: "center",
                  });
                }}
              >
                <AlignCenter className="size-4" />
              </Button>
              <Button
                size="icon"
                className={cn(
                  "size-7",
                  node.attrs.align === "right" && "bg-accent",
                )}
                variant="ghost"
                onClick={() => {
                  updateAttributes({
                    align: "right",
                  });
                }}
              >
                <AlignRight className="size-4" />
              </Button>
              <Separator orientation="vertical" className="h-[20px]" />
              <DropdownMenu
                open={openedMore}
                onOpenChange={(val) => {
                  setOpenedMore(val);
                }}
              >
                <DropdownMenuTrigger asChild>
                  <Button size="icon" className="size-7" variant="ghost">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  alignOffset={-90}
                  className="mt-1 text-sm"
                >
                  <DropdownMenuItem
                    onClick={() => {
                      duplicateContent(editor);
                    }}
                  >
                    <Copy className="mr-2 size-4" /> Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      updateAttributes({
                        width: "fit-content",
                      });
                    }}
                  >
                    <Maximize className="mr-2 size-4" /> Full Screen
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => {
                      deleteNode();
                    }}
                  >
                    <Trash className="mr-2 size-4" /> Delete Image
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
}

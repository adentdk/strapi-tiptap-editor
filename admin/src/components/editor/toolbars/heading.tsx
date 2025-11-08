"use client";

import { useMemo } from "react";

import type { Extension } from "@tiptap/core";
import { HeadingOptions } from "@tiptap/extension-heading";
import { ParagraphOptions } from "@tiptap/extension-paragraph";
import { Check, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useEditorContext } from "../partials/editor-provider";
import ToolbarButton from "../partials/toolbar-button";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export const HeadingTooolbar = () => {
  const { editor } = useEditorContext();
  const { extensions = [] } = editor.extensionManager ?? [];

  const headingExt = extensions.find(
    (k) => k.name === "heading",
  ) as Extension<HeadingOptions>;

  const levels = useMemo<HeadingLevel[]>(() => {
    if (headingExt?.options) {
      return headingExt?.options?.levels ?? [1, 2, 3, 4, 5, 6];
    }

    return [];
  }, [headingExt?.options]);

  const paragraphExt = extensions.find(
    (k) => k.name === "paragraph",
  ) as Extension<ParagraphOptions>;

  const items: any[] = levels.map((level) => ({
    action: () => editor.commands.toggleHeading({ level }),
    isActive: () => editor.isActive("heading", { level }) || false,
    disabled: !editor.can().toggleHeading({ level }),
    title: `Heading ${level}`,
    level,
    shortcutKeys: ["alt", "mod", `${level}`],
  }));

  if (paragraphExt) {
    items.push({
      action: () => editor.commands.setParagraph(),
      isActive: () => editor.isActive("paragraph") || false,
      disabled: !editor.can().setParagraph(),
      level: 0,
      title: "Paragraph",
      shortcutKeys: ["alt", "mod", "0"],
    });
  }

  const isDisabled =
    items.filter((k: any) => k.disabled).length === items.length;

  return (
    <DropdownMenu>
      {/* <Tooltip>
        <TooltipTrigger asChild> */}
      <DropdownMenuTrigger disabled={isDisabled} asChild>
        <ToolbarButton
          tooltip="Text Heading"
          aria-label="Text Heading"
          disabled={isDisabled}
          asChild
        >
          <Button variant="ghost" size="sm" className="h-8 w-max font-normal">
            {items.find((k: any) => k.isActive())?.title}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </ToolbarButton>
      </DropdownMenuTrigger>
      {/* </TooltipTrigger>
        <TooltipContent>Text Heading</TooltipContent>
      </Tooltip> */}
      <DropdownMenuContent
        loop
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <DropdownMenuGroup>
          {items.map((option, index) => (
            <DropdownMenuItem
              onSelect={() => {
                option.action();
              }}
              key={index}
            >
              {option.title}

              {option.isActive() && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

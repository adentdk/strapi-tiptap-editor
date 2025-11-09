import { useMemo } from "react";
import type { Extension } from "@tiptap/core";
import { HeadingOptions } from "@tiptap/extension-heading";
import { ParagraphOptions } from "@tiptap/extension-paragraph";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { useEditorContext } from "../partials/editor-provider";
import ToolbarButton from "../partials/toolbar-button";
import styled from "styled-components";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

// Styled Components
const TriggerButton = styled(Button)`
  height: 32px;
  width: auto;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
`;

const ChevronIcon = styled(ChevronDown)`
  width: 16px;
  height: 16px;
  margin-left: 8px;
`;

const DropdownMenuItemStyled = styled(DropdownMenuItem)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  font-size: 14px;
  
  &:hover {
    background-color: ${props => props.theme.colors.neutral100};
  }
  
  &:focus {
    background-color: ${props => props.theme.colors.neutral100};
  }
`;

const CheckIcon = styled(Check)`
  width: 16px;
  height: 16px;
  margin-left: auto;
  color: ${props => props.theme.colors.primary500};
`;

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

  const activeItem = items.find((k: any) => k.isActive());

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={isDisabled} asChild>
        <ToolbarButton
          tooltip="Text Heading"
          aria-label="Text Heading"
          disabled={isDisabled}
          asChild
        >
          <TriggerButton variant="ghost" size="sm">
            {activeItem?.title || "Paragraph"}
            <ChevronIcon />
          </TriggerButton>
        </ToolbarButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        loop
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <DropdownMenuGroup>
          {items.map((option, index) => (
            <DropdownMenuItemStyled
              onSelect={() => {
                option.action();
              }}
              key={index}
            >
              {option.title}
              {option.isActive() && <CheckIcon />}
            </DropdownMenuItemStyled>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
import type { Extension } from "@tiptap/core";
import type { ColorOptions } from "@tiptap/extension-color";
import type { HighlightOptions } from "@tiptap/extension-highlight";
import { Check, ChevronDown } from "lucide-react";
import { useEditorContext } from "../partials/editor-provider";
import { Separator } from "../../ui/separator";
import ToolbarButton from "../partials/toolbar-button";
import { Popover, ScrollArea } from "@strapi/design-system";
import styled from "styled-components";

export type TextStylingExtensions =
  | Extension<ColorOptions, any>
  | Extension<HighlightOptions, any>;

const TEXT_COLORS = [
  { name: "Default", color: "inherit" },
  { name: "Gray", color: "#6B7280" },
  { name: "Brown", color: "#92400E" },
  { name: "Orange", color: "#EA580C" },
  { name: "Yellow", color: "#CA8A04" },
  { name: "Green", color: "#16A34A" },
  { name: "Blue", color: "#2563EB" },
  { name: "Purple", color: "#9333EA" },
  { name: "Pink", color: "#DB2777" },
  { name: "Red", color: "#DC2626" },
];

const HIGHLIGHT_COLORS = [
  { name: "Default", color: "transparent" },
  { name: "Gray", color: "#F3F4F6" },
  { name: "Brown", color: "#FEF3C7" },
  { name: "Orange", color: "#FFEDD5" },
  { name: "Yellow", color: "#FEF9C3" },
  { name: "Green", color: "#DCFCE7" },
  { name: "Blue", color: "#DBEAFE" },
  { name: "Purple", color: "#F3E8FF" },
  { name: "Pink", color: "#FCE7F3" },
  { name: "Red", color: "#FEE2E2" },
];

// Styled Components
const ColorHighlightButton = styled.button<{ $isActive?: boolean }>`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 14px;
  border: none;
  background: transparent;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.neutral100};
  }
  
  ${props => props.$isActive && `
    background-color: ${props.theme.colors.neutral150};
  `}
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ColorSample = styled.div<{ $color?: string; $isHighlight?: boolean }>`
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.neutral300};
  padding: 2px 4px;
  font-weight: 500;
  font-size: 12px;
  
  ${props => props.$isHighlight ? 
    `background-color: ${props.$color}; color: ${props.theme.colors.neutral800};` : 
    `color: ${props.$color}; background-color: transparent;`
  }
`;

const CheckIcon = styled(Check)`
  width: 16px;
  height: 16px;
  color: ${props => props.theme.colors.primary500};
`;

const SectionTitle = styled.div`
  margin: 8px 0 10px 0;
  padding: 0 8px;
  font-size: 12px;
  color: ${props => props.theme.colors.neutral600};
`;

const ChevronIcon = styled(ChevronDown)`
  width: 16px;
  height: 16px;
  margin-left: 8px;
`;

const ToolbarContent = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TextSample = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const PopoverContent = styled(Popover.Content)`
  background-color: ${props => props.theme.colors.neutral0};
  border: 1px solid ${props => props.theme.colors.neutral300};
  border-radius: 6px;
  padding: 4px;
  width: 224px;
  box-shadow: ${props => props.theme.shadows.popupShadow};
`;

const ScrollAreaStyled = styled(ScrollArea)`
  max-height: 320px;
  padding-right: 8px;
`;

const SeparatorStyled = styled(Separator)`
  margin: 12px 0;
`;

interface ColorHighlightButtonProps {
  name: string;
  color: string;
  isActive: boolean;
  onClick: () => void;
  isHighlight?: boolean;
}

const ColorHighlightButtonComponent = ({
  name,
  color,
  isActive,
  onClick,
  isHighlight,
}: ColorHighlightButtonProps) => (
  <ColorHighlightButton
    $isActive={isActive}
    onClick={onClick}
    type="button"
  >
    <ButtonContent>
      <ColorSample $color={color} $isHighlight={isHighlight}>
        A
      </ColorSample>
      <span>{name}</span>
    </ButtonContent>
    {isActive && <CheckIcon />}
  </ColorHighlightButton>
);

export const ColorAndHighlightToolbar = () => {
  const { editor } = useEditorContext();

  const currentColor = editor?.getAttributes("textStyle").color;
  const currentHighlight = editor?.getAttributes("highlight").color;

  const handleSetColor = (color: string) => {
    editor
      ?.chain()
      .focus()
      .setColor(color === currentColor ? "" : color)
      .run();
  };

  const handleSetHighlight = (color: string) => {
    editor
      ?.chain()
      .focus()
      .setHighlight(color === currentHighlight ? { color: "" } : { color })
      .run();
  };

  const isDisabled =
    !editor?.can().chain().setHighlight().run() ||
    !editor?.can().chain().setColor("").run();

  return (
    <Popover.Root>
      <div style={{ position: 'relative', height: '100%' }}>
        <Popover.Trigger disabled={isDisabled}>
          <ToolbarButton
            tooltip="Text Color & Highlight"
            aria-label="Set color & highlight"
            style={{
              color: currentColor,
              backgroundColor: currentHighlight,
            }}
          >
            <ToolbarContent>
              <TextSample>A</TextSample>
              <ChevronIcon />
            </ToolbarContent>
          </ToolbarButton>
        </Popover.Trigger>

        <PopoverContent align="start">
          <ScrollAreaStyled>
            <SectionTitle>Color</SectionTitle>
            {TEXT_COLORS.map(({ name, color }) => (
              <ColorHighlightButtonComponent
                key={name}
                name={name}
                color={color}
                isActive={currentColor === color}
                onClick={() => handleSetColor(color)}
              />
            ))}

            <SeparatorStyled />

            <SectionTitle>Background</SectionTitle>
            {HIGHLIGHT_COLORS.map(({ name, color }) => (
              <ColorHighlightButtonComponent
                key={name}
                name={name}
                color={color}
                isActive={currentHighlight === color}
                onClick={() => handleSetHighlight(color)}
                isHighlight
              />
            ))}
          </ScrollAreaStyled>
        </PopoverContent>
      </div>
    </Popover.Root>
  );
};
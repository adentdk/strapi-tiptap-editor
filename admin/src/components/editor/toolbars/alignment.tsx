import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Check,
  ChevronDown,
} from "lucide-react";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../ui/tooltip";
import { useEditorContext } from "../partials/editor-provider";
import styled from "styled-components";

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

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  margin-right: 8px;
`;

const ChevronIcon = styled(ChevronDown)`
  margin-left: 8px;
  width: 16px;
  height: 16px;
`;

const DropdownMenuGroupStyled = styled(DropdownMenuGroup)`
  width: 160px;
`;

const DropdownMenuItemStyled = styled(DropdownMenuItem)`
  display: flex;
  align-items: center;
  gap: 8px;
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
  margin-left: auto;
  width: 16px;
  height: 16px;
  color: ${props => props.theme.colors.primary500};
`;

const StyledTooltipContent = styled(TooltipContent)`
  background-color: ${props => props.theme.colors.neutral800};
  color: ${props => props.theme.colors.neutral0};
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 12px;
`;

const OptionIcon = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AlignmentTooolbar = () => {
  const { editor } = useEditorContext();
  const handleAlign = (value: string) => {
    editor?.chain().focus().setTextAlign(value).run();
  };

  const isDisabled =
    (editor?.isActive("image") || editor?.isActive("video") || !editor) ??
    false;

  const currentTextAlign = () => {
    if (editor?.isActive({ textAlign: "left" })) {
      return "left";
    }
    if (editor?.isActive({ textAlign: "center" })) {
      return "center";
    }
    if (editor?.isActive({ textAlign: "right" })) {
      return "right";
    }
    if (editor?.isActive({ textAlign: "justify" })) {
      return "justify";
    }

    return "left";
  };

  const alignmentOptions = [
    {
      name: "Left Align",
      value: "left",
      icon: <AlignLeft width={16} height={16} />,
    },
    {
      name: "Center Align",
      value: "center",
      icon: <AlignCenter width={16} height={16} />,
    },
    {
      name: "Right Align",
      value: "right",
      icon: <AlignRight width={16} height={16} />,
    },
    {
      name: "Justify Align",
      value: "justify",
      icon: <AlignJustify width={16} height={16} />,
    },
  ];

  const findIndex = (value: string) => {
    return alignmentOptions.findIndex((option) => option.value === value);
  };

  const currentAlignment = currentTextAlign();
  const currentOption = alignmentOptions[findIndex(currentAlignment)];

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger disabled={isDisabled} asChild>
            <TriggerButton variant="ghost" size="sm">
              <IconWrapper>
                {currentOption.icon}
              </IconWrapper>
              {currentOption.name}
              <ChevronIcon />
            </TriggerButton>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <StyledTooltipContent>Text Alignment</StyledTooltipContent>
      </Tooltip>
      <DropdownMenuContent
        loop
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <DropdownMenuGroupStyled>
          {alignmentOptions.map((option, index) => (
            <DropdownMenuItemStyled
              onSelect={() => {
                handleAlign(option.value);
              }}
              key={index}
            >
              <OptionIcon>
                {option.icon}
              </OptionIcon>
              {option.name}

              {option.value === currentAlignment && (
                <CheckIcon />
              )}
            </DropdownMenuItemStyled>
          ))}
        </DropdownMenuGroupStyled>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
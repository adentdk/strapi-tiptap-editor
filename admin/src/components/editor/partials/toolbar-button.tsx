import { forwardRef } from "react";
import type { TooltipContentProps } from "@radix-ui/react-tooltip";
import { Toggle } from "../../ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../ui/tooltip";
import styled from "styled-components";

export interface ToolbarButtonProps
  extends React.ComponentPropsWithoutRef<typeof Toggle> {
  isActive?: boolean;
  tooltip?: React.ReactNode;
  tooltipOptions?: TooltipContentProps;
}

// Styled Components
const StyledToggle = styled(Toggle)<{ $isActive?: boolean }>`
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${props => props.$isActive && `
    background-color: ${props.theme.colors.neutral100};
  `}
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.neutral150};
  }
`;

const StyledTooltipContent = styled(TooltipContent)`
  background-color: ${props => props.theme.colors.neutral800};
  color: ${props => props.theme.colors.neutral0};
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 12px;
`;

export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  (
    { isActive, children, tooltip, className, tooltipOptions, ...props },
    ref,
  ) => {
    const toggleButton = (
      <StyledToggle
        size="sm"
        ref={ref}
        $isActive={isActive}
        {...props}
      >
        {children}
      </StyledToggle>
    );

    if (!tooltip) {
      return toggleButton;
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{toggleButton}</TooltipTrigger>
        <StyledTooltipContent {...tooltipOptions}>
          {typeof tooltip === "string" ? <span>{tooltip}</span> : tooltip}
        </StyledTooltipContent>
      </Tooltip>
    );
  },
);

ToolbarButton.displayName = "ToolbarButton";

export default ToolbarButton;
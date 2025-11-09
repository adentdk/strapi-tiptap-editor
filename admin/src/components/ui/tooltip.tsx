import { forwardRef } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import styled, { keyframes } from "styled-components";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const zoomIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const zoomOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
`;

const slideInFromTop = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInFromBottom = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled Components
const StyledContent = styled(TooltipPrimitive.Content)`
  z-index: 50;
  overflow: hidden;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.colors.neutral200};
  background-color: ${props => props.theme.colors.neutral0};
  color: ${props => props.theme.colors.neutral800};
  padding: 6px 12px;
  font-size: 14px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

  &[data-state="open"] {
    animation: ${fadeIn} 0.1s ease-out, ${zoomIn} 0.1s ease-out;
  }

  &[data-state="closed"] {
    animation: ${fadeOut} 0.1s ease-in, ${zoomOut} 0.1s ease-in;
  }

  &[data-side="bottom"] {
    &[data-state="open"] {
      animation: ${fadeIn} 0.1s ease-out, ${zoomIn} 0.1s ease-out, ${slideInFromTop} 0.1s ease-out;
    }
  }

  &[data-side="left"] {
    &[data-state="open"] {
      animation: ${fadeIn} 0.1s ease-out, ${zoomIn} 0.1s ease-out, ${slideInFromRight} 0.1s ease-out;
    }
  }

  &[data-side="right"] {
    &[data-state="open"] {
      animation: ${fadeIn} 0.1s ease-out, ${zoomIn} 0.1s ease-out, ${slideInFromLeft} 0.1s ease-out;
    }
  }

  &[data-side="top"] {
    &[data-state="open"] {
      animation: ${fadeIn} 0.1s ease-out, ${zoomIn} 0.1s ease-out, ${slideInFromBottom} 0.1s ease-out;
    }
  }
`;

const TooltipContent = forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ sideOffset = 4, ...props }, ref) => (
  <StyledContent
    ref={ref}
    sideOffset={sideOffset}
    {...props}
  />
));

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
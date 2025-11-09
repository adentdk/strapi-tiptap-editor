import { forwardRef } from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import styled, { css } from "styled-components";

interface ToggleProps extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> {
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
}

const StyledToggle = styled(TogglePrimitive.Root)<{
  $variant?: "default" | "outline";
  $size?: "default" | "sm" | "lg";
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  gap: 8px;
  
  /* Focus styles */
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 1px ${props => props.theme.colors.primary500};
  }
  
  /* Disabled state */
  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
  
  /* SVG styles */
  & svg {
    pointer-events: none;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
  
  /* Active state */
  &[data-state="on"] {
    background-color: ${props => props.theme.colors.neutral100};
    color: ${props => props.theme.colors.neutral900};
  }
  
  /* Variant styles */
  ${props => {
    switch (props.$variant) {
      case "default":
        return css`
          background-color: transparent;
          color: ${props.theme.colors.neutral700};
          
          &:hover:not(:disabled) {
            background-color: ${props.theme.colors.neutral100};
            color: ${props.theme.colors.neutral800};
          }
        `;
      case "outline":
        return css`
          border: 1px solid ${props.theme.colors.neutral300};
          background-color: transparent;
          color: ${props.theme.colors.neutral700};
          
          &:hover:not(:disabled) {
            background-color: ${props.theme.colors.neutral100};
            color: ${props.theme.colors.neutral800};
          }
        `;
      default:
        return css`
          background-color: transparent;
          color: ${props.theme.colors.neutral700};
          
          &:hover:not(:disabled) {
            background-color: ${props.theme.colors.neutral100};
            color: ${props.theme.colors.neutral800};
          }
        `;
    }
  }}
  
  /* Size styles */
  ${props => {
    switch (props.$size) {
      case "default":
        return css`
          height: 40px;
          padding: 0 12px;
          min-width: 40px;
        `;
      case "sm":
        return css`
          height: 36px;
          padding: 0 10px;
          min-width: 36px;
        `;
      case "lg":
        return css`
          height: 44px;
          padding: 0 20px;
          min-width: 44px;
        `;
      default:
        return css`
          height: 40px;
          padding: 0 12px;
          min-width: 40px;
        `;
    }
  }}
`;

const Toggle = forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(({ variant = "default", size = "default", ...props }, ref) => (
  <StyledToggle
    ref={ref}
    $variant={variant}
    $size={size}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

// Export untuk kompatibilitas (jika masih diperlukan)
const toggleVariants = {
  default: "default",
  outline: "outline",
  sizes: {
    default: "default",
    sm: "sm",
    lg: "lg"
  }
};

export { Toggle, toggleVariants };
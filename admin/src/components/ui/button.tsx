import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import styled, { css } from "styled-components";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const StyledButton = styled.button<{
  $variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  $size?: "default" | "sm" | "lg" | "icon";
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  border: none;
  cursor: pointer;
  outline: none;
  
  &:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 1px;
    box-shadow: 0 0 0 1px var(--ring);
  }
  
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

  /* Variant styles */
  ${props => {
    switch (props.$variant) {
      case "default":
        return css`
          background-color: var(--primary);
          color: var(--primary-foreground);
          &:hover:not(:disabled) {
            background-color: var(--primary-hover);
          }
        `;
      case "destructive":
        return css`
          background-color: var(--destructive);
          color: var(--destructive-foreground);
          &:hover:not(:disabled) {
            background-color: var(--destructive-hover);
          }
        `;
      case "outline":
        return css`
          border: 1px solid var(--border);
          background-color: var(--background);
          color: var(--foreground);
          &:hover:not(:disabled) {
            background-color: var(--accent);
            color: var(--accent-foreground);
          }
        `;
      case "secondary":
        return css`
          background-color: var(--secondary);
          color: var(--secondary-foreground);
          &:hover:not(:disabled) {
            background-color: var(--secondary-hover);
          }
        `;
      case "ghost":
        return css`
          background-color: transparent;
          color: var(--foreground);
          &:hover:not(:disabled) {
            background-color: var(--accent);
            color: var(--accent-foreground);
          }
        `;
      case "link":
        return css`
          background-color: transparent;
          color: var(--primary);
          text-decoration: none;
          text-underline-offset: 4px;
          &:hover:not(:disabled) {
            text-decoration: underline;
          }
        `;
      default:
        return css`
          background-color: var(--primary);
          color: var(--primary-foreground);
          &:hover:not(:disabled) {
            background-color: var(--primary-hover);
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
          padding: 8px 16px;
        `;
      case "sm":
        return css`
          height: 36px;
          border-radius: 6px;
          padding: 0 12px;
          font-size: 13px;
        `;
      case "lg":
        return css`
          height: 44px;
          border-radius: 6px;
          padding: 0 32px;
          font-size: 15px;
        `;
      case "icon":
        return css`
          height: 40px;
          width: 40px;
          padding: 0;
        `;
      default:
        return css`
          height: 40px;
          padding: 8px 16px;
        `;
    }
  }}
`;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : StyledButton;
    
    if (asChild) {
      return (
        <Comp
          ref={ref}
          {...props}
        />
      );
    }

    return (
      <Comp
        $variant={variant}
        $size={size}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
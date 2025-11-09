import { forwardRef } from "react";
import styled from "styled-components";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: string) => void;
}

const StyledInput = styled.input`
  display: flex;
  width: 100%;
  height: 40px;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.colors.neutral300};
  background-color: ${props => props.theme.colors.neutral0};
  padding: 8px 12px;
  font-size: 14px;
  color: ${props => props.theme.colors.neutral800};
  transition: all 0.2s ease-in-out;
  
  &::placeholder {
    color: ${props => props.theme.colors.neutral500};
  }
  
  &:focus-visible {
    outline: none;
    border-color: ${props => props.theme.colors.primary500};
    box-shadow: 0 0 0 1px ${props => props.theme.colors.primary500};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    background-color: ${props => props.theme.colors.neutral100};
  }
  
  /* File input styles */
  &::file-selector-button {
    border: none;
    background-color: transparent;
    font-size: 14px;
    font-weight: 500;
  }
`;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type, onChange, onValueChange, ...props }, ref) => {
    return (
      <StyledInput
        type={type}
        onChange={(e) => {
          onChange?.(e);
          onValueChange?.(e.target.value);
        }}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
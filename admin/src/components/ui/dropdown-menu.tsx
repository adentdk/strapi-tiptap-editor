import { forwardRef } from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import styled, { css } from "styled-components";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

// Styled components
const ContentStyles = css`
  z-index: 50;
  min-width: 8rem;
  overflow: hidden;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.colors.neutral200};
  background-color: ${props => props.theme.colors.neutral0};
  color: ${props => props.theme.colors.neutral800};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 4px;

  &[data-state="open"] {
    animation: fadeIn 0.1s ease-out;
  }

  &[data-state="closed"] {
    animation: fadeOut 0.1s ease-in;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.95);
    }
  }
`;

const ItemStyles = css`
  position: relative;
  display: flex;
  cursor: default;
  user-select: none;
  align-items: center;
  gap: 8px;
  border-radius: 3px;
  padding: 6px 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.1s ease-in-out;

  &:focus {
    background-color: ${props => props.theme.colors.neutral100};
    color: ${props => props.theme.colors.neutral900};
  }

  &[data-disabled] {
    pointer-events: none;
    opacity: 0.5;
  }

  & svg {
    pointer-events: none;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

// SubTrigger
const StyledSubTrigger = styled(DropdownMenuPrimitive.SubTrigger)<{ $inset?: boolean }>`
  ${ItemStyles}
  ${props => props.$inset && "padding-left: 32px;"}

  & > svg:last-child {
    margin-left: auto;
  }
`;

const DropdownMenuSubTrigger = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ inset, children, ...props }, ref) => (
  <StyledSubTrigger ref={ref} $inset={inset} {...props}>
    {children}
    <ChevronRight style={{ width: '16px', height: '16px' }} />
  </StyledSubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

// SubContent
const StyledSubContent = styled(DropdownMenuPrimitive.SubContent)`
  ${ContentStyles}
`;

const DropdownMenuSubContent = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>((props, ref) => (
  <StyledSubContent ref={ref} {...props} />
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

// Content
const StyledContent = styled(DropdownMenuPrimitive.Content)`
  ${ContentStyles}
`;

const DropdownMenuContent = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <StyledContent ref={ref} sideOffset={sideOffset} {...props} />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

// Item
const StyledItem = styled(DropdownMenuPrimitive.Item)<{ $inset?: boolean }>`
  ${ItemStyles}
  ${props => props.$inset && "padding-left: 32px;"}
`;

const DropdownMenuItem = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ inset, ...props }, ref) => (
  <StyledItem ref={ref} $inset={inset} {...props} />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

// CheckboxItem
const StyledCheckboxItem = styled(DropdownMenuPrimitive.CheckboxItem)`
  ${ItemStyles}
  padding-left: 32px;
  padding-right: 8px;
`;

const CheckboxIndicator = styled(DropdownMenuPrimitive.ItemIndicator)`
  position: absolute;
  left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
`;

const StyledCheck = styled(Check)`
  width: 16px;
  height: 16px;
`;

const DropdownMenuCheckboxItem = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ children, checked, ...props }, ref) => (
  <StyledCheckboxItem ref={ref} checked={checked} {...props}>
    <CheckboxIndicator>
      <StyledCheck />
    </CheckboxIndicator>
    {children}
  </StyledCheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

// RadioItem
const StyledRadioItem = styled(DropdownMenuPrimitive.RadioItem)`
  ${ItemStyles}
  padding-left: 32px;
  padding-right: 8px;
`;

const RadioIndicator = styled(DropdownMenuPrimitive.ItemIndicator)`
  position: absolute;
  left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
`;

const StyledCircle = styled(Circle)`
  width: 8px;
  height: 8px;
  fill: currentColor;
`;

const DropdownMenuRadioItem = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ children, ...props }, ref) => (
  <StyledRadioItem ref={ref} {...props}>
    <RadioIndicator>
      <StyledCircle />
    </RadioIndicator>
    {children}
  </StyledRadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

// Label
const StyledLabel = styled(DropdownMenuPrimitive.Label)<{ $inset?: boolean }>`
  padding: 6px 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.neutral600};
  ${props => props.$inset && "padding-left: 32px;"}
`;

const DropdownMenuLabel = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ inset, ...props }, ref) => (
  <StyledLabel ref={ref} $inset={inset} {...props} />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

// Separator
const StyledSeparator = styled(DropdownMenuPrimitive.Separator)`
  margin: 4px -4px;
  height: 1px;
  background-color: ${props => props.theme.colors.neutral200};
`;

const DropdownMenuSeparator = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>((props, ref) => (
  <StyledSeparator ref={ref} {...props} />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

// Shortcut
const Shortcut = styled.span`
  margin-left: auto;
  font-size: 12px;
  letter-spacing: 0.05em;
  opacity: 0.6;
`;

const DropdownMenuShortcut = ({
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return <Shortcut {...props} />;
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
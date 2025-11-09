import { forwardRef } from "react";
import { Root as LabelPrimitiveRoot } from "@radix-ui/react-label";
import styled from "styled-components";

const StyledLabel = styled(LabelPrimitiveRoot)`
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  
  &.peer-disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const MandatorySpan = styled.span`
  color: ${props => props.theme.colors.danger500};
`;

const OptionalSpan = styled.span`
  color: ${props => props.theme.colors.neutral500};
`;

interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitiveRoot> {
  mandatory?: boolean;
  optional?: boolean;
}

const Label = forwardRef<
  React.ElementRef<typeof LabelPrimitiveRoot>,
  LabelProps
>(({ children, mandatory, optional, ...props }, ref) => (
  <StyledLabel ref={ref} {...props}>
    {children}
    {mandatory ? <MandatorySpan>&nbsp;*</MandatorySpan> : null}
    {optional ? <OptionalSpan>&nbsp;(opsional)</OptionalSpan> : null}
  </StyledLabel>
));

Label.displayName = LabelPrimitiveRoot.displayName;

export { Label };
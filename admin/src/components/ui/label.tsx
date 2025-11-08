import { forwardRef } from "react";

import { Root as LabelPrimitiveRoot } from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/src/utils/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

const Label = forwardRef<
  React.ElementRef<typeof LabelPrimitiveRoot>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitiveRoot> &
    VariantProps<typeof labelVariants> & {
      mandatory?: boolean;
      optional?: boolean;
    }
>(({ className, children, mandatory, ...props }, ref) => (
  <LabelPrimitiveRoot
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  >
    {children}
    {mandatory ? <span className="text-destructive">&nbsp;*</span> : null}
    {props.optional ? (
      <span className="text-muted-foreground">&nbsp;(opsional)</span>
    ) : null}
  </LabelPrimitiveRoot>
));
Label.displayName = LabelPrimitiveRoot.displayName;

export { Label };

import { forwardRef, type LabelHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        className={cn("block", s.textLabel, "mb-1.5", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Label.displayName = "Label";

export { Label };
export type { LabelProps };

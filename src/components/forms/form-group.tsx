"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

type FormGroupProps = HTMLAttributes<HTMLFieldSetElement> & {
  /** Legend text for the fieldset. */
  legend?: string;
  /** Optional description below the legend. */
  description?: string;
  children: ReactNode;
  className?: string;
  /** Additional classes for the legend element. */
  legendClassName?: string;
};

const FormGroup = forwardRef<HTMLFieldSetElement, FormGroupProps>(
  ({ legend, description, children, className, legendClassName, ...props }, ref) => {
    return (
      <fieldset
        ref={ref}
        className={cn(
          "rounded-xl border border-muted p-4 space-y-4",
          className,
        )}
        {...props}
      >
        {legend && (
          <legend
            className={cn(
              "px-2 text-sm font-semibold text-navy-text",
              legendClassName,
            )}
          >
            {legend}
          </legend>
        )}
        {description && (
          <p className="text-xs text-muted-foreground -mt-2">{description}</p>
        )}
        {children}
      </fieldset>
    );
  },
);
FormGroup.displayName = "FormGroup";

export { FormGroup };
export type { FormGroupProps };

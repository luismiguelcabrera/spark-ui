"use client";

import { forwardRef, type LabelHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

type FieldLabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  children: ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
};

const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ children, required, className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn("text-sm font-medium text-navy-text", className)}
        {...props}
      >
        {children}
        {required && (
          <span className="text-destructive ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>
    );
  },
);
FieldLabel.displayName = "FieldLabel";

export { FieldLabel };
export type { FieldLabelProps };

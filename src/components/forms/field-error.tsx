"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

type FieldErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  className?: string;
};

const FieldError = forwardRef<HTMLParagraphElement, FieldErrorProps>(
  ({ children, className, ...props }, ref) => {
    if (!children) return null;

    return (
      <p
        ref={ref}
        role="alert"
        className={cn("text-xs text-destructive mt-1", className)}
        {...props}
      >
        {children}
      </p>
    );
  },
);
FieldError.displayName = "FieldError";

export { FieldError };
export type { FieldErrorProps };

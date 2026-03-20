"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { useFormContext } from "./form-context";

type FormErrorProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children?: ReactNode | ((error: string) => ReactNode);
  className?: string;
};

const FormError = forwardRef<HTMLDivElement, FormErrorProps>(
  ({ children, className, ...props }, ref) => {
    const { formError } = useFormContext();

    if (!formError) return null;

    // Render prop — full control over error rendering
    if (typeof children === "function") {
      return (
        <div ref={ref} className={cn(className)} {...props}>
          {children(formError)}
        </div>
      );
    }

    // Default — plain text with role="alert"
    return (
      <p
        ref={ref as React.Ref<HTMLParagraphElement>}
        role="alert"
        className={cn("text-sm text-destructive font-medium", className)}
        {...props}
      >
        {formError}
      </p>
    );
  },
);
FormError.displayName = "FormError";

export { FormError };
export type { FormErrorProps };

"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { useFormContext } from "./form-context";
import { Alert } from "../feedback/alert";

type FormErrorProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

const FormError = forwardRef<HTMLDivElement, FormErrorProps>(
  ({ className, ...props }, ref) => {
    const { formError } = useFormContext();

    if (!formError) return null;

    return (
      <Alert
        ref={ref}
        variant="error"
        className={cn(className)}
        {...props}
      >
        {formError}
      </Alert>
    );
  },
);
FormError.displayName = "FormError";

export { FormError };
export type { FormErrorProps };

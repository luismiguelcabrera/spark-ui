"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { useFormContext } from "./form-context";
import { useFormFieldContext } from "./form-context";

type FormMessageProps = HTMLAttributes<HTMLParagraphElement> & {
  name?: string;
  className?: string;
};

const FormMessage = forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ name: nameProp, className, ...props }, ref) => {
    const { form } = useFormContext();
    const fieldCtx = useFormFieldContext();

    const fieldName = nameProp ?? fieldCtx?.name;
    if (!fieldName) return null;

    const state = form.getFieldState(fieldName);
    if (!state.error) return null;

    return (
      <p
        ref={ref}
        role="alert"
        className={cn("text-xs text-red-600 mt-1", className)}
        {...props}
      >
        {state.error}
      </p>
    );
  },
);
FormMessage.displayName = "FormMessage";

export { FormMessage };
export type { FormMessageProps };

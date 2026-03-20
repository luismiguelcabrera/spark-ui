"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { useFormContext } from "./form-context";
import { Button } from "./button";

type FormSubmitProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  children?: ReactNode;
  disableWhenInvalid?: boolean;
  className?: string;
};

const FormSubmit = forwardRef<HTMLButtonElement, FormSubmitProps>(
  ({ children, disableWhenInvalid = false, disabled, className, ...props }, ref) => {
    const { form } = useFormContext();
    const isSubmitting = form.isSubmitting;
    const shouldDisable =
      disabled || isSubmitting || (disableWhenInvalid && !form.isValid);

    return (
      <Button
        ref={ref}
        type="submit"
        loading={isSubmitting}
        disabled={shouldDisable}
        className={cn(className)}
        {...props}
      >
        {children ?? "Submit"}
      </Button>
    );
  },
);
FormSubmit.displayName = "FormSubmit";

export { FormSubmit };
export type { FormSubmitProps };

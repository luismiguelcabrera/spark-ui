"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { useFormContext } from "./form-context";
import { Button } from "./button";

type FormResetProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "onClick"
> & {
  children?: ReactNode;
  /** Show a confirm dialog before resetting. `true` uses a default message, a string uses a custom message. */
  confirm?: boolean | string;
  className?: string;
};

const FormReset = forwardRef<HTMLButtonElement, FormResetProps>(
  ({ children, confirm, className, ...props }, ref) => {
    const { form } = useFormContext();

    const handleClick = () => {
      if (confirm) {
        const message =
          typeof confirm === "string"
            ? confirm
            : "Are you sure you want to reset the form?";
        if (!window.confirm(message)) return;
      }
      form.reset();
    };

    return (
      <Button
        ref={ref}
        type="button"
        variant="outline"
        onClick={handleClick}
        className={cn(className)}
        {...props}
      >
        {children ?? "Reset"}
      </Button>
    );
  },
);
FormReset.displayName = "FormReset";

export { FormReset };
export type { FormResetProps };

"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  error?: string;
};

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error, id, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="flex flex-col gap-1.5">
        <div className="relative">
          <input
            id={id}
            type={visible ? "text" : "password"}
            aria-invalid={error ? true : undefined}
            aria-describedby={error && id ? `${id}-error` : undefined}
            className={cn(
              s.inputBase,
              "pr-12",
              s.inputFocus,
              s.inputDisabled,
              "transition-colors duration-150",
              error && "border-destructive/50 focus:border-destructive focus:ring-destructive/20",
              className
            )}
            ref={ref}
            {...props}
          />
          <button
            type="button"
            tabIndex={-1}
            aria-label={visible ? "Hide password" : "Show password"}
            onClick={() => setVisible((v) => !v)}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy-text",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
            )}
          >
            <Icon name={visible ? "visibility_off" : "visibility"} size="md" />
          </button>
        </div>
        {error && (
          <p id={id ? `${id}-error` : undefined} className="text-xs text-destructive font-medium" role="alert">{error}</p>
        )}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
export type { PasswordInputProps };

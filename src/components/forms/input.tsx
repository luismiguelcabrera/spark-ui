import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";
import { Label } from "./label";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  icon?: string;
  iconPosition?: "left" | "right";
  error?: string;
  hint?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      icon,
      iconPosition = "right",
      error,
      hint,
      id: idProp,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const id = idProp ?? (label ? autoId : undefined);

    // Simple mode: no wrapper props — render raw input
    if (!label && !icon && !error && !hint) {
      return (
        <input
          id={id}
          type={type}
          className={cn(s.inputBase, s.inputFocus, s.inputDisabled, className)}
          ref={ref}
          {...props}
        />
      );
    }

    return (
      <div className="flex flex-col gap-1.5">
        {label && <Label htmlFor={id}>{label}</Label>}
        <div className="relative group">
          {icon && iconPosition === "left" && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Icon
                name={icon}
                size="md"
                className={cn(
                  "text-slate-400 group-focus-within:text-primary transition-colors",
                  error && "text-red-400 group-focus-within:text-red-500"
                )}
              />
            </div>
          )}
          <input
            id={id}
            type={type}
            className={cn(
              s.inputBase,
              s.inputFocus,
              s.inputDisabled,
              icon && iconPosition === "left" && "pl-11",
              icon && iconPosition === "right" && "pr-11",
              error && "border-red-300 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            ref={ref}
            {...props}
          />
          {icon && iconPosition === "right" && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
              <Icon
                name={icon}
                size="md"
                className={cn(
                  "text-slate-400 group-focus-within:text-primary transition-colors",
                  error && "text-red-400 group-focus-within:text-red-500"
                )}
              />
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500 font-medium">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-slate-400">{hint}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
export type { InputProps };

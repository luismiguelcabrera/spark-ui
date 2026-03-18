import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Label } from "./label";
import { Input } from "./input";
import { Icon } from "../data-display/icon";

type FormFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "children"> & {
  label: string;
  icon?: string;
  iconPosition?: "left" | "right";
  error?: string;
  hint?: string;
  children?: ReactNode;
  className?: string;
};

function FormField({
  label,
  icon,
  iconPosition = "right",
  error,
  hint,
  children,
  className,
  id: idProp,
  ...inputProps
}: FormFieldProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint && !error ? `${id}-hint` : undefined;

  // When children provided, wrap them with label/error/hint
  if (children) {
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        <Label htmlFor={id}>{label}</Label>
        <div className="relative group">
          {icon && iconPosition === "left" && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
              <Icon
                name={icon}
                size="md"
                className={cn(
                  "text-slate-400 group-focus-within:text-primary transition-colors",
                  error && "text-red-400"
                )}
              />
            </div>
          )}
          {children}
          {icon && iconPosition === "right" && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none z-10">
              <Icon
                name={icon}
                size="md"
                className={cn(
                  "text-slate-400 group-focus-within:text-primary transition-colors",
                  error && "text-red-400"
                )}
              />
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-xs text-red-500 font-medium" role="alert">{error}</p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-xs text-slate-400">{hint}</p>
        )}
      </div>
    );
  }

  // Default: render Input with pass-through props
  return (
    <div className={className}>
      <Input
        id={id}
        label={label}
        icon={icon}
        iconPosition={iconPosition}
        error={error}
        hint={hint}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId ?? hintId}
        {...inputProps}
      />
    </div>
  );
}
FormField.displayName = "FormField";

export { FormField };
export type { FormFieldProps };

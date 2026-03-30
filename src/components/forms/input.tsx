import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";
import { Label } from "./label";
import { Spinner } from "../feedback/spinner";

type InputVariant = "outlined" | "filled" | "underlined";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  icon?: string;
  iconPosition?: "left" | "right";
  error?: string;
  hint?: string;
  /** Visual variant */
  variant?: InputVariant;
  /** Show clear button when input has value */
  clearable?: boolean;
  /** Show loading spinner instead of icon */
  loading?: boolean;
};

const variantStyles: Record<InputVariant, string> = {
  outlined: cn(s.inputBase, s.inputFocus, s.inputDisabled),
  filled: "w-full px-4 h-12 bg-slate-100 border-0 rounded-xl text-sm placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed",
  underlined: "w-full px-4 h-12 bg-transparent border-0 border-b-2 border-slate-200 rounded-none text-sm placeholder:text-slate-400 transition-colors focus:outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed",
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
      variant = "outlined",
      clearable = false,
      loading = false,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const id = idProp ?? (label ? autoId : undefined);

    const hasValue = value !== undefined && value !== "";
    const showClear = clearable && hasValue && !loading;
    const showLoading = loading;

    const handleClear = (e: React.MouseEvent) => {
      e.preventDefault();
      if (onChange) {
        const nativeEvent = new Event("change", { bubbles: true });
        const syntheticEvent = {
          ...nativeEvent,
          target: { ...((ref as React.RefObject<HTMLInputElement>)?.current || {}), value: "" },
          currentTarget: { ...((ref as React.RefObject<HTMLInputElement>)?.current || {}), value: "" },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    // Determine if we need the wrapper (any feature active)
    const needsWrapper = label || icon || error || hint || clearable || loading;

    // Simple mode: no wrapper props -- render raw input
    if (!needsWrapper) {
      return (
        <input
          id={id}
          type={type}
          className={cn(variantStyles[variant], className)}
          ref={ref}
          value={value}
          onChange={onChange}
          {...props}
        />
      );
    }

    // Resolve which icon to show on the right
    const rightHasContent = (icon && iconPosition === "right") || showClear || showLoading;
    const leftHasContent = icon && iconPosition === "left" && !showLoading;

    return (
      <div className="flex flex-col gap-1.5">
        {label && <Label htmlFor={id}>{label}</Label>}
        <div className="relative group">
          {leftHasContent && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Icon
                name={icon!}
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
              variantStyles[variant],
              leftHasContent && "pl-11",
              rightHasContent && "pr-11",
              error && "border-red-300 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            ref={ref}
            value={value}
            onChange={onChange}
            aria-busy={loading || undefined}
            aria-invalid={error ? true : undefined}
            {...props}
          />
          {rightHasContent && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center gap-1">
              {showLoading ? (
                <Spinner size="xs" color="muted" aria-label="Loading" />
              ) : showClear ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-full hover:bg-slate-100 pointer-events-auto"
                  aria-label="Clear input"
                  tabIndex={-1}
                >
                  <Icon name="close" size="xs" />
                </button>
              ) : icon && iconPosition === "right" ? (
                <Icon
                  name={icon}
                  size="md"
                  className={cn(
                    "text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none",
                    error && "text-red-400 group-focus-within:text-red-500"
                  )}
                />
              ) : null}
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
export type { InputProps, InputVariant };

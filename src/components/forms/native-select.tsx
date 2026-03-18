"use client";

import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { useControllable } from "../../hooks/use-controllable";
import { Icon } from "../data-display/icon";

type NativeSelectSize = "sm" | "md" | "lg";
type NativeSelectVariant = "outline" | "filled" | "unstyled";

type NativeSelectOption = {
  value: string;
  label?: string;
  disabled?: boolean;
};

type NativeSelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "size" | "value" | "defaultValue" | "onChange"
> & {
  /** Available options */
  options: NativeSelectOption[];
  /** Controlled value */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Change callback */
  onChange?: (value: string) => void;
  /** Placeholder option (disabled, shown first) */
  placeholder?: string;
  /** Size variant */
  size?: NativeSelectSize;
  /** Visual variant */
  variant?: NativeSelectVariant;
  /** Error message */
  error?: string;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
  /** Label text */
  label?: string;
  /** Description text below label */
  description?: string;
};

const sizeStyles: Record<NativeSelectSize, string> = {
  sm: "h-9 text-sm px-3 pr-9",
  md: "h-11 text-sm px-4 pr-10",
  lg: "h-12 text-base px-4 pr-10",
};

const variantStyles: Record<NativeSelectVariant, string> = {
  outline: cn(
    "w-full bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 transition-colors appearance-none text-gray-900",
    s.inputFocus,
    s.inputDisabled
  ),
  filled: cn(
    "w-full bg-slate-100 border-0 rounded-xl placeholder:text-slate-400 transition-colors appearance-none text-gray-900",
    "focus:outline-none focus:ring-2 focus:ring-primary focus:bg-slate-50",
    s.inputDisabled
  ),
  unstyled: cn(
    "w-full bg-transparent border-0 rounded-none appearance-none text-gray-900",
    "focus:outline-none",
    s.inputDisabled
  ),
};

const iconSizeMap: Record<NativeSelectSize, "xs" | "sm" | "md"> = {
  sm: "xs",
  md: "sm",
  lg: "md",
};

const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  (
    {
      options,
      value: valueProp,
      defaultValue,
      onChange,
      placeholder,
      size = "md",
      variant = "outline",
      error,
      disabled = false,
      className,
      label,
      description,
      id: idProp,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const id = idProp ?? autoId;
    const errorId = error ? `${id}-error` : undefined;
    const descriptionId = description ? `${id}-description` : undefined;

    const [currentValue, setCurrentValue] = useControllable({
      value: valueProp,
      defaultValue: defaultValue ?? "",
      onChange,
    });

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setCurrentValue(e.target.value);
    };

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className={cn(s.textLabel, disabled && "opacity-50")}
          >
            {label}
          </label>
        )}
        {description && (
          <p
            id={descriptionId}
            className={cn(s.textSecondary, disabled && "opacity-50")}
          >
            {description}
          </p>
        )}
        <div className="relative">
          <select
            id={id}
            ref={ref}
            value={currentValue}
            onChange={handleChange}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              [errorId, descriptionId].filter(Boolean).join(" ") || undefined
            }
            className={cn(
              variantStyles[variant],
              sizeStyles[size],
              error &&
                "border-red-300 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label ?? opt.value}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon name="chevron_down" size={iconSizeMap[size]} />
          </div>
        </div>
        {error && (
          <p id={errorId} className="text-xs text-red-500 font-medium" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
NativeSelect.displayName = "NativeSelect";

export { NativeSelect };
export type { NativeSelectProps, NativeSelectOption, NativeSelectSize, NativeSelectVariant };

"use client";

import { forwardRef, createContext, useContext, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { useControllable } from "../../hooks/use-controllable";

type ToggleGroupType = "single" | "multiple";

type ToggleGroupContextValue = {
  value: string[];
  onToggle: (itemValue: string) => void;
  size: "sm" | "md" | "lg";
  variant: "default" | "outline" | "ghost";
  disabled: boolean;
};

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

type ToggleGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> & {
  /** Selection type */
  type?: ToggleGroupType;
  /** Selected value(s) */
  value?: string | string[];
  /** Default value(s) */
  defaultValue?: string | string[];
  /** Callback when selection changes */
  onValueChange?: (value: string | string[]) => void;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Visual variant */
  variant?: "default" | "outline" | "ghost";
  /** Disabled state */
  disabled?: boolean;
};

const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    {
      className,
      type = "single",
      value: valueProp,
      defaultValue = type === "multiple" ? [] : "",
      onValueChange,
      size = "md",
      variant = "default",
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const normalize = (v: string | string[] | undefined): string[] => {
      if (v === undefined) return [];
      return Array.isArray(v) ? v : v ? [v] : [];
    };

    const [rawValue, setRawValue] = useControllable({
      value: valueProp !== undefined ? normalize(valueProp) : undefined,
      defaultValue: normalize(defaultValue),
      onChange: (next: string[]) => {
        if (onValueChange) {
          onValueChange(type === "single" ? (next[0] ?? "") : next);
        }
      },
    });

    const selectedValues = rawValue;

    const onToggle = (itemValue: string) => {
      if (disabled) return;
      if (type === "single") {
        setRawValue(selectedValues.includes(itemValue) ? [] : [itemValue]);
      } else {
        setRawValue(
          selectedValues.includes(itemValue)
            ? selectedValues.filter((v) => v !== itemValue)
            : [...selectedValues, itemValue]
        );
      }
    };

    return (
      <ToggleGroupContext.Provider value={{ value: selectedValues, onToggle, size, variant, disabled }}>
        <div
          ref={ref}
          role="group"
          className={cn(
            "inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 gap-0.5",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    );
  }
);
ToggleGroup.displayName = "ToggleGroup";

type ToggleGroupItemProps = HTMLAttributes<HTMLButtonElement> & {
  /** Value for this item */
  value: string;
  /** Disabled state for this item */
  disabled?: boolean;
};

const sizeMap = {
  sm: "h-7 px-2 text-xs",
  md: "h-8 px-3 text-sm",
  lg: "h-10 px-4 text-sm",
};

const ToggleGroupItem = forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ className, value, disabled: itemDisabled, children, ...props }, ref) => {
    const context = useContext(ToggleGroupContext);
    if (!context) throw new Error("ToggleGroupItem must be used within ToggleGroup");

    const { value: selectedValues, onToggle, size, disabled: groupDisabled } = context;
    const isSelected = selectedValues.includes(value);
    const isDisabled = itemDisabled || groupDisabled;

    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={isSelected}
        aria-disabled={isDisabled}
        disabled={isDisabled}
        onClick={() => onToggle(value)}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          sizeMap[size],
          isSelected
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-600 hover:text-slate-700 hover:bg-slate-100/50",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };
export type { ToggleGroupProps, ToggleGroupItemProps };

"use client";

import { forwardRef, useCallback, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";
import { useControllable } from "../../hooks/use-controllable";

const radioGroupVariants = cva("flex", {
  variants: {
    variant: {
      basic: "gap-4",
      card: "gap-3",
    },
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row flex-wrap",
    },
  },
  defaultVariants: {
    variant: "basic",
    orientation: "vertical",
  },
});

type RadioOption = {
  label: string;
  value: string;
  description?: string;
  icon?: string;
};

type RadioGroupProps = HTMLAttributes<HTMLDivElement> & {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
} & VariantProps<typeof radioGroupVariants>;

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      options,
      value,
      defaultValue,
      onValueChange,
      name,
      variant = "basic",
      orientation,
      className,
      ...props
    },
    ref
  ) => {
    const [current, setCurrent] = useControllable({
      value,
      defaultValue: defaultValue ?? "",
      onChange: onValueChange,
    });

    const handleSelect = useCallback(
      (optValue: string) => {
        setCurrent(optValue);
      },
      [setCurrent]
    );

    if (variant === "card") {
      return (
        <div
          ref={ref}
          role="radiogroup"
          className={cn(radioGroupVariants({ variant, orientation }), className)}
          {...props}
        >
          {options.map((opt) => {
            const selected = opt.value === current;
            return (
              <label
                key={opt.value}
                className={cn(
                  s.radioCard,
                  "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary",
                  selected ? s.radioCardSelected : s.radioCardUnselected
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      s.radioOuter,
                      "mt-0.5 transition-colors duration-150",
                      selected ? s.radioOuterSelected : s.radioOuterUnselected
                    )}
                  >
                    {selected && <div className={s.radioInner} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {opt.icon && (
                        <Icon name={opt.icon} size="sm" className="text-slate-500" />
                      )}
                      <span className="text-sm font-semibold text-secondary">
                        {opt.label}
                      </span>
                    </div>
                    {opt.description && (
                      <p className="text-xs text-slate-500 mt-1">{opt.description}</p>
                    )}
                  </div>
                </div>
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={selected}
                  onChange={() => handleSelect(opt.value)}
                  className="sr-only"
                />
              </label>
            );
          })}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="radiogroup"
        className={cn(radioGroupVariants({ variant, orientation }), className)}
        {...props}
      >
        {options.map((opt) => {
          const selected = opt.value === current;
          return (
            <label
              key={opt.value}
              className={cn(
                s.radioBase,
                "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary rounded"
              )}
            >
              <div
                className={cn(
                  s.radioOuter,
                  "transition-colors duration-150",
                  selected ? s.radioOuterSelected : s.radioOuterUnselected
                )}
              >
                {selected && <div className={s.radioInner} />}
              </div>
              <span className="text-sm font-medium text-slate-700">
                {opt.label}
              </span>
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={selected}
                onChange={() => handleSelect(opt.value)}
                className="sr-only"
              />
            </label>
          );
        })}
      </div>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

export { RadioGroup, radioGroupVariants };
export type { RadioGroupProps, RadioOption };

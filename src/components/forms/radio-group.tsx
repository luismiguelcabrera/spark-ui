"use client";

import { forwardRef, useCallback, type KeyboardEvent } from "react";
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

type RadioGroupProps = {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  className?: string;
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
    },
    ref
  ) => {
    const [current, setCurrent] = useControllable({
      value,
      defaultValue: defaultValue ?? "",
      onChange: onValueChange,
    });

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        const isVertical = orientation !== "horizontal";
        const nextKey = isVertical ? "ArrowDown" : "ArrowRight";
        const prevKey = isVertical ? "ArrowUp" : "ArrowLeft";

        if (e.key !== nextKey && e.key !== prevKey) return;

        e.preventDefault();
        const currentIndex = options.findIndex((o) => o.value === current);
        let nextIndex: number;
        if (e.key === nextKey) {
          nextIndex = (currentIndex + 1) % options.length;
        } else {
          nextIndex = (currentIndex - 1 + options.length) % options.length;
        }
        setCurrent(options[nextIndex].value);

        // Focus the newly selected radio
        const container = e.currentTarget;
        const radios = container.querySelectorAll<HTMLInputElement>(
          'input[type="radio"]'
        );
        radios[nextIndex]?.focus();
      },
      [options, current, setCurrent, orientation]
    );

    if (variant === "card") {
      return (
        <div
          ref={ref}
          role="radiogroup"
          className={cn(
            radioGroupVariants({ variant, orientation }),
            className
          )}
          onKeyDown={handleKeyDown}
        >
          {options.map((opt) => {
            const selected = opt.value === current;
            return (
              <label
                key={opt.value}
                className={cn(
                  s.radioCard,
                  selected ? s.radioCardSelected : s.radioCardUnselected,
                  "cursor-pointer"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      s.radioOuter,
                      "mt-0.5",
                      selected
                        ? s.radioOuterSelected
                        : s.radioOuterUnselected
                    )}
                  >
                    {selected && <div className={s.radioInner} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {opt.icon && (
                        <Icon
                          name={opt.icon}
                          size="sm"
                          className="text-slate-500"
                        />
                      )}
                      <span className="text-sm font-semibold text-secondary">
                        {opt.label}
                      </span>
                    </div>
                    {opt.description && (
                      <p className="text-xs text-slate-500 mt-1">
                        {opt.description}
                      </p>
                    )}
                  </div>
                </div>
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={selected}
                  onChange={() => setCurrent(opt.value)}
                  className="sr-only"
                  tabIndex={selected || (!current && opt === options[0]) ? 0 : -1}
                  aria-checked={selected}
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
        className={cn(
          radioGroupVariants({ variant, orientation }),
          className
        )}
        onKeyDown={handleKeyDown}
      >
        {options.map((opt) => {
          const selected = opt.value === current;
          return (
            <label key={opt.value} className={cn(s.radioBase, "cursor-pointer")}>
              <div
                className={cn(
                  s.radioOuter,
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
                onChange={() => setCurrent(opt.value)}
                className="sr-only"
                tabIndex={selected || (!current && opt === options[0]) ? 0 : -1}
                aria-checked={selected}
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

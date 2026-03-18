"use client";

import { forwardRef, useCallback, useRef, type KeyboardEvent } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { useControllable } from "../../hooks/use-controllable";

const segmentedControlVariants = cva(
  "flex bg-slate-200/60 p-1 rounded-xl",
  {
    variants: {
      size: {
        sm: "",
        md: "",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
);

type SegmentedControlItem = {
  label: string;
  value: string;
};

type SegmentedControlProps = {
  items: SegmentedControlItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
} & VariantProps<typeof segmentedControlVariants>;

const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  ({ items, value, defaultValue, onValueChange, size, className }, ref) => {
    const [current, setCurrent] = useControllable({
      value,
      defaultValue: defaultValue ?? items[0]?.value ?? "",
      onChange: onValueChange,
    });

    const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

        e.preventDefault();
        const currentIndex = items.findIndex((i) => i.value === current);
        let nextIndex: number;
        if (e.key === "ArrowRight") {
          nextIndex = (currentIndex + 1) % items.length;
        } else {
          nextIndex = (currentIndex - 1 + items.length) % items.length;
        }
        setCurrent(items[nextIndex].value);
        buttonsRef.current[nextIndex]?.focus();
      },
      [items, current, setCurrent]
    );

    return (
      <div
        ref={ref}
        role="radiogroup"
        className={cn(segmentedControlVariants({ size }), className)}
        onKeyDown={handleKeyDown}
      >
        {items.map((item, index) => {
          const isSelected = item.value === current;
          return (
            <button
              key={item.value}
              ref={(el) => {
                buttonsRef.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setCurrent(item.value)}
              className={cn(
                "rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                size === "md"
                  ? "px-5 py-2 text-sm"
                  : "px-4 py-1.5 text-[13px]",
                isSelected ? s.segmentActive : s.segmentInactive
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    );
  }
);
SegmentedControl.displayName = "SegmentedControl";

export { SegmentedControl, segmentedControlVariants };
export type { SegmentedControlProps, SegmentedControlItem };

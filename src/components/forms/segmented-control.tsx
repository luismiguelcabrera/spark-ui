"use client";

import { forwardRef, useCallback, type HTMLAttributes } from "react";
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

type SegmentedControlProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
  items: SegmentedControlItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
} & VariantProps<typeof segmentedControlVariants>;

const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  (
    {
      items,
      value,
      defaultValue,
      onValueChange,
      size,
      className,
      ...props
    },
    ref
  ) => {
    const [current, setCurrent] = useControllable({
      value,
      defaultValue: defaultValue ?? items[0]?.value ?? "",
      onChange: onValueChange,
    });

    const handleSelect = useCallback(
      (itemValue: string) => {
        setCurrent(itemValue);
      },
      [setCurrent]
    );

    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(segmentedControlVariants({ size }), className)}
        {...props}
      >
        {items.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={item.value === current}
            onClick={() => handleSelect(item.value)}
            className={cn(
              "rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:outline-none",
              size === "md"
                ? "px-5 py-2 text-sm"
                : "px-4 py-1.5 text-[13px]",
              item.value === current ? s.segmentActive : s.segmentInactive
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    );
  }
);
SegmentedControl.displayName = "SegmentedControl";

export { SegmentedControl, segmentedControlVariants };
export type { SegmentedControlProps, SegmentedControlItem };

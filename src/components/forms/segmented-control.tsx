"use client";

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

function SegmentedControl({
  items,
  value,
  defaultValue,
  onValueChange,
  size,
  className,
}: SegmentedControlProps) {
  const [current, setCurrent] = useControllable({
    value,
    defaultValue: defaultValue ?? items[0]?.value ?? "",
    onChange: onValueChange,
  });

  return (
    <div className={cn(segmentedControlVariants({ size }), className)}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => setCurrent(item.value)}
          className={cn(
            "rounded-lg transition-all",
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

export { SegmentedControl, segmentedControlVariants };
export type { SegmentedControlProps, SegmentedControlItem };

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type ProgressBarProps = {
  value: number;
  /** Maximum value (default 100) */
  max?: number;
  trackColor?: string;
  barColor?: string;
  size?: "sm" | "md";
  /** Accessible label describing what is loading/progressing */
  label?: string;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "children">;

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value,
      max = 100,
      trackColor = "bg-gray-100",
      barColor = "bg-gradient-to-r from-primary to-orange-400",
      size = "sm",
      label,
      className,
      ...props
    },
    ref
  ) => {
    const clamped = Math.min(max, Math.max(0, value));
    const percent = max > 0 ? (clamped / max) * 100 : 0;
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className={cn(
          "w-full rounded-full overflow-hidden",
          size === "sm" ? "h-1.5" : "h-2.5",
          trackColor,
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 motion-reduce:transition-none",
            barColor
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    );
  }
);
ProgressBar.displayName = "ProgressBar";

export { ProgressBar };
export type { ProgressBarProps };

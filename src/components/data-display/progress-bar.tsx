import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type ProgressBarProps = Omit<HTMLAttributes<HTMLDivElement>, "role"> & {
  value: number;
  trackColor?: string;
  barColor?: string;
  size?: "sm" | "md";
  /** Accessible label for the progress bar */
  "aria-label"?: string;
};

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value,
      trackColor = "bg-gray-100",
      barColor = "bg-gradient-to-r from-primary to-orange-400",
      size = "sm",
      className,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const clamped = Math.min(100, Math.max(0, value));
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
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
          style={{ width: `${clamped}%` }}
        />
      </div>
    );
  }
);
ProgressBar.displayName = "ProgressBar";

export { ProgressBar };
export type { ProgressBarProps };

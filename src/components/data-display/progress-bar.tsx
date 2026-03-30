import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type ProgressBarProps = Omit<HTMLAttributes<HTMLDivElement>, "role"> & {
  /** Current progress value (0-100) */
  value?: number;
  /** Track background color class */
  trackColor?: string;
  /** Bar fill color class */
  barColor?: string;
  /** Size of the bar */
  size?: "sm" | "md";
  /** Show indeterminate animation (ignores value) */
  indeterminate?: boolean;
  /** Show diagonal stripe pattern on the bar */
  striped?: boolean;
  /** Secondary buffer value (0-100), displayed as a lighter bar behind the main bar */
  bufferValue?: number;
  /** Additional CSS classes */
  className?: string;
};

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value = 0,
      trackColor = "bg-gray-100",
      barColor = "bg-gradient-to-r from-primary to-orange-400",
      size = "sm",
      indeterminate = false,
      striped = false,
      bufferValue,
      className,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const clamped = Math.min(100, Math.max(0, value));
    const clampedBuffer =
      bufferValue !== undefined
        ? Math.min(100, Math.max(0, bufferValue))
        : undefined;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-label={ariaLabel ?? "Progress"}
        aria-valuenow={indeterminate ? undefined : clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(
          "w-full rounded-full overflow-hidden relative",
          size === "sm" ? "h-1.5" : "h-2.5",
          trackColor,
          className
        )}
        {...props}
      >
        {/* Buffer bar (behind the main bar) */}
        {clampedBuffer !== undefined && !indeterminate && (
          <div
            className={cn(
              "absolute inset-0 h-full rounded-full transition-all duration-500 opacity-30",
              barColor
            )}
            style={{ width: `${clampedBuffer}%` }}
            data-testid="progress-buffer"
          />
        )}
        {/* Main bar */}
        {indeterminate ? (
          <div
            className={cn(
              "h-full rounded-full animate-[spark-progress-indeterminate_1.5s_ease-in-out_infinite]",
              barColor,
              striped && "spark-progress-striped"
            )}
            style={{ width: "40%" }}
            data-testid="progress-indeterminate"
          />
        ) : (
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 relative",
              barColor,
              striped && "spark-progress-striped"
            )}
            style={{ width: `${clamped}%` }}
          />
        )}
      </div>
    );
  }
);
ProgressBar.displayName = "ProgressBar";

export { ProgressBar };
export type { ProgressBarProps };

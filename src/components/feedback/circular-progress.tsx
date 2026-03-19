import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type CircularProgressProps = HTMLAttributes<HTMLDivElement> & {
  /** Progress value (0-100) */
  value?: number;
  /** Whether the progress is indeterminate */
  indeterminate?: boolean;
  /** Size in pixels */
  size?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Color */
  color?: "primary" | "secondary" | "success" | "warning" | "destructive" | "accent";
  /** Track color */
  trackColor?: string;
  /** Show value label in center */
  showValue?: boolean;
  /** Format value for display */
  formatValue?: (value: number) => string;
  /** Accessible label */
  label?: string;
};

const colorMap: Record<string, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  success: "text-green-700",
  warning: "text-amber-600",
  destructive: "text-red-600",
  accent: "text-accent",
};

const CircularProgress = forwardRef<HTMLDivElement, CircularProgressProps>(
  (
    {
      className,
      value = 0,
      indeterminate = false,
      size = 48,
      strokeWidth = 4,
      color = "primary",
      trackColor = "text-slate-200",
      showValue = false,
      formatValue = (v) => `${Math.round(v)}%`,
      label,
      ...props
    },
    ref
  ) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = Math.min(100, Math.max(0, value));
    const offset = circumference - (progress / 100) * circumference;

    return (
      <div
        ref={ref}
        className={cn("relative inline-flex items-center justify-center", className)}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          className={cn(indeterminate && "animate-spin")}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Track */}
          <circle
            className={trackColor}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <circle
            className={cn(colorMap[color], "transition-all duration-300")}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={indeterminate ? circumference * 0.75 : offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        {showValue && !indeterminate && (
          <span className="absolute text-xs font-semibold text-slate-700">
            {formatValue(progress)}
          </span>
        )}
      </div>
    );
  }
);
CircularProgress.displayName = "CircularProgress";

export { CircularProgress };
export type { CircularProgressProps };

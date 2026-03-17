import { cn } from "../../lib/utils";

type ProgressBarProps = {
  value: number;
  trackColor?: string;
  barColor?: string;
  size?: "sm" | "md";
  className?: string;
};

function ProgressBar({
  value,
  trackColor = "bg-gray-100",
  barColor = "bg-gradient-to-r from-primary to-orange-400",
  size = "sm",
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn(
        "w-full rounded-full overflow-hidden",
        size === "sm" ? "h-1.5" : "h-2.5",
        trackColor,
        className
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500",
          barColor
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export { ProgressBar };
export type { ProgressBarProps };

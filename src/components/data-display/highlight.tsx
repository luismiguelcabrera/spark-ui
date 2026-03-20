import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type HighlightColor = "yellow" | "green" | "blue" | "pink" | "purple" | "orange";

type HighlightProps = HTMLAttributes<HTMLElement> & {
  /** Highlight color */
  color?: HighlightColor;
};

const colorMap: Record<HighlightColor, string> = {
  yellow: "bg-warning/30 text-navy-text",
  green: "bg-success/30 text-navy-text",
  blue: "bg-primary/30 text-navy-text",
  pink: "bg-pink-200/60 text-pink-900 dark:bg-pink-900/30 dark:text-pink-200",
  purple: "bg-purple-200/60 text-purple-900 dark:bg-purple-900/30 dark:text-purple-200",
  orange: "bg-orange-200/60 text-orange-900 dark:bg-orange-900/30 dark:text-orange-200",
};

const Highlight = forwardRef<HTMLElement, HighlightProps>(
  ({ className, color = "yellow", ...props }, ref) => (
    <mark
      ref={ref}
      className={cn(
        "rounded-sm px-1 py-0.5",
        colorMap[color],
        className
      )}
      {...props}
    />
  )
);
Highlight.displayName = "Highlight";

export { Highlight };
export type { HighlightProps, HighlightColor };

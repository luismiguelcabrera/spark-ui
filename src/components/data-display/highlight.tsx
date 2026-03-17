import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type HighlightColor = "yellow" | "green" | "blue" | "pink" | "purple" | "orange";

type HighlightProps = HTMLAttributes<HTMLElement> & {
  /** Highlight color */
  color?: HighlightColor;
};

const colorMap: Record<HighlightColor, string> = {
  yellow: "bg-yellow-200/60 text-yellow-900",
  green: "bg-green-200/60 text-green-900",
  blue: "bg-blue-200/60 text-blue-900",
  pink: "bg-pink-200/60 text-pink-900",
  purple: "bg-purple-200/60 text-purple-900",
  orange: "bg-orange-200/60 text-orange-900",
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

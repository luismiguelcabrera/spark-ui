import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type WrapProps = HTMLAttributes<HTMLDivElement> & {
  /** Gap between items */
  gap?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8";
  /** Alignment */
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  /** Justification */
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
};

const Wrap = forwardRef<HTMLDivElement, WrapProps>(
  ({ className, gap = "2", align, justify, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-wrap",
        `gap-${gap}`,
        align && `items-${align}`,
        justify && `justify-${justify}`,
        className
      )}
      {...props}
    />
  )
);
Wrap.displayName = "Wrap";

export { Wrap };
export type { WrapProps };

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type SeparatorProps = HTMLAttributes<HTMLDivElement> & {
  /** Direction of the separator */
  orientation?: "horizontal" | "vertical";
  /** Whether the separator is decorative (default: true) */
  decorative?: boolean;
  /** Label to display in the middle of the separator */
  label?: string;
};

const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = "horizontal", decorative = true, label, ...props }, ref) => {
    const isHorizontal = orientation === "horizontal";

    if (label) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center gap-3",
            isHorizontal ? "w-full" : "flex-col h-full",
            className
          )}
          role={decorative ? "none" : "separator"}
          aria-orientation={decorative ? undefined : orientation}
          {...props}
        >
          <div className={cn(isHorizontal ? "h-px flex-1 bg-slate-200" : "w-px flex-1 bg-slate-200")} />
          <span className="text-xs font-medium text-slate-500 shrink-0">{label}</span>
          <div className={cn(isHorizontal ? "h-px flex-1 bg-slate-200" : "w-px flex-1 bg-slate-200")} />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          isHorizontal ? "h-px w-full bg-slate-200" : "w-px h-full bg-slate-200",
          className
        )}
        role={decorative ? "none" : "separator"}
        aria-orientation={decorative ? undefined : orientation}
        {...props}
      />
    );
  }
);
Separator.displayName = "Separator";

export { Separator };
export type { SeparatorProps };

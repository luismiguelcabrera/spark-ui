import { forwardRef, useId, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";

type TooltipProps = {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  variant?: "dark" | "light";
  children: ReactNode;
  className?: string;
};

const positionStyles = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
} as const;

const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(
  ({ content, position = "top", variant = "dark", children, className }, ref) => {
    const tooltipId = useId();

    return (
      <span
        ref={ref}
        className={cn(s.tooltipTrigger, className)}
        aria-describedby={tooltipId}
      >
        {children}
        <span
          id={tooltipId}
          className={cn(
            s.tooltipContent,
            "transition-[opacity,transform] delay-150 scale-95 group-hover:scale-100 group-hover:delay-200 group-focus-within:opacity-100 group-focus-within:scale-100",
            positionStyles[position],
            variant === "dark" ? s.tooltipDark : s.tooltipLight,
          )}
          role="tooltip"
        >
          {content}
        </span>
      </span>
    );
  },
);

Tooltip.displayName = "Tooltip";

export { Tooltip };
export type { TooltipProps };

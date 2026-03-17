import { type ReactNode } from "react";
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

function Tooltip({
  content,
  position = "top",
  variant = "dark",
  children,
  className,
}: TooltipProps) {
  return (
    <span className={cn(s.tooltipTrigger, className)}>
      {children}
      <span
        className={cn(
          s.tooltipContent,
          positionStyles[position],
          variant === "dark" ? s.tooltipDark : s.tooltipLight
        )}
        role="tooltip"
      >
        {content}
      </span>
    </span>
  );
}

export { Tooltip };
export type { TooltipProps };

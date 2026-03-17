"use client";

import { forwardRef, useState, useRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

type HoverCardProps = Omit<HTMLAttributes<HTMLDivElement>, "content"> & {
  /** Content to show in the hover card */
  content: ReactNode;
  /** Trigger element */
  children: ReactNode;
  /** Placement relative to trigger */
  side?: "top" | "bottom" | "left" | "right";
  /** Alignment relative to trigger */
  align?: "start" | "center" | "end";
  /** Delay before showing (ms) */
  openDelay?: number;
  /** Delay before hiding (ms) */
  closeDelay?: number;
  /** Width of the card */
  width?: number | string;
};

const HoverCard = forwardRef<HTMLDivElement, HoverCardProps>(
  (
    {
      className,
      content,
      children,
      side = "bottom",
      align = "center",
      openDelay = 300,
      closeDelay = 200,
      width = 320,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const openTimer = useRef<ReturnType<typeof setTimeout>>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout>>(null);

    const handleEnter = () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      openTimer.current = setTimeout(() => setOpen(true), openDelay);
    };

    const handleLeave = () => {
      if (openTimer.current) clearTimeout(openTimer.current);
      closeTimer.current = setTimeout(() => setOpen(false), closeDelay);
    };

    const sideClasses = {
      top: "bottom-full mb-2",
      bottom: "top-full mt-2",
      left: "right-full mr-2",
      right: "left-full ml-2",
    };

    const alignClasses = {
      start: side === "top" || side === "bottom" ? "left-0" : "top-0",
      center: side === "top" || side === "bottom" ? "left-1/2 -translate-x-1/2" : "top-1/2 -translate-y-1/2",
      end: side === "top" || side === "bottom" ? "right-0" : "bottom-0",
    };

    return (
      <div
        ref={ref}
        className={cn("relative inline-block", className)}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={handleEnter}
        onBlur={handleLeave}
        {...props}
      >
        {children}
        {open && (
          <div
            className={cn(
              "absolute z-50 bg-white border border-slate-200 rounded-xl shadow-float p-4",
              "animate-in fade-in zoom-in-95",
              sideClasses[side],
              alignClasses[align]
            )}
            style={{ width: typeof width === "number" ? `${width}px` : width }}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
          >
            {content}
          </div>
        )}
      </div>
    );
  }
);
HoverCard.displayName = "HoverCard";

export { HoverCard };
export type { HoverCardProps };

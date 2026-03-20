"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { cn } from "../../lib/utils";

type PopoverProps = {
  trigger: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  className?: string;
};

function Popover({
  trigger,
  children,
  side = "bottom",
  align = "center",
  className,
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const sideClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2",
  };

  const alignClasses = {
    start: side === "top" || side === "bottom" ? "left-0" : "top-0",
    center:
      side === "top" || side === "bottom"
        ? "left-1/2 -translate-x-1/2"
        : "top-1/2 -translate-y-1/2",
    end: side === "top" || side === "bottom" ? "right-0" : "bottom-0",
  };

  return (
    <div ref={ref} className="relative inline-flex">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          role="dialog"
          className={cn(
            "absolute z-50 min-w-[200px] bg-surface border border-muted rounded-xl shadow-float p-4",
            sideClasses[side],
            alignClasses[align],
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export { Popover };
export type { PopoverProps };

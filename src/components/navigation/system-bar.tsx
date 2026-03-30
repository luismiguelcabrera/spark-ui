"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

type SystemBarProps = HTMLAttributes<HTMLDivElement> & {
  /** Bar content (time, icons, etc.) */
  children?: ReactNode;
  /** Background color class (e.g. "bg-slate-900") */
  color?: string;
  /** Height in pixels */
  height?: number;
  /** Use taller height for desktop/window mode */
  window?: boolean;
};

const SystemBar = forwardRef<HTMLDivElement, SystemBarProps>(
  ({ className, children, color = "bg-slate-900", height = 24, window: isWindow = false, ...props }, ref) => (
    <div
      ref={ref}
      role="banner"
      className={cn(
        "w-full flex items-center justify-center text-white text-xs",
        color,
        className
      )}
      style={{ height: isWindow ? 32 : height }}
      {...props}
    >
      {children}
    </div>
  )
);
SystemBar.displayName = "SystemBar";

export { SystemBar };
export type { SystemBarProps };

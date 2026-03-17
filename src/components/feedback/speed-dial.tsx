"use client";

import { forwardRef, useState, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";

type SpeedDialAction = {
  /** Icon name */
  icon: string;
  /** Label text */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Disabled state */
  disabled?: boolean;
};

type SpeedDialProps = HTMLAttributes<HTMLDivElement> & {
  /** Actions to display */
  actions: SpeedDialAction[];
  /** Main button icon */
  icon?: string;
  /** Position on screen */
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  /** Direction actions expand */
  direction?: "up" | "down" | "left" | "right";
  /** Color */
  color?: "primary" | "secondary" | "accent";
  /** Whether the menu is fixed position */
  fixed?: boolean;
};

const positionMap = {
  "bottom-right": "bottom-6 right-6",
  "bottom-left": "bottom-6 left-6",
  "top-right": "top-6 right-6",
  "top-left": "top-6 left-6",
};

const colorMap: Record<string, string> = {
  primary: "bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/30",
  secondary: "bg-secondary hover:bg-secondary-light text-white shadow-lg shadow-secondary/30",
  accent: "bg-accent hover:bg-accent/90 text-amber-950 shadow-lg shadow-accent/30",
};

const directionMap: Record<string, string> = {
  up: "flex-col-reverse bottom-16 left-1/2 -translate-x-1/2",
  down: "flex-col top-16 left-1/2 -translate-x-1/2",
  left: "flex-row-reverse right-16 top-1/2 -translate-y-1/2",
  right: "flex-row left-16 top-1/2 -translate-y-1/2",
};

const SpeedDial = forwardRef<HTMLDivElement, SpeedDialProps>(
  (
    {
      className,
      actions,
      icon = "plus",
      position = "bottom-right",
      direction = "up",
      color = "primary",
      fixed = true,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);

    return (
      <div
        ref={ref}
        className={cn(
          "z-50",
          fixed && "fixed",
          fixed && positionMap[position],
          className
        )}
        {...props}
      >
        {/* Actions */}
        {open && (
          <div
            className={cn(
              "absolute flex gap-2",
              directionMap[direction]
            )}
          >
            {actions.map((action, index) => (
              <div key={action.label} className="flex items-center gap-2 group">
                {/* Tooltip */}
                <span className="px-2 py-1 bg-slate-900 text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {action.label}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    action.onClick();
                    setOpen(false);
                  }}
                  disabled={action.disabled}
                  className={cn(
                    "w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md",
                    "flex items-center justify-center text-slate-600",
                    "hover:bg-slate-50 hover:shadow-lg transition-all",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  )}
                  aria-label={action.label}
                >
                  <Icon name={action.icon} size="sm" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Main button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            "relative w-14 h-14 rounded-full flex items-center justify-center transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
            colorMap[color]
          )}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <Icon
            name={icon}
            size="md"
            className={cn("transition-transform", open && "rotate-45")}
          />
        </button>
      </div>
    );
  }
);
SpeedDial.displayName = "SpeedDial";

export { SpeedDial };
export type { SpeedDialProps, SpeedDialAction };

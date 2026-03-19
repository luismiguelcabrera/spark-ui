"use client";

import { forwardRef, useState, useCallback, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";

/* ── Types ── */

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

type SpeedDialColor =
  | "primary"
  | "secondary"
  | "accent"
  | "destructive"
  | "success"
  | "warning";

type SpeedDialShape = "circle" | "rounded";

type SpeedDialDirection = "up" | "down" | "left" | "right";

type SpeedDialPosition =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left";

type SpeedDialProps = HTMLAttributes<HTMLDivElement> & {
  /** Actions to display */
  actions: SpeedDialAction[];
  /** Main button icon */
  icon?: string;
  /** Position on screen */
  position?: SpeedDialPosition;
  /** Direction actions expand */
  direction?: SpeedDialDirection;
  /** Color */
  color?: SpeedDialColor;
  /** Shape of buttons */
  shape?: SpeedDialShape;
  /** Whether the menu is fixed position */
  fixed?: boolean;
  /** Show a semi-transparent backdrop when open */
  backdrop?: boolean;
};

/* ── Maps ── */

const positionMap: Record<SpeedDialPosition, string> = {
  "bottom-right": "bottom-6 right-6",
  "bottom-left": "bottom-6 left-6",
  "top-right": "top-6 right-6",
  "top-left": "top-6 left-6",
};

const colorMap: Record<SpeedDialColor, string> = {
  primary:
    "bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/30",
  secondary:
    "bg-secondary hover:bg-secondary-light text-white shadow-lg shadow-secondary/30",
  accent:
    "bg-accent hover:bg-accent/90 text-amber-950 shadow-lg shadow-accent/30",
  destructive:
    "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30",
  success:
    "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30",
  warning:
    "bg-amber-500 hover:bg-amber-600 text-amber-950 shadow-lg shadow-amber-500/30",
};

const focusRingColorMap: Record<SpeedDialColor, string> = {
  primary: "focus-visible:ring-primary",
  secondary: "focus-visible:ring-secondary",
  accent: "focus-visible:ring-accent",
  destructive: "focus-visible:ring-red-600",
  success: "focus-visible:ring-emerald-600",
  warning: "focus-visible:ring-amber-500",
};

const directionMap: Record<SpeedDialDirection, string> = {
  up: "flex-col-reverse bottom-16 left-1/2 -translate-x-1/2",
  down: "flex-col top-16 left-1/2 -translate-x-1/2",
  left: "flex-row-reverse right-16 top-1/2 -translate-y-1/2",
  right: "flex-row left-16 top-1/2 -translate-y-1/2",
};

/**
 * Tooltip position adapted to speed-dial direction:
 * - up/down actions expand vertically, so tooltips go left
 * - left/right actions expand horizontally, so tooltips go above
 */
const tooltipPositionMap: Record<SpeedDialDirection, string> = {
  up: "right-full top-1/2 -translate-y-1/2 mr-2",
  down: "right-full top-1/2 -translate-y-1/2 mr-2",
  left: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  right: "bottom-full left-1/2 -translate-x-1/2 mb-2",
};

/**
 * For left/right directions, tooltip items need different flex layout
 * to position tooltip above/below instead of beside.
 */
const actionItemFlexMap: Record<SpeedDialDirection, string> = {
  up: "flex-row",
  down: "flex-row",
  left: "flex-col",
  right: "flex-col",
};

/* ── Component ── */

const SpeedDial = forwardRef<HTMLDivElement, SpeedDialProps>(
  (
    {
      className,
      actions,
      icon = "plus",
      position = "bottom-right",
      direction = "up",
      color = "primary",
      shape = "circle",
      fixed = true,
      backdrop = false,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);

    const handleToggle = useCallback(() => {
      setOpen((prev) => !prev);
    }, []);

    const handleActionClick = useCallback(
      (action: SpeedDialAction) => {
        action.onClick();
        setOpen(false);
      },
      []
    );

    const shapeClass = shape === "circle" ? "rounded-full" : "rounded-lg";
    const actionShapeClass =
      shape === "circle" ? "rounded-full" : "rounded-lg";

    return (
      <>
        {/* Backdrop overlay */}
        {backdrop && (
          <div
            className={cn(
              "fixed inset-0 z-40 bg-black/20 transition-opacity duration-200",
              "motion-reduce:transition-none",
              open ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
        )}

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
          {/* Actions — always rendered for CSS transitions */}
          <div
            className={cn(
              "absolute flex gap-2",
              directionMap[direction]
            )}
            id="speed-dial-actions"
            role="group"
            aria-label="Speed dial actions"
          >
            {actions.map((action, index) => (
              <div
                key={action.label}
                className={cn(
                  "relative flex items-center gap-2 group",
                  actionItemFlexMap[direction],
                  /* transition: scale + fade, with stagger delay per index */
                  "transition-all duration-200 ease-out",
                  "motion-reduce:transition-none motion-reduce:!delay-[0ms]",
                  open
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-50 pointer-events-none"
                )}
                style={{
                  transitionDelay: open ? `${index * 50}ms` : "0ms",
                }}
              >
                {/* Tooltip — direction-aware */}
                <span
                  className={cn(
                    "absolute px-2 py-1 bg-slate-900 text-white text-xs font-medium rounded-md whitespace-nowrap",
                    "opacity-0 group-hover:opacity-100 transition-opacity",
                    "motion-reduce:transition-none",
                    "pointer-events-none z-10",
                    tooltipPositionMap[direction]
                  )}
                  role="tooltip"
                >
                  {action.label}
                </span>
                <button
                  type="button"
                  onClick={() => handleActionClick(action)}
                  disabled={action.disabled}
                  className={cn(
                    "w-10 h-10 bg-white border border-slate-200 shadow-md",
                    "flex items-center justify-center text-slate-600",
                    "hover:bg-slate-50 hover:shadow-lg transition-all",
                    "motion-reduce:transition-none",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
                    "focus-visible:outline-none focus-visible:ring-2",
                    focusRingColorMap[color],
                    actionShapeClass
                  )}
                  aria-label={action.label}
                >
                  <Icon name={action.icon} size="sm" />
                </button>
              </div>
            ))}
          </div>

          {/* Main button */}
          <button
            type="button"
            onClick={handleToggle}
            className={cn(
              "relative w-14 h-14 flex items-center justify-center transition-all duration-200",
              "motion-reduce:transition-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              focusRingColorMap[color],
              colorMap[color],
              shapeClass
            )}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="speed-dial-actions"
          >
            <Icon
              name={icon}
              size="md"
              className={cn(
                "transition-transform duration-200",
                "motion-reduce:transition-none",
                open && "rotate-45"
              )}
            />
          </button>
        </div>
      </>
    );
  }
);
SpeedDial.displayName = "SpeedDial";

export { SpeedDial };
export type {
  SpeedDialProps,
  SpeedDialAction,
  SpeedDialColor,
  SpeedDialShape,
  SpeedDialDirection,
  SpeedDialPosition,
};

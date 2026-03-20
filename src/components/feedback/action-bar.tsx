"use client";

import { forwardRef, useEffect, useCallback, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";
import { Portal } from "../layout/portal";

type ActionBarPosition = "bottom" | "top";

type ActionBarProps = {
  /** Whether the action bar is visible */
  open: boolean;
  /** Callback when the action bar is closed */
  onClose?: () => void;
  /** Action buttons displayed in the bar */
  children: ReactNode;
  /** Number of selected items to display */
  count?: number;
  /** Additional class names */
  className?: string;
  /** Position of the action bar */
  position?: ActionBarPosition;
};

const positionClasses: Record<ActionBarPosition, string> = {
  bottom: "bottom-4 left-1/2 -translate-x-1/2",
  top: "top-4 left-1/2 -translate-x-1/2",
};

const animationClasses: Record<ActionBarPosition, string> = {
  bottom:
    "data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-4 data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-4 data-[state=closed]:fade-out",
  top: "data-[state=open]:animate-in data-[state=open]:slide-in-from-top-4 data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-4 data-[state=closed]:fade-out",
};

const ActionBar = forwardRef<HTMLDivElement, ActionBarProps>(
  ({ open, onClose, children, count, className, position = "bottom" }, ref) => {
    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose?.();
      },
      [onClose],
    );

    useEffect(() => {
      if (!open) return;
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, handleKeyDown]);

    if (!open) return null;

    return (
      <Portal>
        <div
          ref={ref}
          role="toolbar"
          aria-label={
            count != null
              ? `${count} item${count !== 1 ? "s" : ""} selected`
              : "Action bar"
          }
          data-state={open ? "open" : "closed"}
          className={cn(
            "fixed z-50 flex items-center gap-3 rounded-xl border border-muted bg-surface/95 px-4 py-2.5 shadow-lg backdrop-blur-md",
            positionClasses[position],
            animationClasses[position],
            className,
          )}
        >
          {count != null && (
            <span className="text-sm font-medium text-slate-600 dark:text-slate-500 whitespace-nowrap">
              {count} selected
            </span>
          )}

          {count != null && (
            <div
              className="h-5 w-px bg-slate-200 dark:bg-slate-700"
              aria-hidden="true"
            />
          )}

          <div className="flex items-center gap-2">{children}</div>

          {onClose && (
            <>
              <div
                className="h-5 w-px bg-slate-200 dark:bg-slate-700"
                aria-hidden="true"
              />
              <button
                type="button"
                aria-label="Close action bar"
                onClick={onClose}
                className="rounded-lg p-1 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:hover:bg-slate-800 dark:hover:text-slate-400"
              >
                <Icon name="close" size="sm" />
              </button>
            </>
          )}
        </div>
      </Portal>
    );
  },
);
ActionBar.displayName = "ActionBar";

export { ActionBar };
export type { ActionBarProps, ActionBarPosition };

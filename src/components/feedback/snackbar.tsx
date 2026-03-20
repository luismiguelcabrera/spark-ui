"use client";

import { forwardRef, useEffect, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";

type SnackbarLocation =
  | "bottom-center"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "top-left"
  | "top-right";

type SnackbarProps = HTMLAttributes<HTMLDivElement> & {
  /** Whether the snackbar is visible */
  open: boolean;
  /** Callback when snackbar should close */
  onClose: () => void;
  /** Message content */
  message: string;
  /** Optional description */
  description?: string;
  /** Action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Severity type */
  type?: "default" | "success" | "error" | "warning" | "info";
  /** Auto-hide duration in ms (0 to disable) */
  duration?: number;
  /** Position on screen (legacy prop, use location for more options) */
  position?: "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  /** Auto-dismiss timeout in ms (0 = no auto-dismiss). Alias for duration */
  timeout?: number;
  /** Position on screen with centered options */
  location?: SnackbarLocation;
  /** Taller layout for longer messages */
  multiLine?: boolean;
  /** Show close button */
  showClose?: boolean;
  /** Icon to show */
  icon?: string;
};

const typeStyles: Record<string, { bg: string; icon: string; iconColor: string }> = {
  default: { bg: "bg-background-dark text-white", icon: "", iconColor: "" },
  success: { bg: "bg-success text-white", icon: "check-circle", iconColor: "text-white/70" },
  error: { bg: "bg-destructive text-white", icon: "alert-circle", iconColor: "text-white/70" },
  warning: { bg: "bg-warning text-black", icon: "alert-triangle", iconColor: "text-black/70" },
  info: { bg: "bg-primary text-white", icon: "info", iconColor: "text-white/70" },
};

const positionMap: Record<string, string> = {
  top: "top-4 left-1/2 -translate-x-1/2",
  bottom: "bottom-4 left-1/2 -translate-x-1/2",
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-4",
};

const locationMap: Record<SnackbarLocation, string> = {
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-4",
};

const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(
  (
    {
      className,
      open,
      onClose,
      message,
      description,
      action,
      type = "default",
      duration = 5000,
      position = "bottom",
      timeout,
      location,
      multiLine = false,
      showClose = true,
      icon,
      ...props
    },
    ref
  ) => {
    // timeout takes precedence over duration when explicitly provided
    const effectiveDuration = timeout !== undefined ? timeout : duration;

    useEffect(() => {
      if (!open || effectiveDuration <= 0) return;
      const timer = setTimeout(onClose, effectiveDuration);
      return () => clearTimeout(timer);
    }, [open, effectiveDuration, onClose]);

    if (!open) return null;

    const styles = typeStyles[type];
    const displayIcon = icon ?? styles.icon;

    // location takes precedence over position
    const positionClasses = location
      ? locationMap[location]
      : positionMap[position];

    return (
      <div
        ref={ref}
        role="alert"
        aria-live="polite"
        className={cn(
          "fixed z-[60] flex gap-3 rounded-xl shadow-float min-w-[300px] max-w-md",
          multiLine ? "flex-col items-stretch px-4 py-4" : "items-center px-4 py-3",
          styles.bg,
          positionClasses,
          className
        )}
        {...props}
      >
        <div className={cn("flex items-center gap-3", multiLine && "flex-1")}>
          {displayIcon && (
            <Icon name={displayIcon} size="md" className={cn("shrink-0", styles.iconColor)} />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">{message}</p>
            {description && <p className="text-xs mt-0.5">{description}</p>}
          </div>
          {!multiLine && action && (
            <button
              type="button"
              onClick={action.onClick}
              className="shrink-0 text-sm font-bold underline underline-offset-2 hover:no-underline"
            >
              {action.label}
            </button>
          )}
          {!multiLine && showClose && (
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 p-0.5 rounded-md hover:bg-white/10 transition-colors"
              aria-label="Dismiss"
            >
              <Icon name="close" size="sm" />
            </button>
          )}
        </div>
        {multiLine && (
          <div className="flex items-center justify-end gap-3">
            {action && (
              <button
                type="button"
                onClick={action.onClick}
                className="shrink-0 text-sm font-bold underline underline-offset-2 hover:no-underline"
              >
                {action.label}
              </button>
            )}
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 p-0.5 rounded-md hover:bg-white/10 transition-colors"
                aria-label="Dismiss"
              >
                <Icon name="close" size="sm" />
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
);
Snackbar.displayName = "Snackbar";

export { Snackbar };
export type { SnackbarProps, SnackbarLocation };

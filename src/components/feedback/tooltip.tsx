"use client";

import {
  forwardRef,
  useState,
  useRef,
  useCallback,
  useEffect,
  useId,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type TooltipPosition = "top" | "bottom" | "left" | "right";
type TooltipVariant = "dark" | "light";

type TooltipProps = {
  /** Tooltip text content */
  content: string;
  /** Position relative to the trigger */
  position?: TooltipPosition;
  /** Visual variant */
  variant?: TooltipVariant;
  /** Show an arrow pointing to the trigger */
  arrow?: boolean;
  /** Delay before showing (ms) */
  openDelay?: number;
  /** Delay before hiding (ms) */
  closeDelay?: number;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Disable the tooltip (still renders children) */
  disabled?: boolean;
  /** Trigger element */
  children: ReactNode;
  /** Additional class names on the wrapper */
  className?: string;
};

/* -------------------------------------------------------------------------- */
/*  Position / Arrow styles                                                    */
/* -------------------------------------------------------------------------- */

const positionStyles: Record<TooltipPosition, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const arrowStyles: Record<TooltipPosition, Record<TooltipVariant, string>> = {
  top: {
    dark: "after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-slate-900",
    light: "after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-white",
  },
  bottom: {
    dark: "after:absolute after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-b-slate-900",
    light: "after:absolute after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-b-white",
  },
  left: {
    dark: "after:absolute after:left-full after:top-1/2 after:-translate-y-1/2 after:border-4 after:border-transparent after:border-l-slate-900",
    light: "after:absolute after:left-full after:top-1/2 after:-translate-y-1/2 after:border-4 after:border-transparent after:border-l-white",
  },
  right: {
    dark: "after:absolute after:right-full after:top-1/2 after:-translate-y-1/2 after:border-4 after:border-transparent after:border-r-slate-900",
    light: "after:absolute after:right-full after:top-1/2 after:-translate-y-1/2 after:border-4 after:border-transparent after:border-r-white",
  },
};

const variantStyles: Record<TooltipVariant, string> = {
  dark: "bg-slate-900 text-white",
  light: "bg-white text-slate-700 border border-slate-200 shadow-sm",
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(
  (
    {
      content,
      position = "top",
      variant = "dark",
      arrow = true,
      openDelay = 0,
      closeDelay = 0,
      open: openProp,
      onOpenChange,
      disabled = false,
      children,
      className,
    },
    ref,
  ) => {
    const tooltipId = useId();
    const controlled = openProp !== undefined;
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = controlled ? openProp : internalOpen;

    const openTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const clearTimers = useCallback(() => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    }, []);

    // Cleanup on unmount
    useEffect(() => clearTimers, [clearTimers]);

    const show = useCallback(() => {
      if (disabled) return;
      clearTimers();
      if (openDelay > 0) {
        openTimerRef.current = setTimeout(() => {
          if (!controlled) setInternalOpen(true);
          onOpenChange?.(true);
        }, openDelay);
      } else {
        if (!controlled) setInternalOpen(true);
        onOpenChange?.(true);
      }
    }, [disabled, openDelay, controlled, onOpenChange, clearTimers]);

    const hide = useCallback(() => {
      clearTimers();
      if (closeDelay > 0) {
        closeTimerRef.current = setTimeout(() => {
          if (!controlled) setInternalOpen(false);
          onOpenChange?.(false);
        }, closeDelay);
      } else {
        if (!controlled) setInternalOpen(false);
        onOpenChange?.(false);
      }
    }, [closeDelay, controlled, onOpenChange, clearTimers]);

    return (
      <span
        ref={ref}
        className={cn("relative inline-flex", className)}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {/* Trigger */}
        <span aria-describedby={isOpen ? tooltipId : undefined}>
          {children}
        </span>

        {/* Tooltip content */}
        {isOpen && !disabled && (
          <span
            id={tooltipId}
            role="tooltip"
            className={cn(
              "absolute z-50 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none",
              "animate-in fade-in duration-150",
              positionStyles[position],
              variantStyles[variant],
              arrow && arrowStyles[position][variant],
            )}
          >
            {content}
          </span>
        )}
      </span>
    );
  },
);
Tooltip.displayName = "Tooltip";

export { Tooltip };
export type { TooltipProps, TooltipPosition, TooltipVariant };

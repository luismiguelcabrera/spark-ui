"use client";

import { forwardRef, useEffect, useCallback, type ReactNode } from "react";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type OverlayProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Whether the overlay is visible */
  open: boolean;
  /** Callback when open state should change */
  onOpenChange: (open: boolean) => void;
  /** Content to render on top of the scrim */
  children: ReactNode;
  /** Show a backdrop scrim behind the content */
  scrim?: boolean;
  /** Apply backdrop blur to the scrim */
  blur?: boolean;
  /** Whether clicking the backdrop closes the overlay */
  closeOnClick?: boolean;
  /** Whether pressing Escape closes the overlay */
  closeOnEscape?: boolean;
};

/* -------------------------------------------------------------------------- */
/*  Overlay component                                                          */
/* -------------------------------------------------------------------------- */

const Overlay = forwardRef<HTMLDivElement, OverlayProps>(
  (
    {
      open,
      onOpenChange,
      children,
      scrim = true,
      blur = false,
      closeOnClick = true,
      closeOnEscape = true,
      className,
      ...props
    },
    ref,
  ) => {
    const close = useCallback(() => onOpenChange(false), [onOpenChange]);

    // Escape key handler
    useEffect(() => {
      if (!open || !closeOnEscape) return;
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape") close();
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }, [open, closeOnEscape, close]);

    // Lock body scroll when open
    useEffect(() => {
      if (open) {
        document.body.style.overflow = "hidden";
        return () => {
          document.body.style.overflow = "";
        };
      }
    }, [open]);

    if (!open) return null;

    return (
      <div
        ref={ref}
        className={cn("fixed inset-0 z-50", className)}
        role="dialog"
        aria-modal="true"
        aria-label="Overlay"
        {...props}
      >
        {/* Scrim / backdrop */}
        {scrim && (
          <div
            className={cn(
              "absolute inset-0 bg-black/40",
              blur && "backdrop-blur-sm",
            )}
            aria-hidden="true"
            onClick={closeOnClick ? close : undefined}
          />
        )}

        {/* Content */}
        <div className="relative z-10 h-full w-full pointer-events-none">
          <div className="pointer-events-auto h-full w-full">{children}</div>
        </div>
      </div>
    );
  },
);
Overlay.displayName = "Overlay";

/* -------------------------------------------------------------------------- */
/*  Exports                                                                    */
/* -------------------------------------------------------------------------- */

export { Overlay };
export type { OverlayProps };

"use client";

import { forwardRef, useEffect, useCallback, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type BottomSheetProps = {
  /** Whether the bottom sheet is open */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Title displayed at the top of the sheet */
  title?: string;
  /** Sheet body content */
  children: ReactNode;
  /** Expand sheet to full screen height */
  fullscreen?: boolean;
  /** Persistent mode — backdrop click does not close */
  persistent?: boolean;
  /** Additional class names for the sheet panel */
  className?: string;
};

/* -------------------------------------------------------------------------- */
/*  BottomSheet component                                                      */
/* -------------------------------------------------------------------------- */

const BottomSheet = forwardRef<HTMLDivElement, BottomSheetProps>(
  (
    {
      open,
      onOpenChange,
      title,
      children,
      fullscreen = false,
      persistent = false,
      className,
    },
    ref,
  ) => {
    const close = useCallback(() => onOpenChange(false), [onOpenChange]);

    // Escape key handler
    useEffect(() => {
      if (!open) return;
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape") close();
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }, [open, close]);

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

    const handleBackdropClick = () => {
      if (!persistent) close();
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-end justify-center"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          aria-hidden="true"
          onClick={handleBackdropClick}
        />

        {/* Panel */}
        <div
          ref={ref}
          className={cn(
            "relative w-full bg-white shadow-float rounded-t-2xl flex flex-col",
            fullscreen ? "h-full" : "max-h-[85vh]",
            className,
          )}
        >
          {/* Drag indicator */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-slate-300" />
          </div>

          {/* Header */}
          {title && (
            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">{title}</h2>
              <button
                type="button"
                aria-label="Close bottom sheet"
                onClick={close}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                <Icon name="close" size="md" />
              </button>
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        </div>
      </div>
    );
  },
);
BottomSheet.displayName = "BottomSheet";

/* -------------------------------------------------------------------------- */
/*  Exports                                                                    */
/* -------------------------------------------------------------------------- */

export { BottomSheet };
export type { BottomSheetProps };

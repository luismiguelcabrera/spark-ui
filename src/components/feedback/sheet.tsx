"use client";

import { forwardRef, useEffect, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";

type SheetSide = "left" | "right" | "top" | "bottom";

type SheetProps = HTMLAttributes<HTMLDivElement> & {
  /** Whether the sheet is open */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Side the sheet slides from */
  side?: SheetSide;
  /** Title */
  title?: string;
  /** Description */
  description?: string;
  /** Custom header content */
  header?: ReactNode;
  /** Custom footer content */
  footer?: ReactNode;
  /** Sheet size */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  /** Whether clicking overlay closes the sheet */
  closeOnOverlayClick?: boolean;
  /** Whether pressing Escape closes the sheet */
  closeOnEscape?: boolean;
  /** Show close button */
  showClose?: boolean;
};

const sizeMap: Record<string, Record<SheetSide, string>> = {
  sm: { left: "w-72", right: "w-72", top: "h-48", bottom: "h-48" },
  md: { left: "w-96", right: "w-96", top: "h-72", bottom: "h-72" },
  lg: { left: "w-[32rem]", right: "w-[32rem]", top: "h-96", bottom: "h-96" },
  xl: { left: "w-[40rem]", right: "w-[40rem]", top: "h-[32rem]", bottom: "h-[32rem]" },
  full: { left: "w-screen", right: "w-screen", top: "h-screen", bottom: "h-screen" },
};

const positionMap: Record<SheetSide, string> = {
  left: "inset-y-0 left-0",
  right: "inset-y-0 right-0",
  top: "inset-x-0 top-0",
  bottom: "inset-x-0 bottom-0",
};

const Sheet = forwardRef<HTMLDivElement, SheetProps>(
  (
    {
      className,
      open,
      onOpenChange,
      side = "right",
      title,
      description,
      header,
      footer,
      size = "md",
      closeOnOverlayClick = true,
      closeOnEscape = true,
      showClose = true,
      children,
      ...props
    },
    ref
  ) => {
    useEffect(() => {
      if (!open || !closeOnEscape) return;
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onOpenChange(false);
      };
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [open, closeOnEscape, onOpenChange]);

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
      <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={closeOnOverlayClick ? () => onOpenChange(false) : undefined}
        />
        {/* Panel */}
        <div
          ref={ref}
          className={cn(
            "absolute bg-white shadow-float flex flex-col",
            positionMap[side],
            sizeMap[size][side],
            (side === "left" || side === "right") && "h-full",
            (side === "top" || side === "bottom") && "w-full",
            className
          )}
          {...props}
        >
          {/* Header */}
          {(title || header || showClose) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              {header ?? (
                <div>
                  {title && <h2 className="text-lg font-bold text-secondary">{title}</h2>}
                  {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
                </div>
              )}
              {showClose && (
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  aria-label="Close"
                >
                  <Icon name="close" size="md" />
                </button>
              )}
            </div>
          )}
          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {children}
          </div>
          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-slate-100">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  }
);
Sheet.displayName = "Sheet";

export { Sheet };
export type { SheetProps, SheetSide };

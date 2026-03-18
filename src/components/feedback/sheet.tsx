"use client";

import {
  forwardRef,
  useEffect,
  useState,
  useCallback,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
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
  lg: {
    left: "w-[32rem]",
    right: "w-[32rem]",
    top: "h-96",
    bottom: "h-96",
  },
  xl: {
    left: "w-[40rem]",
    right: "w-[40rem]",
    top: "h-[32rem]",
    bottom: "h-[32rem]",
  },
  full: {
    left: "w-screen",
    right: "w-screen",
    top: "h-screen",
    bottom: "h-screen",
  },
};

const positionMap: Record<SheetSide, string> = {
  left: "inset-y-0 left-0",
  right: "inset-y-0 right-0",
  top: "inset-x-0 top-0",
  bottom: "inset-x-0 bottom-0",
};

/** CSS translate for the off-screen (hidden) position */
const hiddenTranslateMap: Record<SheetSide, string> = {
  right: "translate-x-full",
  left: "-translate-x-full",
  top: "-translate-y-full",
  bottom: "translate-y-full",
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
    // isMounted keeps the DOM present during exit animation
    const [isMounted, setIsMounted] = useState(open);
    // isVisible drives the CSS transition classes (true = on-screen, false = off-screen)
    const [isVisible, setIsVisible] = useState(false);
    const panelRef = useRef<HTMLDivElement | null>(null);

    // When open becomes true → mount first, then trigger visible on next frame
    // When open becomes false → trigger exit animation (visible = false)
    useEffect(() => {
      if (open) {
        setIsMounted(true);
        // Double-rAF ensures the initial (hidden) styles are painted before we
        // toggle to visible, so the browser registers the transition.
        const id = requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
        });
        return () => cancelAnimationFrame(id);
      } else {
        setIsVisible(false);
      }
    }, [open]);

    // Unmount after exit transition completes
    const handleTransitionEnd = useCallback(() => {
      if (!open) {
        setIsMounted(false);
      }
    }, [open]);

    // Escape key handler
    useEffect(() => {
      if (!open || !closeOnEscape) return;
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onOpenChange(false);
      };
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [open, closeOnEscape, onOpenChange]);

    // Lock body scroll while open
    useEffect(() => {
      if (open) {
        document.body.style.overflow = "hidden";
        return () => {
          document.body.style.overflow = "";
        };
      }
    }, [open]);

    // Merge forwarded ref with internal ref
    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        panelRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref]
    );

    if (!isMounted) return null;

    return (
      <div
        className="fixed inset-0 z-50"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Overlay — fade in/out */}
        <div
          className={cn(
            "absolute inset-0 bg-black/40 backdrop-blur-sm",
            "transition-opacity duration-200",
            isVisible ? "opacity-100 ease-out" : "opacity-0 ease-in"
          )}
          onClick={closeOnOverlayClick ? () => onOpenChange(false) : undefined}
        />
        {/* Panel — slide + fade */}
        <div
          ref={mergedRef}
          onTransitionEnd={handleTransitionEnd}
          className={cn(
            "absolute bg-white shadow-float flex flex-col",
            positionMap[side],
            sizeMap[size][side],
            (side === "left" || side === "right") && "h-full",
            (side === "top" || side === "bottom") && "w-full",
            // Transition: transform + opacity, 300ms
            "transition-[transform,opacity] duration-300",
            isVisible
              ? "translate-x-0 translate-y-0 opacity-100 ease-out"
              : cn(hiddenTranslateMap[side], "opacity-0 ease-in"),
            // Reduced motion: skip slide, keep fade only
            "motion-reduce:transition-opacity motion-reduce:translate-x-0 motion-reduce:translate-y-0",
            className
          )}
          {...props}
        >
          {/* Header */}
          {(title || header || showClose) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              {header ?? (
                <div>
                  {title && (
                    <h2 className="text-lg font-bold text-secondary">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-sm text-slate-500 mt-0.5">
                      {description}
                    </p>
                  )}
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
          <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-slate-100">{footer}</div>
          )}
        </div>
      </div>
    );
  }
);
Sheet.displayName = "Sheet";

export { Sheet };
export type { SheetProps, SheetSide };

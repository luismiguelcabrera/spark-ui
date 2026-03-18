"use client";

import {
  forwardRef,
  useRef,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";
import { useControllable } from "../../hooks/use-controllable";

type SwipeableDrawerSide = "left" | "right" | "bottom";

type SwipeableDrawerProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: SwipeableDrawerSide;
  children: ReactNode;
  swipeThreshold?: number;
  swipeAreaWidth?: number;
  title?: string;
  overlay?: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
};

function normalizeSize(value: number | string | undefined, fallback: string): string {
  if (value === undefined) return fallback;
  return typeof value === "number" ? `${value}px` : value;
}

const SwipeableDrawer = forwardRef<HTMLDivElement, SwipeableDrawerProps>(
  (
    {
      open,
      defaultOpen,
      onOpenChange,
      side = "left",
      children,
      swipeThreshold = 50,
      swipeAreaWidth = 20,
      title,
      overlay = true,
      width,
      height,
      className,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useControllable({
      value: open,
      defaultValue: defaultOpen ?? false,
      onChange: onOpenChange,
    });

    const [swipeOffset, setSwipeOffset] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const startRef = useRef({ x: 0, y: 0 });
    const drawerRef = useRef<HTMLDivElement>(null);
    const swipeSourceRef = useRef<"edge" | "drawer" | null>(null);

    const drawerWidth = normalizeSize(width, "300px");
    const drawerHeight = normalizeSize(height, "50vh");

    // Close on Escape
    useEffect(() => {
      if (!isOpen) return;
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsOpen(false);
      };
      if (typeof document !== "undefined") {
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
      }
    }, [isOpen, setIsOpen]);

    // Lock body scroll when open
    useEffect(() => {
      if (typeof document === "undefined") return;
      if (isOpen) {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
          document.body.style.overflow = prev;
        };
      }
    }, [isOpen]);

    const getDrawerSize = useCallback((): number => {
      if (side === "bottom") {
        const el = drawerRef.current;
        return el ? el.offsetHeight : 300;
      }
      const el = drawerRef.current;
      return el ? el.offsetWidth : 300;
    }, [side]);

    // Edge swipe to open
    const handleEdgeTouchStart = useCallback(
      (e: React.TouchEvent) => {
        if (isOpen) return;
        startRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        swipeSourceRef.current = "edge";
        setIsSwiping(true);
      },
      [isOpen]
    );

    const handleEdgeTouchMove = useCallback(
      (e: React.TouchEvent) => {
        if (!isSwiping || swipeSourceRef.current !== "edge") return;
        const dx = e.touches[0].clientX - startRef.current.x;
        const dy = e.touches[0].clientY - startRef.current.y;

        if (side === "bottom") {
          // Swipe up from bottom edge to open
          const offset = Math.max(0, -dy);
          setSwipeOffset(offset);
        } else if (side === "left") {
          const offset = Math.max(0, dx);
          setSwipeOffset(offset);
        } else {
          // right
          const offset = Math.max(0, -dx);
          setSwipeOffset(offset);
        }
      },
      [isSwiping, side]
    );

    const handleEdgeTouchEnd = useCallback(() => {
      if (swipeSourceRef.current !== "edge") return;
      const size = getDrawerSize();
      const thresholdPx = (size * swipeThreshold) / 100;

      if (swipeOffset >= thresholdPx) {
        setIsOpen(true);
      }
      setSwipeOffset(0);
      setIsSwiping(false);
      swipeSourceRef.current = null;
    }, [swipeOffset, swipeThreshold, getDrawerSize, setIsOpen]);

    // Drawer swipe to close
    const handleDrawerTouchStart = useCallback(
      (e: React.TouchEvent) => {
        if (!isOpen) return;
        startRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        swipeSourceRef.current = "drawer";
        setIsSwiping(true);
      },
      [isOpen]
    );

    const handleDrawerTouchMove = useCallback(
      (e: React.TouchEvent) => {
        if (!isSwiping || swipeSourceRef.current !== "drawer") return;
        const dx = e.touches[0].clientX - startRef.current.x;
        const dy = e.touches[0].clientY - startRef.current.y;

        if (side === "left") {
          const offset = Math.max(0, -dx);
          setSwipeOffset(offset);
        } else if (side === "right") {
          const offset = Math.max(0, dx);
          setSwipeOffset(offset);
        } else {
          // bottom
          const offset = Math.max(0, dy);
          setSwipeOffset(offset);
        }
      },
      [isSwiping, side]
    );

    const handleDrawerTouchEnd = useCallback(() => {
      if (swipeSourceRef.current !== "drawer") return;
      const size = getDrawerSize();
      const thresholdPx = (size * swipeThreshold) / 100;

      if (swipeOffset >= thresholdPx) {
        setIsOpen(false);
      }
      setSwipeOffset(0);
      setIsSwiping(false);
      swipeSourceRef.current = null;
    }, [swipeOffset, swipeThreshold, getDrawerSize, setIsOpen]);

    const handleOverlayClick = useCallback(
      (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
          setIsOpen(false);
        }
      },
      [setIsOpen]
    );

    // Compute the drawer transform
    const getDrawerTransform = (): string => {
      if (isOpen) {
        // When open, swipeOffset moves it toward closed
        if (side === "left") return `translateX(-${swipeOffset}px)`;
        if (side === "right") return `translateX(${swipeOffset}px)`;
        return `translateY(${swipeOffset}px)`;
      } else {
        // When closed, swipeOffset moves it toward open
        if (side === "left") return `translateX(calc(-100% + ${swipeOffset}px))`;
        if (side === "right") return `translateX(calc(100% - ${swipeOffset}px))`;
        return `translateY(calc(100% - ${swipeOffset}px))`;
      }
    };

    // Edge swipe area positioning
    const edgeAreaStyle: React.CSSProperties =
      side === "left"
        ? { left: 0, top: 0, bottom: 0, width: `${swipeAreaWidth}px` }
        : side === "right"
          ? { right: 0, top: 0, bottom: 0, width: `${swipeAreaWidth}px` }
          : { bottom: 0, left: 0, right: 0, height: `${swipeAreaWidth}px` };

    // Drawer positioning and sizing
    const drawerStyle: React.CSSProperties = {
      ...(side === "left" && { left: 0, top: 0, bottom: 0, width: drawerWidth }),
      ...(side === "right" && {
        right: 0,
        top: 0,
        bottom: 0,
        width: drawerWidth,
      }),
      ...(side === "bottom" && {
        bottom: 0,
        left: 0,
        right: 0,
        height: drawerHeight,
      }),
      transform: getDrawerTransform(),
    };

    // Compute overlay opacity based on swipe
    const getOverlayOpacity = (): number => {
      if (!overlay) return 0;
      if (isOpen) {
        const size = getDrawerSize();
        return size > 0 ? Math.max(0, 1 - swipeOffset / size) : 1;
      }
      if (isSwiping && swipeSourceRef.current === "edge") {
        const size = getDrawerSize();
        return size > 0 ? Math.min(1, swipeOffset / size) : 0;
      }
      return 0;
    };

    const showOverlayEl = isOpen || (isSwiping && swipeSourceRef.current === "edge");

    return (
      <div ref={ref}>
        {/* Invisible edge swipe area */}
        {!isOpen && (
          <div
            data-testid="swipe-edge-area"
            className="fixed z-40"
            style={edgeAreaStyle}
            onTouchStart={handleEdgeTouchStart}
            onTouchMove={handleEdgeTouchMove}
            onTouchEnd={handleEdgeTouchEnd}
            aria-hidden="true"
          />
        )}

        {/* Overlay */}
        {showOverlayEl && overlay && (
          <div
            data-testid="drawer-overlay"
            className={cn(
              "fixed inset-0 z-40 bg-black/40",
              !isSwiping && "transition-opacity duration-300"
            )}
            style={{ opacity: getOverlayOpacity() }}
            onClick={handleOverlayClick}
            aria-hidden="true"
          />
        )}

        {/* Drawer panel */}
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal={isOpen ? true : undefined}
          aria-label={title || "Drawer"}
          data-testid="swipeable-drawer"
          className={cn(
            "fixed z-50 bg-white shadow-float flex flex-col overflow-hidden",
            !isSwiping && "transition-transform duration-300 ease-out",
            side === "left" && "rounded-r-2xl",
            side === "right" && "rounded-l-2xl",
            side === "bottom" && "rounded-t-2xl",
            className
          )}
          style={drawerStyle}
          onTouchStart={handleDrawerTouchStart}
          onTouchMove={handleDrawerTouchMove}
          onTouchEnd={handleDrawerTouchEnd}
        >
          {/* Drag handle for bottom drawer */}
          {side === "bottom" && (
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-slate-200 rounded-full" />
            </div>
          )}

          {/* Header with title */}
          {title && (
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0">
              <h2 className="text-base font-bold text-slate-900">{title}</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
                aria-label="Close drawer"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    );
  }
);

SwipeableDrawer.displayName = "SwipeableDrawer";

export { SwipeableDrawer };
export type { SwipeableDrawerProps, SwipeableDrawerSide };

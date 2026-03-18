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
  /** Enable swipe-to-close gesture on the sheet panel (default false) */
  swipeable?: boolean;
  /** Enable swipe-from-edge-to-open gesture (default false) */
  edgeSwipeable?: boolean;
  /** Distance in px the user must swipe to trigger close/open (default 100) */
  swipeThreshold?: number;
  /** Width in px of the invisible edge swipe detection area (default 20) */
  edgeWidth?: number;
  /** Callback when the sheet is opened via an edge swipe gesture */
  onSwipeOpen?: () => void;
  /** Show a drag handle indicator on the sheet panel (default false) */
  showDragHandle?: boolean;
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

/** Edge swipe area CSS positioning by side */
const edgeAreaPositionMap: Record<SheetSide, (width: number) => React.CSSProperties> = {
  left: (w) => ({ left: 0, top: 0, bottom: 0, width: `${w}px` }),
  right: (w) => ({ right: 0, top: 0, bottom: 0, width: `${w}px` }),
  top: (w) => ({ top: 0, left: 0, right: 0, height: `${w}px` }),
  bottom: (w) => ({ bottom: 0, left: 0, right: 0, height: `${w}px` }),
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
      swipeable = false,
      edgeSwipeable = false,
      swipeThreshold = 100,
      edgeWidth = 20,
      onSwipeOpen,
      showDragHandle = false,
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

    // --- Swipe gesture state ---
    const [swipeOffset, setSwipeOffset] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const swipeStartRef = useRef({ x: 0, y: 0 });
    const swipeSourceRef = useRef<"edge" | "panel" | null>(null);

    const swipeEnabled = swipeable || edgeSwipeable;

    // When open becomes true -> mount first, then trigger visible on next frame
    // When open becomes false -> trigger exit animation (visible = false)
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

    // --- Swipe gesture helpers ---

    /** Get the panel's relevant dimension (width for left/right, height for top/bottom) */
    const getPanelSize = useCallback((): number => {
      const el = panelRef.current;
      if (!el) return 300;
      return side === "top" || side === "bottom" ? el.offsetHeight : el.offsetWidth;
    }, [side]);

    /**
     * Compute the swipe delta along the relevant axis.
     * For "close" gestures: positive = moving toward closed edge.
     * For "open" gestures (edge swipe): positive = moving toward open position.
     */
    const getSwipeDelta = useCallback(
      (clientX: number, clientY: number, source: "edge" | "panel"): number => {
        const dx = clientX - swipeStartRef.current.x;
        const dy = clientY - swipeStartRef.current.y;

        if (source === "panel") {
          // Swiping a panel to close: measure movement toward the sheet's origin side
          switch (side) {
            case "left":
              return Math.max(0, -dx);
            case "right":
              return Math.max(0, dx);
            case "top":
              return Math.max(0, -dy);
            case "bottom":
              return Math.max(0, dy);
          }
        } else {
          // Edge swipe to open: measure movement away from the edge
          switch (side) {
            case "left":
              return Math.max(0, dx);
            case "right":
              return Math.max(0, -dx);
            case "top":
              return Math.max(0, dy);
            case "bottom":
              return Math.max(0, -dy);
          }
        }
      },
      [side]
    );

    // --- Edge swipe to open ---
    const handleEdgeTouchStart = useCallback(
      (e: React.TouchEvent) => {
        if (open) return;
        swipeStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        swipeSourceRef.current = "edge";
        setIsSwiping(true);
      },
      [open]
    );

    const handleEdgeTouchMove = useCallback(
      (e: React.TouchEvent) => {
        if (!isSwiping || swipeSourceRef.current !== "edge") return;
        const delta = getSwipeDelta(e.touches[0].clientX, e.touches[0].clientY, "edge");
        setSwipeOffset(delta);
      },
      [isSwiping, getSwipeDelta]
    );

    const handleEdgeTouchEnd = useCallback(() => {
      if (swipeSourceRef.current !== "edge") return;
      if (swipeOffset >= swipeThreshold) {
        onOpenChange(true);
        onSwipeOpen?.();
      }
      setSwipeOffset(0);
      setIsSwiping(false);
      swipeSourceRef.current = null;
    }, [swipeOffset, swipeThreshold, onOpenChange, onSwipeOpen]);

    // --- Panel swipe to close ---
    const handlePanelTouchStart = useCallback(
      (e: React.TouchEvent) => {
        if (!open || !swipeable) return;
        swipeStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        swipeSourceRef.current = "panel";
        setIsSwiping(true);
      },
      [open, swipeable]
    );

    const handlePanelTouchMove = useCallback(
      (e: React.TouchEvent) => {
        if (!isSwiping || swipeSourceRef.current !== "panel") return;
        const delta = getSwipeDelta(e.touches[0].clientX, e.touches[0].clientY, "panel");
        setSwipeOffset(delta);
      },
      [isSwiping, getSwipeDelta]
    );

    const handlePanelTouchEnd = useCallback(() => {
      if (swipeSourceRef.current !== "panel") return;
      if (swipeOffset >= swipeThreshold) {
        onOpenChange(false);
      }
      setSwipeOffset(0);
      setIsSwiping(false);
      swipeSourceRef.current = null;
    }, [swipeOffset, swipeThreshold, onOpenChange]);

    // --- Compute inline swipe transform for the panel ---
    const getSwipeTransform = (): string | undefined => {
      if (!swipeEnabled || !isSwiping || swipeOffset === 0) return undefined;

      if (swipeSourceRef.current === "panel") {
        // Swiping panel toward its origin edge (closing)
        switch (side) {
          case "left":
            return `translateX(-${swipeOffset}px)`;
          case "right":
            return `translateX(${swipeOffset}px)`;
          case "top":
            return `translateY(-${swipeOffset}px)`;
          case "bottom":
            return `translateY(${swipeOffset}px)`;
        }
      }

      // Edge swipe: panel starts off-screen, translate it into view
      if (swipeSourceRef.current === "edge") {
        const panelSize = getPanelSize();
        const remaining = Math.max(0, panelSize - swipeOffset);
        switch (side) {
          case "left":
            return `translateX(-${remaining}px)`;
          case "right":
            return `translateX(${remaining}px)`;
          case "top":
            return `translateY(-${remaining}px)`;
          case "bottom":
            return `translateY(${remaining}px)`;
        }
      }

      return undefined;
    };

    // --- Compute overlay opacity during swipe ---
    const getSwipeOverlayOpacity = (): number | undefined => {
      if (!swipeEnabled || !isSwiping || swipeOffset === 0) return undefined;

      const panelSize = getPanelSize();
      if (panelSize <= 0) return undefined;

      if (swipeSourceRef.current === "panel") {
        // Fading out as user drags panel away
        return Math.max(0, 1 - swipeOffset / panelSize);
      }
      if (swipeSourceRef.current === "edge") {
        // Fading in as user drags panel into view
        return Math.min(1, swipeOffset / panelSize);
      }

      return undefined;
    };

    // Edge swipe area (rendered when sheet is closed and edgeSwipeable is true)
    const edgeSwipeArea =
      edgeSwipeable && !open ? (
        <div
          data-testid="swipe-edge-area"
          className="fixed z-50"
          style={edgeAreaPositionMap[side](edgeWidth)}
          onTouchStart={handleEdgeTouchStart}
          onTouchMove={handleEdgeTouchMove}
          onTouchEnd={handleEdgeTouchEnd}
          aria-hidden="true"
        />
      ) : null;

    // When not mounted and no edge swiping is happening, only render edge area
    // eslint-disable-next-line react-hooks/refs -- intentional: read swipe source ref to determine render path
    if (!isMounted && !(isSwiping && swipeSourceRef.current === "edge")) {
      return edgeSwipeArea;
    }

    const swipeTransform = getSwipeTransform(); // eslint-disable-line react-hooks/refs -- intentional: compute swipe transform from ref-based gesture state
    const swipeOverlayOpacity = getSwipeOverlayOpacity(); // eslint-disable-line react-hooks/refs -- intentional: compute overlay opacity from ref-based gesture state

    return (
      <>
        {edgeSwipeArea}
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          {/* Overlay -- fade in/out */}
          <div
            className={cn(
              "absolute inset-0 bg-black/40 backdrop-blur-sm",
              !isSwiping && "transition-opacity duration-200",
              isVisible ? "opacity-100 ease-out" : "opacity-0 ease-in"
            )}
            style={swipeOverlayOpacity !== undefined ? { opacity: swipeOverlayOpacity } : undefined}
            onClick={closeOnOverlayClick ? () => onOpenChange(false) : undefined}
          />
          {/* Panel -- slide + fade */}
          <div
            ref={mergedRef}
            onTransitionEnd={handleTransitionEnd}
            onTouchStart={swipeable ? handlePanelTouchStart : undefined}
            onTouchMove={swipeable ? handlePanelTouchMove : undefined}
            onTouchEnd={swipeable ? handlePanelTouchEnd : undefined}
            className={cn(
              "absolute bg-white shadow-float flex flex-col",
              positionMap[side],
              sizeMap[size][side],
              (side === "left" || side === "right") && "h-full",
              (side === "top" || side === "bottom") && "w-full",
              // Transition: transform + opacity, 300ms (disabled during swipe)
              !isSwiping && "transition-[transform,opacity] duration-300",
              isVisible
                ? "translate-x-0 translate-y-0 opacity-100 ease-out"
                : cn(hiddenTranslateMap[side], "opacity-0 ease-in"),
              // Reduced motion: skip slide, keep fade only
              "motion-reduce:transition-opacity motion-reduce:translate-x-0 motion-reduce:translate-y-0",
              className
            )}
            style={swipeTransform ? { transform: swipeTransform } : undefined}
            {...props}
          >
            {/* Drag handle */}
            {showDragHandle && (
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 h-1 bg-slate-200 rounded-full" />
              </div>
            )}
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
      </>
    );
  }
);
Sheet.displayName = "Sheet";

export { Sheet };
export type { SheetProps, SheetSide };

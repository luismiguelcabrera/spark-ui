"use client";

import { forwardRef, useState, useRef, useCallback, useEffect } from "react";
import { cn } from "../../lib/utils";

type ScrollShadowOrientation = "horizontal" | "vertical" | "both";

type ScrollShadowProps = {
  /** Scroll direction to track */
  orientation?: ScrollShadowOrientation;
  /** Shadow size in pixels */
  size?: number;
  /** Additional class names */
  className?: string;
  /** Content to render inside the scrollable area */
  children: React.ReactNode;
  /** Hide the native scrollbar */
  hideScrollbar?: boolean;
};

const ScrollShadow = forwardRef<HTMLDivElement, ScrollShadowProps>(
  (
    {
      orientation = "vertical",
      size = 40,
      className,
      children,
      hideScrollbar = false,
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLDivElement>(null);
    const [scrollState, setScrollState] = useState({
      top: false,
      bottom: false,
      left: false,
      right: false,
    });

    const updateScrollState = useCallback(() => {
      const el = innerRef.current;
      if (!el) return;

      const showVertical = orientation === "vertical" || orientation === "both";
      const showHorizontal =
        orientation === "horizontal" || orientation === "both";

      setScrollState({
        top: showVertical && el.scrollTop > 0,
        bottom:
          showVertical &&
          el.scrollTop + el.clientHeight < el.scrollHeight - 1,
        left: showHorizontal && el.scrollLeft > 0,
        right:
          showHorizontal &&
          el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
      });
    }, [orientation]);

    useEffect(() => {
      updateScrollState();

      const el = innerRef.current;
      if (!el) return;

      if (typeof ResizeObserver !== "undefined") {
        const observer = new ResizeObserver(updateScrollState);
        observer.observe(el);
        return () => observer.disconnect();
      }
    }, [updateScrollState]);

    const overflowClass =
      orientation === "vertical"
        ? "overflow-y-auto overflow-x-hidden"
        : orientation === "horizontal"
          ? "overflow-x-auto overflow-y-hidden"
          : "overflow-auto";

    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        data-top-scroll={scrollState.top || undefined}
        data-bottom-scroll={scrollState.bottom || undefined}
        data-left-scroll={scrollState.left || undefined}
        data-right-scroll={scrollState.right || undefined}
      >
        {/* Top shadow */}
        {(orientation === "vertical" || orientation === "both") && (
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute left-0 right-0 top-0 z-10 transition-opacity duration-200",
              scrollState.top ? "opacity-100" : "opacity-0",
            )}
            style={{
              height: `${size}px`,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.08), transparent)",
            }}
          />
        )}

        {/* Bottom shadow */}
        {(orientation === "vertical" || orientation === "both") && (
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute bottom-0 left-0 right-0 z-10 transition-opacity duration-200",
              scrollState.bottom ? "opacity-100" : "opacity-0",
            )}
            style={{
              height: `${size}px`,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.08), transparent)",
            }}
          />
        )}

        {/* Left shadow */}
        {(orientation === "horizontal" || orientation === "both") && (
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute bottom-0 left-0 top-0 z-10 transition-opacity duration-200",
              scrollState.left ? "opacity-100" : "opacity-0",
            )}
            style={{
              width: `${size}px`,
              background:
                "linear-gradient(to right, rgba(0,0,0,0.08), transparent)",
            }}
          />
        )}

        {/* Right shadow */}
        {(orientation === "horizontal" || orientation === "both") && (
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute bottom-0 right-0 top-0 z-10 transition-opacity duration-200",
              scrollState.right ? "opacity-100" : "opacity-0",
            )}
            style={{
              width: `${size}px`,
              background:
                "linear-gradient(to left, rgba(0,0,0,0.08), transparent)",
            }}
          />
        )}

        <div
          ref={innerRef}
          onScroll={updateScrollState}
          className={cn(
            "h-full w-full",
            overflowClass,
            hideScrollbar &&
              "scrollbar-none [&::-webkit-scrollbar]:hidden",
          )}
        >
          {children}
        </div>
      </div>
    );
  },
);
ScrollShadow.displayName = "ScrollShadow";

export { ScrollShadow };
export type { ScrollShadowProps, ScrollShadowOrientation };

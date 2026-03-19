"use client";

import {
  forwardRef,
  useRef,
  useState,
  useEffect,
  useCallback,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";

type SlideGroupProps = HTMLAttributes<HTMLDivElement> & {
  /** Scrollable content */
  children?: ReactNode;
  /** Show left/right arrow buttons when content overflows */
  showArrows?: boolean;
  /** Center the active child (not implemented — reserved for future use) */
  centerActive?: boolean;
};

const SCROLL_AMOUNT = 200;

const SlideGroup = forwardRef<HTMLDivElement, SlideGroupProps>(
  ({ className, children, showArrows = true, centerActive: _centerActive = false, ...props }, ref) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateArrows = useCallback(() => {
      const el = scrollRef.current;
      if (!el) return;
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }, []);

    useEffect(() => {
      const el = scrollRef.current;
      if (!el) return;

      updateArrows();

      el.addEventListener("scroll", updateArrows, { passive: true });

      let ro: ResizeObserver | undefined;
      if (typeof ResizeObserver !== "undefined") {
        ro = new ResizeObserver(updateArrows);
        ro.observe(el);
      }

      return () => {
        el.removeEventListener("scroll", updateArrows);
        ro?.disconnect();
      };
    }, [updateArrows]);

    const scroll = (direction: "left" | "right") => {
      const el = scrollRef.current;
      if (!el) return;
      const amount = direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT;
      el.scrollBy({ left: amount, behavior: "smooth" });
    };

    return (
      <div ref={ref} className={cn("relative flex items-center", className)} {...props}>
        {showArrows && canScrollLeft && (
          <button
            type="button"
            className="absolute left-0 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 text-slate-600 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <Icon name="chevron-left" size="sm" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide gap-2 w-full"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          tabIndex={0}
        >
          {children}
        </div>

        {showArrows && canScrollRight && (
          <button
            type="button"
            className="absolute right-0 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 text-slate-600 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <Icon name="chevron-right" size="sm" />
          </button>
        )}
      </div>
    );
  }
);
SlideGroup.displayName = "SlideGroup";

export { SlideGroup };
export type { SlideGroupProps };

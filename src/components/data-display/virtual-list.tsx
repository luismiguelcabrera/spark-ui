"use client";

import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type VirtualListProps<T> = {
  /** Array of items to render */
  items: T[];
  /** Fixed height of each row in pixels */
  itemHeight: number;
  /** Height of the scrollable container in pixels */
  height: number;
  /** Width of the container (CSS value, default "100%") */
  width?: number | string;
  /** Number of extra rows to render above/below the visible area */
  overscan?: number;
  /** Render function for each item */
  renderItem: (item: T, index: number) => ReactNode;
  /** Extract a unique key from each item (defaults to index) */
  getKey?: (item: T, index: number) => string | number;
  /** Additional class names for the outer scroll container */
  className?: string;
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

function VirtualListInner<T>(
  {
    items,
    itemHeight,
    height,
    width = "100%",
    overscan = 3,
    renderItem,
    getKey,
    className,
  }: VirtualListProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;

  // Calculate visible range
  const { visibleItems } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(height / itemHeight);
    const end = Math.min(items.length - 1, start + visibleCount + overscan * 2);

    const visible: Array<{ item: T; index: number }> = [];
    for (let i = start; i <= end; i++) {
      visible.push({ item: items[i], index: i });
    }

    return { startIndex: start, endIndex: end, visibleItems: visible };
  }, [scrollTop, itemHeight, height, overscan, items]);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  // Sync scroll on mount and when items change
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const containerStyle: React.CSSProperties = {
    height: typeof height === "number" ? `${height}px` : height,
    width: typeof width === "number" ? `${width}px` : width,
    overflow: "auto",
  };

  return (
    <div
      ref={(el) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }}
      role="list"
      aria-label="Virtual list"
      tabIndex={0}
      className={cn(
        "relative",
        "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30",
        className,
      )}
      style={containerStyle}
    >
      {/* Spacer div to maintain total scroll height */}
      <div style={{ height: `${totalHeight}px`, position: "relative" }}>
        {visibleItems.map(({ item, index }) => (
          <div
            key={getKey ? getKey(item, index) : index}
            role="listitem"
            data-index={index}
            style={{
              position: "absolute",
              top: `${index * itemHeight}px`,
              left: 0,
              right: 0,
              height: `${itemHeight}px`,
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

const VirtualList = forwardRef(VirtualListInner) as <T>(
  props: VirtualListProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement | null;

(VirtualList as { displayName?: string }).displayName = "VirtualList";

export { VirtualList };
export type { VirtualListProps };

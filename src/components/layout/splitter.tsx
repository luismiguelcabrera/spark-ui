"use client";

import {
  forwardRef,
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { cn } from "../../lib/utils";

type SplitterOrientation = "horizontal" | "vertical";

type SplitterProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Exactly two panes */
  children: [ReactNode, ReactNode];
  /** Layout direction: horizontal = side by side, vertical = top/bottom */
  orientation?: SplitterOrientation;
  /** Initial size of the first pane in % (0-100) */
  defaultSize?: number;
  /** Minimum % for the first pane */
  minSize?: number;
  /** Maximum % for the first pane */
  maxSize?: number;
  /** Called when the divider is dragged */
  onResize?: (size: number) => void;
  /** Divider width/height in px */
  gutterSize?: number;
};

const Splitter = forwardRef<HTMLDivElement, SplitterProps>(
  (
    {
      children,
      orientation = "horizontal",
      defaultSize = 50,
      minSize = 10,
      maxSize = 90,
      onResize,
      gutterSize = 8,
      className,
      ...props
    },
    ref
  ) => {
    const [size, setSize] = useState(() =>
      Math.min(maxSize, Math.max(minSize, defaultSize))
    );
    const containerRef = useRef<HTMLDivElement | null>(null);
    const isDragging = useRef(false);

    const isHorizontal = orientation === "horizontal";

    const clamp = useCallback(
      (val: number) => Math.min(maxSize, Math.max(minSize, val)),
      [minSize, maxSize]
    );

    const getSizeFromPointer = useCallback(
      (clientX: number, clientY: number) => {
        const container = containerRef.current;
        if (!container) return size;
        const rect = container.getBoundingClientRect();
        if (isHorizontal) {
          const totalWidth = rect.width - gutterSize;
          const offset = clientX - rect.left - gutterSize / 2;
          return clamp((offset / totalWidth) * 100);
        } else {
          const totalHeight = rect.height - gutterSize;
          const offset = clientY - rect.top - gutterSize / 2;
          return clamp((offset / totalHeight) * 100);
        }
      },
      [isHorizontal, gutterSize, clamp, size]
    );

    const updateSize = useCallback(
      (newSize: number) => {
        setSize(newSize);
        onResize?.(newSize);
      },
      [onResize]
    );

    // Mouse drag
    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        isDragging.current = true;
        document.body.style.cursor = isHorizontal
          ? "col-resize"
          : "row-resize";
        document.body.style.userSelect = "none";

        const handleMouseMove = (ev: MouseEvent) => {
          if (!isDragging.current) return;
          const newSize = getSizeFromPointer(ev.clientX, ev.clientY);
          updateSize(newSize);
        };

        const handleMouseUp = () => {
          isDragging.current = false;
          document.body.style.cursor = "";
          document.body.style.userSelect = "";
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      },
      [isHorizontal, getSizeFromPointer, updateSize]
    );

    // Touch drag
    const handleTouchStart = useCallback(
      (e: React.TouchEvent) => {
        isDragging.current = true;

        const handleTouchMove = (ev: TouchEvent) => {
          if (!isDragging.current) return;
          const touch = ev.touches[0];
          const newSize = getSizeFromPointer(touch.clientX, touch.clientY);
          updateSize(newSize);
        };

        const handleTouchEnd = () => {
          isDragging.current = false;
          document.removeEventListener("touchmove", handleTouchMove);
          document.removeEventListener("touchend", handleTouchEnd);
        };

        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("touchend", handleTouchEnd);
      },
      [getSizeFromPointer, updateSize]
    );

    // Keyboard
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        const step = e.shiftKey ? 5 : 1;
        const increaseKeys = isHorizontal
          ? ["ArrowRight"]
          : ["ArrowDown"];
        const decreaseKeys = isHorizontal
          ? ["ArrowLeft"]
          : ["ArrowUp"];

        if (increaseKeys.includes(e.key)) {
          e.preventDefault();
          updateSize(clamp(size + step));
        } else if (decreaseKeys.includes(e.key)) {
          e.preventDefault();
          updateSize(clamp(size - step));
        } else if (e.key === "Home") {
          e.preventDefault();
          updateSize(minSize);
        } else if (e.key === "End") {
          e.preventDefault();
          updateSize(maxSize);
        }
      },
      [isHorizontal, size, clamp, updateSize, minSize, maxSize]
    );

    // Merge refs
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current =
            node;
        }
      },
      [ref]
    );

    const [pane1, pane2] = children;

    return (
      <div
        ref={setRefs}
        className={cn(
          "flex overflow-hidden",
          isHorizontal ? "flex-row" : "flex-col",
          className
        )}
        data-orientation={orientation}
        {...props}
      >
        {/* First pane */}
        <div
          data-testid="splitter-pane-1"
          className="overflow-auto"
          style={
            isHorizontal
              ? { width: `calc(${size}% - ${gutterSize / 2}px)`, flexShrink: 0 }
              : { height: `calc(${size}% - ${gutterSize / 2}px)`, flexShrink: 0 }
          }
        >
          {pane1}
        </div>

        {/* Divider / gutter */}
        <div
          role="separator"
          tabIndex={0}
          aria-valuenow={Math.round(size)}
          aria-valuemin={minSize}
          aria-valuemax={maxSize}
          aria-orientation={orientation}
          aria-label="Resize"
          data-testid="splitter-gutter"
          className={cn(
            "relative flex shrink-0 items-center justify-center",
            "bg-slate-200 hover:bg-slate-300 active:bg-primary/30",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            "transition-colors",
            isHorizontal ? "cursor-col-resize" : "cursor-row-resize"
          )}
          style={
            isHorizontal
              ? { width: `${gutterSize}px` }
              : { height: `${gutterSize}px` }
          }
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onKeyDown={handleKeyDown}
        >
          {/* Handle dots */}
          <div
            className={cn(
              "flex gap-0.5",
              isHorizontal ? "flex-col" : "flex-row"
            )}
            aria-hidden="true"
          >
            <div className="h-1 w-1 rounded-full bg-slate-400" />
            <div className="h-1 w-1 rounded-full bg-slate-400" />
            <div className="h-1 w-1 rounded-full bg-slate-400" />
          </div>
        </div>

        {/* Second pane */}
        <div
          data-testid="splitter-pane-2"
          className="flex-1 overflow-auto"
        >
          {pane2}
        </div>
      </div>
    );
  }
);
Splitter.displayName = "Splitter";

export { Splitter };
export type { SplitterProps, SplitterOrientation };

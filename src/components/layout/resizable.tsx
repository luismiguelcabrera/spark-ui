"use client";

import { forwardRef, useState, useRef, useCallback, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type ResizableProps = HTMLAttributes<HTMLDivElement> & {
  /** Direction of resize */
  direction?: "horizontal" | "vertical";
  /** Minimum size in pixels */
  minSize?: number;
  /** Maximum size in pixels */
  maxSize?: number;
  /** Default size in pixels */
  defaultSize?: number;
  /** Callback when size changes */
  onResize?: (size: number) => void;
  /** Disabled state */
  disabled?: boolean;
};

const Resizable = forwardRef<HTMLDivElement, ResizableProps>(
  (
    {
      className,
      direction = "horizontal",
      minSize = 100,
      maxSize = Infinity,
      defaultSize = 300,
      onResize,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const [size, setSize] = useState(defaultSize);
    const [isDragging, setIsDragging] = useState(false);
    const startPos = useRef(0);
    const startSize = useRef(0);

    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        if (disabled) return;
        e.preventDefault();
        setIsDragging(true);
        startPos.current = direction === "horizontal" ? e.clientX : e.clientY;
        startSize.current = size;

        const handleMouseMove = (e: MouseEvent) => {
          const diff = direction === "horizontal"
            ? e.clientX - startPos.current
            : e.clientY - startPos.current;
          const newSize = Math.min(maxSize, Math.max(minSize, startSize.current + diff));
          setSize(newSize);
          onResize?.(newSize);
        };

        const handleMouseUp = () => {
          setIsDragging(false);
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      },
      [disabled, direction, size, minSize, maxSize, onResize]
    );

    const isHorizontal = direction === "horizontal";

    return (
      <div
        ref={ref}
        className={cn("relative flex", isHorizontal ? "flex-row" : "flex-col", className)}
        {...props}
      >
        <div
          style={isHorizontal ? { width: `${size}px` } : { height: `${size}px` }}
          className={cn("shrink-0 overflow-auto", isDragging && "select-none")}
        >
          {children}
        </div>
        <div
          className={cn(
            "relative z-10 flex items-center justify-center shrink-0 transition-colors",
            isHorizontal
              ? "w-1.5 cursor-col-resize hover:bg-primary/20 active:bg-primary/30"
              : "h-1.5 cursor-row-resize hover:bg-primary/20 active:bg-primary/30",
            disabled && "cursor-default hover:bg-transparent",
            isDragging && "bg-primary/30"
          )}
          onMouseDown={handleMouseDown}
        >
          <div
            className={cn(
              "rounded-full bg-muted-foreground/30",
              isHorizontal ? "w-0.5 h-8" : "h-0.5 w-8"
            )}
          />
        </div>
      </div>
    );
  }
);
Resizable.displayName = "Resizable";

export { Resizable };
export type { ResizableProps };

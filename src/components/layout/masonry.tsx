"use client";

import {
  forwardRef,
  Children,
  useMemo,
  useId,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { cn } from "../../lib/utils";

type MasonryColumns =
  | number
  | { sm?: number; md?: number; lg?: number; xl?: number };

type MasonryProps = HTMLAttributes<HTMLDivElement> & {
  /** Number of columns, or responsive breakpoint map */
  columns?: MasonryColumns;
  /** Gap between items in px */
  gap?: number;
  children: ReactNode;
};

const breakpoints: Record<string, string> = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
};

const Masonry = forwardRef<HTMLDivElement, MasonryProps>(
  ({ columns = 3, gap = 16, className, children, style, ...props }, ref) => {
    const id = useId();
    const stableId = useMemo(
      () => `masonry-${id.replace(/:/g, "")}`,
      [id]
    );

    const isResponsive = typeof columns === "object";

    const responsiveStyle = useMemo(() => {
      if (!isResponsive) return null;
      const cols = columns as { sm?: number; md?: number; lg?: number; xl?: number };

      // Build sorted breakpoint rules (mobile first)
      const rules: string[] = [];

      // Default: use the smallest defined breakpoint or 1 column
      const sortedKeys = (["sm", "md", "lg", "xl"] as const).filter(
        (k) => cols[k] !== undefined
      );

      const defaultCols = sortedKeys.length > 0 ? cols[sortedKeys[0]!]! : 1;
      rules.push(
        `.${stableId} { column-count: ${defaultCols}; column-gap: ${gap}px; }`
      );

      // Media queries for each breakpoint
      for (const key of sortedKeys) {
        const bp = breakpoints[key];
        const colCount = cols[key];
        if (bp && colCount !== undefined) {
          rules.push(
            `@media (min-width: ${bp}) { .${stableId} { column-count: ${colCount}; } }`
          );
        }
      }

      return rules.join("\n");
    }, [columns, gap, stableId, isResponsive]);

    const items = Children.toArray(children);

    return (
      <>
        {isResponsive && responsiveStyle && (
          <style dangerouslySetInnerHTML={{ __html: responsiveStyle }} />
        )}
        <div
          ref={ref}
          className={cn(isResponsive && stableId, className)}
          style={
            isResponsive
              ? style
              : {
                  columnCount: columns as number,
                  columnGap: `${gap}px`,
                  ...style,
                }
          }
          data-testid="masonry"
          {...props}
        >
          {items.map((child, i) => (
            <div
              key={i}
              style={{
                breakInside: "avoid",
                marginBottom: `${gap}px`,
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </>
    );
  }
);
Masonry.displayName = "Masonry";

export { Masonry };
export type { MasonryProps, MasonryColumns };

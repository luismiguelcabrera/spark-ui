import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type GridProps = HTMLAttributes<HTMLDivElement> & {
  /** Number of columns */
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  /** Gap between items */
  gap?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12";
  /** Row gap */
  rowGap?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12";
  /** Column gap */
  colGap?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12";
  /** Responsive flow */
  flow?: "row" | "col" | "dense" | "row-dense" | "col-dense";
  /** Alignment */
  align?: "start" | "center" | "end" | "stretch";
  /** Place items */
  placeItems?: "start" | "center" | "end" | "stretch";
};

const colsMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
};

const flowMap: Record<string, string> = {
  row: "grid-flow-row",
  col: "grid-flow-col",
  dense: "grid-flow-dense",
  "row-dense": "grid-flow-row-dense",
  "col-dense": "grid-flow-col-dense",
};

const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, gap = "4", rowGap, colGap, flow, align, placeItems, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "grid",
        colsMap[cols],
        !rowGap && !colGap && `gap-${gap}`,
        rowGap && `gap-y-${rowGap}`,
        colGap && `gap-x-${colGap}`,
        flow && flowMap[flow],
        align && `items-${align}`,
        placeItems && `place-items-${placeItems}`,
        className
      )}
      {...props}
    />
  )
);
Grid.displayName = "Grid";

type GridItemProps = HTMLAttributes<HTMLDivElement> & {
  /** Column span */
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "full";
  /** Start column */
  start?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
  /** Row span */
  rowSpan?: 1 | 2 | 3 | 4 | 5 | 6;
};

const spanMap: Record<string | number, string> = {
  1: "col-span-1", 2: "col-span-2", 3: "col-span-3", 4: "col-span-4",
  5: "col-span-5", 6: "col-span-6", 7: "col-span-7", 8: "col-span-8",
  9: "col-span-9", 10: "col-span-10", 11: "col-span-11", 12: "col-span-12",
  full: "col-span-full",
};

const startMap: Record<number, string> = {
  1: "col-start-1", 2: "col-start-2", 3: "col-start-3", 4: "col-start-4",
  5: "col-start-5", 6: "col-start-6", 7: "col-start-7", 8: "col-start-8",
  9: "col-start-9", 10: "col-start-10", 11: "col-start-11", 12: "col-start-12",
  13: "col-start-13",
};

const rowSpanMap: Record<number, string> = {
  1: "row-span-1", 2: "row-span-2", 3: "row-span-3",
  4: "row-span-4", 5: "row-span-5", 6: "row-span-6",
};

const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
  ({ className, span, start, rowSpan, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        span && spanMap[span],
        start && startMap[start],
        rowSpan && rowSpanMap[rowSpan],
        className
      )}
      {...props}
    />
  )
);
GridItem.displayName = "GridItem";

export { Grid, GridItem };
export type { GridProps, GridItemProps };

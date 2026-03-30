import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

/* ── DataList ─────────────────────────────────────────────────── */

type DataListProps = HTMLAttributes<HTMLDListElement> & {
  /** Orientation */
  orientation?: "horizontal" | "vertical";
  /** Number of columns for horizontal layout */
  cols?: 1 | 2 | 3 | 4;
};

const colsMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

const DataList = forwardRef<HTMLDListElement, DataListProps>(
  ({ className, orientation = "vertical", cols = 1, ...props }, ref) => (
    <dl
      ref={ref}
      className={cn(
        orientation === "horizontal"
          ? `grid ${colsMap[cols]} gap-4`
          : "space-y-3",
        className
      )}
      {...props}
    />
  )
);
DataList.displayName = "DataList";

/* ── DataListItem ──────────────────────────────────────────────── */

type DataListItemProps = HTMLAttributes<HTMLDivElement> & {
  /** Label text */
  label: string;
  /** Value content */
  value: React.ReactNode;
  /** Layout direction */
  direction?: "row" | "column";
};

const DataListItem = forwardRef<HTMLDivElement, DataListItemProps>(
  ({ className, label, value, direction = "column", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        direction === "row" ? "flex items-center justify-between" : "flex flex-col gap-0.5",
        className
      )}
      {...props}
    >
      <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</dt>
      <dd className="text-sm font-semibold text-secondary">{value}</dd>
    </div>
  )
);
DataListItem.displayName = "DataListItem";

export { DataList, DataListItem };
export type { DataListProps, DataListItemProps };

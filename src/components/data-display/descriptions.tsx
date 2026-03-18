"use client";

import React, { forwardRef, useMemo, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type DescriptionsItem = {
  label: string;
  children: ReactNode;
  span?: number;
  /** Custom className for this item's label */
  labelClassName?: string;
  /** Custom className for this item's value */
  contentClassName?: string;
};

type DescriptionsSize = "xs" | "sm" | "md" | "lg" | "xl";
type DescriptionsVariant = "plain" | "striped";

type DescriptionsProps = HTMLAttributes<HTMLDivElement> & {
  /** Optional title displayed above the descriptions */
  title?: string;
  /** Extra content rendered next to the title (e.g. action buttons, links) */
  extra?: ReactNode;
  /** Array of items to display */
  items: DescriptionsItem[];
  /** Number of columns */
  columns?: number;
  /** Show borders (table-like) */
  bordered?: boolean;
  /** Size variant */
  size?: DescriptionsSize;
  /** Layout direction for label and value */
  layout?: "horizontal" | "vertical";
  /** Show colon after labels */
  colon?: boolean;
  /** Visual variant */
  variant?: DescriptionsVariant;
  /** Responsive column stacking on small screens (default true) */
  responsive?: boolean;
  /** Heading level for the title (2-6, default 3) */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Fixed width for labels in horizontal layout (e.g. "120px", "8rem") */
  labelWidth?: string | number;
  /** Global className applied to all labels */
  labelClassName?: string;
  /** Global className applied to all values */
  contentClassName?: string;
};

const sizeStyles = {
  xs: {
    padding: "px-2 py-1",
    titleSize: "text-xs",
    labelSize: "text-[11px]",
    valueSize: "text-[11px]",
  },
  sm: {
    padding: "px-3 py-1.5",
    titleSize: "text-sm",
    labelSize: "text-xs",
    valueSize: "text-xs",
  },
  md: {
    padding: "px-4 py-2.5",
    titleSize: "text-base",
    labelSize: "text-sm",
    valueSize: "text-sm",
  },
  lg: {
    padding: "px-5 py-3.5",
    titleSize: "text-lg",
    labelSize: "text-sm",
    valueSize: "text-base",
  },
  xl: {
    padding: "px-6 py-4",
    titleSize: "text-xl",
    labelSize: "text-base",
    valueSize: "text-lg",
  },
} as const;

/** Render empty value placeholder when children is null/undefined/empty string */
function renderValue(children: ReactNode): ReactNode {
  if (children === null || children === undefined || children === "") {
    return <span className="text-text-secondary">&mdash;</span>;
  }
  return children;
}

/**
 * Distribute items into rows based on column count and span.
 * Each row accumulates items until the total span fills columns.
 */
function buildRows(
  items: DescriptionsItem[],
  columns: number
): DescriptionsItem[][] {
  const rows: DescriptionsItem[][] = [];
  let currentRow: DescriptionsItem[] = [];
  let currentSpan = 0;

  for (const item of items) {
    const span = Math.min(item.span ?? 1, columns);
    if (currentSpan + span > columns && currentRow.length > 0) {
      rows.push(currentRow);
      currentRow = [];
      currentSpan = 0;
    }
    currentRow.push({ ...item, span });
    currentSpan += span;
    if (currentSpan >= columns) {
      rows.push(currentRow);
      currentRow = [];
      currentSpan = 0;
    }
  }
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }
  return rows;
}

/** Responsive grid column classes */
const responsiveColsMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
};

const fixedColsMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

const Descriptions = forwardRef<HTMLDivElement, DescriptionsProps>(
  (
    {
      className,
      title,
      extra,
      items,
      columns = 3,
      bordered = false,
      size = "md",
      layout = "horizontal",
      colon = true,
      variant = "plain",
      responsive = true,
      headingLevel = 3,
      labelWidth,
      labelClassName: globalLabelClassName,
      contentClassName: globalContentClassName,
      ...props
    },
    ref
  ) => {
    const styles = sizeStyles[size];
    const rows = useMemo(() => buildRows(items, columns), [items, columns]);

    const labelSuffix = colon ? ":" : "";

    const isStriped = variant === "striped";

    const labelWidthStyle =
      labelWidth != null
        ? typeof labelWidth === "number"
          ? `${labelWidth}px`
          : labelWidth
        : undefined;

    const titleElement =
      title || extra ? (
        <div className="flex items-center justify-between gap-4">
          {title && (
            <div
              role="heading"
              aria-level={headingLevel}
              className={cn(
                "font-semibold text-secondary",
                styles.titleSize
              )}
            >
              {title}
            </div>
          )}
          {extra && <div className="ml-auto shrink-0">{extra}</div>}
        </div>
      ) : null;

    if (bordered) {
      return (
        <div
          ref={ref}
          className={cn(
            "border border-slate-200 rounded-xl overflow-hidden bg-surface",
            className
          )}
          {...props}
        >
          {titleElement && (
            <div
              className={cn(
                "border-b border-slate-200 bg-light/50",
                styles.padding
              )}
            >
              {titleElement}
            </div>
          )}
          <table className="w-full">
            <tbody>
              {rows.map((row, rowIdx) => {
                const stripedRowClass =
                  isStriped && rowIdx % 2 === 1 ? "bg-light/50" : "";

                if (layout === "vertical") {
                  return (
                    <React.Fragment key={rowIdx}>
                      <tr
                        className={cn(
                          "border-b border-slate-100 last:border-b-0",
                          stripedRowClass
                        )}
                      >
                        {row.map((item, colIdx) => (
                          <th
                            key={`label-${colIdx}`}
                            colSpan={item.span}
                            className={cn(
                              "text-left font-medium text-text-secondary bg-light/50 border-r border-slate-100 last:border-r-0",
                              styles.padding,
                              styles.labelSize,
                              globalLabelClassName,
                              item.labelClassName
                            )}
                          >
                            {item.label}
                            {labelSuffix}
                          </th>
                        ))}
                      </tr>
                      <tr
                        className={cn(
                          "border-b border-slate-200 last:border-b-0",
                          stripedRowClass
                        )}
                      >
                        {row.map((item, colIdx) => (
                          <td
                            key={`value-${colIdx}`}
                            colSpan={item.span}
                            className={cn(
                              "text-secondary border-r border-slate-100 last:border-r-0",
                              styles.padding,
                              styles.valueSize,
                              globalContentClassName,
                              item.contentClassName
                            )}
                          >
                            {renderValue(item.children)}
                          </td>
                        ))}
                      </tr>
                    </React.Fragment>
                  );
                }
                return (
                  <tr
                    key={rowIdx}
                    className={cn(
                      "border-b border-slate-200 last:border-b-0",
                      stripedRowClass
                    )}
                  >
                    {row.map((item, colIdx) => (
                      <React.Fragment key={colIdx}>
                        <th
                          className={cn(
                            "text-left font-medium text-text-secondary bg-light/50 border-r border-slate-100 whitespace-nowrap",
                            styles.padding,
                            styles.labelSize,
                            globalLabelClassName,
                            item.labelClassName
                          )}
                          style={labelWidthStyle ? { width: labelWidthStyle } : undefined}
                        >
                          {item.label}
                          {labelSuffix}
                        </th>
                        <td
                          colSpan={
                            item.span && item.span > 1
                              ? item.span * 2 - 1
                              : undefined
                          }
                          className={cn(
                            "text-secondary border-r border-slate-100 last:border-r-0",
                            styles.padding,
                            styles.valueSize,
                            globalContentClassName,
                            item.contentClassName
                          )}
                        >
                          {renderValue(item.children)}
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    // Borderless layout using CSS grid
    const colCount = Math.min(Math.max(columns, 1), 6);
    const gridColsClass = responsive
      ? responsiveColsMap[colCount] || `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${colCount}`
      : fixedColsMap[colCount] || `grid-cols-${colCount}`;

    return (
      <div ref={ref} className={cn("bg-surface", className)} {...props}>
        {titleElement && (
          <div className="mb-4">{titleElement}</div>
        )}
        <dl
          className={cn("grid gap-x-8 gap-y-4", gridColsClass)}
        >
          {items.map((item, idx) => {
            const span = Math.min(item.span ?? 1, columns);
            const stripedItemClass =
              isStriped && idx % 2 === 1 ? "bg-light/50 rounded-lg" : "";

            return (
              <div
                key={idx}
                className={cn(
                  layout === "horizontal"
                    ? `grid gap-2`
                    : "",
                  stripedItemClass,
                  span > 1 && `col-span-${span}`
                )}
                style={{
                  ...(span > 1 ? { gridColumn: `span ${span}` } : {}),
                  ...(layout === "horizontal"
                    ? {
                        gridTemplateColumns: labelWidthStyle
                          ? `${labelWidthStyle} 1fr`
                          : "auto 1fr",
                      }
                    : {}),
                }}
              >
                <dt
                  className={cn(
                    "font-medium text-text-secondary",
                    styles.labelSize,
                    layout === "horizontal" && "shrink-0 whitespace-nowrap",
                    globalLabelClassName,
                    item.labelClassName
                  )}
                >
                  {item.label}
                  {labelSuffix}
                </dt>
                <dd
                  className={cn(
                    "text-secondary",
                    styles.valueSize,
                    layout === "vertical" && "mt-1",
                    globalContentClassName,
                    item.contentClassName
                  )}
                >
                  {renderValue(item.children)}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    );
  }
);
Descriptions.displayName = "Descriptions";

export { Descriptions };
export type { DescriptionsProps, DescriptionsItem, DescriptionsSize, DescriptionsVariant };

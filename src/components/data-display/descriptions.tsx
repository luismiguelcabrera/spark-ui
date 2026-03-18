"use client";

import React, { forwardRef, useMemo, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type DescriptionsItem = {
  label: string;
  children: ReactNode;
  span?: number;
};

type DescriptionsProps = HTMLAttributes<HTMLDivElement> & {
  /** Optional title displayed above the descriptions */
  title?: string;
  /** Array of items to display */
  items: DescriptionsItem[];
  /** Number of columns */
  columns?: number;
  /** Show borders (table-like) */
  bordered?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Layout direction for label and value */
  layout?: "horizontal" | "vertical";
  /** Show colon after labels */
  colon?: boolean;
};

const sizeStyles = {
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
} as const;

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

const Descriptions = forwardRef<HTMLDivElement, DescriptionsProps>(
  (
    {
      className,
      title,
      items,
      columns = 3,
      bordered = false,
      size = "md",
      layout = "horizontal",
      colon = true,
      ...props
    },
    ref
  ) => {
    const styles = sizeStyles[size];
    const rows = useMemo(() => buildRows(items, columns), [items, columns]);

    const labelSuffix = colon ? ":" : "";

    if (bordered) {
      return (
        <div
          ref={ref}
          className={cn(
            "border border-slate-200 rounded-xl overflow-hidden bg-white",
            className
          )}
          {...props}
        >
          {title && (
            <div
              className={cn(
                "border-b border-slate-200 bg-slate-50/50",
                styles.padding
              )}
            >
              <h3
                className={cn(
                  "font-semibold text-slate-800",
                  styles.titleSize
                )}
              >
                {title}
              </h3>
            </div>
          )}
          <table className="w-full" role="table">
            <tbody>
              {rows.map((row, rowIdx) => {
                if (layout === "vertical") {
                  return (
                    <React.Fragment key={rowIdx}>
                      <tr className="border-b border-slate-100 last:border-b-0">
                        {row.map((item, colIdx) => (
                          <th
                            key={`label-${colIdx}`}
                            colSpan={item.span}
                            className={cn(
                              "text-left font-medium text-slate-500 bg-slate-50/50 border-r border-slate-100 last:border-r-0",
                              styles.padding,
                              styles.labelSize
                            )}
                          >
                            {item.label}
                            {labelSuffix}
                          </th>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-200 last:border-b-0">
                        {row.map((item, colIdx) => (
                          <td
                            key={`value-${colIdx}`}
                            colSpan={item.span}
                            className={cn(
                              "text-slate-700 border-r border-slate-100 last:border-r-0",
                              styles.padding,
                              styles.valueSize
                            )}
                          >
                            {item.children}
                          </td>
                        ))}
                      </tr>
                    </React.Fragment>
                  );
                }
                return (
                  <tr
                    key={rowIdx}
                    className="border-b border-slate-200 last:border-b-0"
                  >
                    {row.map((item, colIdx) => (
                      <React.Fragment key={colIdx}>
                        <th
                          className={cn(
                            "text-left font-medium text-slate-500 bg-slate-50/50 border-r border-slate-100 whitespace-nowrap",
                            styles.padding,
                            styles.labelSize
                          )}
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
                            "text-slate-700 border-r border-slate-100 last:border-r-0",
                            styles.padding,
                            styles.valueSize
                          )}
                        >
                          {item.children}
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
    return (
      <div ref={ref} className={cn("bg-white", className)} {...props}>
        {title && (
          <h3
            className={cn(
              "font-semibold text-slate-800 mb-4",
              styles.titleSize
            )}
          >
            {title}
          </h3>
        )}
        <dl
          className="grid gap-x-8 gap-y-4"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          }}
        >
          {items.map((item, idx) => {
            const span = Math.min(item.span ?? 1, columns);
            return (
              <div
                key={idx}
                style={{ gridColumn: `span ${span}` }}
                className={layout === "horizontal" ? "flex gap-2" : ""}
              >
                <dt
                  className={cn(
                    "font-medium text-slate-500",
                    styles.labelSize,
                    layout === "horizontal" && "shrink-0"
                  )}
                >
                  {item.label}
                  {labelSuffix}
                </dt>
                <dd
                  className={cn(
                    "text-slate-700",
                    styles.valueSize,
                    layout === "vertical" && "mt-1"
                  )}
                >
                  {item.children}
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
export type { DescriptionsProps, DescriptionsItem };

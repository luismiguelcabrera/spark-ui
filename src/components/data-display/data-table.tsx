"use client";

import { type ReactNode, useMemo, useState, useCallback } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Checkbox } from "../forms/checkbox";
import { Pagination } from "../navigation/pagination";
import { Icon } from "./icon";
import { useControllable } from "../../hooks/use-controllable";

/* -------------------------------------------------------------------------- */
/*  Sort types                                                                 */
/* -------------------------------------------------------------------------- */

type SortDirection = "asc" | "desc";

type SortState = {
  key: string;
  direction: SortDirection;
};

/* -------------------------------------------------------------------------- */
/*  Column type                                                                */
/* -------------------------------------------------------------------------- */

type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  width?: string;
  /** Enable sorting on this column */
  sortable?: boolean;
  /**
   * Custom sort comparator. Receives two rows and should return
   * a negative number, zero, or positive number (like Array.sort).
   * Direction is applied automatically — always sort ascending.
   */
  sortFn?: (a: T, b: T) => number;
};

/* -------------------------------------------------------------------------- */
/*  DataTable props                                                            */
/* -------------------------------------------------------------------------- */

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  selectable?: boolean;
  selectedRows?: number[];
  defaultSelectedRows?: number[];
  onSelectionChange?: (rows: number[]) => void;
  onPageChange?: (page: number) => void;
  pagination?: {
    current: number;
    total: number;
    pageSize: number;
  };
  /** Controlled sort state */
  sort?: SortState | null;
  /** Default sort state (uncontrolled) */
  defaultSort?: SortState | null;
  /** Called when sort changes. Pass `null` to clear sorting. */
  onSortChange?: (sort: SortState | null) => void;
  /** Slot rendered above the table (e.g. filter bar) */
  header?: ReactNode;
  /** Shows skeleton instead of rows while true */
  isLoading?: boolean;
  /** Custom loading skeleton; falls back to a default pulse skeleton */
  skeleton?: ReactNode;
  /** Content shown when data is empty */
  emptyState?: ReactNode;
  /**
   * When provided, renders a card list on mobile (< md) instead of the grid
   * table. The grid table is still shown on md+.
   */
  mobileCard?: (row: T) => ReactNode;
  className?: string;
};

function DefaultSkeleton() {
  return (
    <div className="p-6 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 py-4 border-b border-slate-50 last:border-0">
          <div className="h-10 w-10 bg-gray-200 rounded-full" />
          <div className="flex-1">
            <div className="h-4 w-32 bg-gray-200 rounded mb-1" />
            <div className="h-3 w-48 bg-gray-100 rounded" />
          </div>
          <div className="h-5 w-16 bg-gray-100 rounded" />
          <div className="h-4 w-12 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  SortableHeader helper                                                      */
/* -------------------------------------------------------------------------- */

function SortIndicator({ direction }: { direction?: SortDirection }) {
  if (!direction) {
    return (
      <Icon
        name="chevrons-up-down"
        size="xs"
        className="text-slate-300 ml-1 shrink-0"
      />
    );
  }
  return (
    <Icon
      name={direction === "asc" ? "chevron-up" : "chevron-down"}
      size="xs"
      className="text-primary ml-1 shrink-0"
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  DataTable                                                                  */
/* -------------------------------------------------------------------------- */

function DataTable<T>({
  columns,
  data,
  selectable = false,
  selectedRows,
  defaultSelectedRows,
  onSelectionChange,
  onPageChange,
  pagination,
  sort: sortProp,
  defaultSort,
  onSortChange,
  header,
  isLoading,
  skeleton,
  emptyState,
  mobileCard,
  className,
}: DataTableProps<T>) {
  const [selected, setSelected] = useControllable<number[]>({
    value: selectedRows,
    defaultValue: defaultSelectedRows ?? [],
    onChange: onSelectionChange,
  });

  // Sort state — controlled or uncontrolled
  const sortControlled = sortProp !== undefined;
  const [internalSort, setInternalSort] = useState<SortState | null>(
    defaultSort ?? null,
  );
  const currentSort = sortControlled ? (sortProp ?? null) : internalSort;

  const handleSortToggle = useCallback(
    (key: string) => {
      let next: SortState | null;
      if (currentSort?.key === key) {
        if (currentSort.direction === "asc") {
          next = { key, direction: "desc" };
        } else {
          // desc → clear
          next = null;
        }
      } else {
        next = { key, direction: "asc" };
      }
      if (!sortControlled) setInternalSort(next);
      onSortChange?.(next);
    },
    [currentSort, sortControlled, onSortChange],
  );

  // Sort data
  const sortedData = useMemo(() => {
    if (!currentSort) return data;
    const col = columns.find((c) => c.key === currentSort.key);
    if (!col?.sortable) return data;

    const sorted = [...data].sort((a, b) => {
      if (col.sortFn) return col.sortFn(a, b);
      // Default: compare rendered output as strings
      const aVal = String((a as Record<string, unknown>)[col.key] ?? "");
      const bVal = String((b as Record<string, unknown>)[col.key] ?? "");
      return aVal.localeCompare(bVal);
    });

    if (currentSort.direction === "desc") sorted.reverse();
    return sorted;
  }, [data, columns, currentSort]);

  const gridTemplate = columns.map((col) => col.width ?? "1fr").join(" ");
  const fullTemplate = selectable ? `40px ${gridTemplate}` : gridTemplate;
  const allSelected = sortedData.length > 0 && selected.length === sortedData.length;

  const toggleAll = () => {
    if (allSelected) setSelected([]);
    else setSelected(sortedData.map((_, i) => i));
  };

  const toggleRow = (index: number) => {
    if (selected.includes(index)) setSelected(selected.filter((i) => i !== index));
    else setSelected([...selected, index]);
  };

  const emptyContent = emptyState ? (
    <div className="py-12 text-center">{emptyState}</div>
  ) : null;

  return (
    <div className={cn(s.dataTableWrapper, "@container", className)}>
      {/* Header slot */}
      {header && (
        <div className="p-3 border-b border-slate-100">{header}</div>
      )}

      {/* Loading state */}
      {isLoading && (skeleton ?? <DefaultSkeleton />)}

      {/* Content */}
      {!isLoading && (
        <>
          {/* Desktop: grid table — hidden on mobile when mobileCard is provided */}
          <div className={cn(mobileCard && "hidden @[600px]:block")}>
            <div
              className={s.dataTableHeader}
              style={{ gridTemplateColumns: fullTemplate }}
            >
              {selectable && (
                <div className="flex items-center justify-center">
                  <Checkbox checked={allSelected} onChange={toggleAll} />
                </div>
              )}
              {columns.map((col) => {
                const sortDir =
                  currentSort?.key === col.key
                    ? currentSort.direction
                    : undefined;
                const sortLabel = sortDir === "asc"
                  ? "ascending"
                  : sortDir === "desc"
                    ? "descending"
                    : "none";
                return (
                  <div
                    key={col.key}
                    data-sort={col.sortable ? sortLabel : undefined}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSortToggle(col.key)}
                        className="inline-flex items-center gap-0.5 cursor-pointer hover:text-slate-700 transition-colors select-none"
                        aria-label={`Sort by ${col.header}, currently ${sortLabel}`}
                      >
                        {col.header}
                        <SortIndicator direction={sortDir} />
                      </button>
                    ) : (
                      col.header
                    )}
                  </div>
                );
              })}
            </div>

            {sortedData.length === 0 ? (
              emptyContent
            ) : (
              sortedData.map((row, i) => (
                <div
                  key={i}
                  className={s.dataTableRow}
                  style={{ gridTemplateColumns: fullTemplate }}
                >
                  {selectable && (
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={selected.includes(i)}
                        onChange={() => toggleRow(i)}
                      />
                    </div>
                  )}
                  {columns.map((col) => (
                    <div key={col.key} className="text-sm text-slate-700">
                      {col.render(row)}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Mobile: card list — hidden on desktop */}
          {mobileCard && (
            <div className="@[600px]:hidden divide-y divide-slate-100">
              {sortedData.length === 0 ? (
                emptyContent
              ) : (
                sortedData.map((row, i) => (
                  <div key={i} className="px-4 py-3">
                    {mobileCard(row)}
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* Pagination — only shown when there is more than one page */}
      {pagination && pagination.total > pagination.pageSize && (
        <div className="px-4 py-3 border-t border-slate-100">
          <Pagination
            current={pagination.current}
            total={pagination.total}
            pageSize={pagination.pageSize}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}

export { DataTable };
export type { DataTableProps, Column, SortState, SortDirection };

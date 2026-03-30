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

type ColumnFilterType = "text" | "select";

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
  /**
   * Enable filtering on this column.
   * - `"text"` — free-text search input
   * - `"select"` — dropdown of unique values
   */
  filterable?: ColumnFilterType;
  /**
   * Custom filter predicate. Receives a row and the current filter value.
   * Return true to include the row. When omitted, defaults to
   * case-insensitive string includes on `row[key]`.
   */
  filterFn?: (row: T, filterValue: string) => boolean;
};

/* -------------------------------------------------------------------------- */
/*  Filter types                                                               */
/* -------------------------------------------------------------------------- */

type FilterState = Record<string, string>;

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
  /** Controlled filter state — keys are column keys, values are filter strings */
  filters?: FilterState;
  /** Default filter state (uncontrolled) */
  defaultFilters?: FilterState;
  /** Called when any filter changes */
  onFilterChange?: (filters: FilterState) => void;
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
  filters: filtersProp,
  defaultFilters,
  onFilterChange,
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

  // Filter state — controlled or uncontrolled
  const filtersControlled = filtersProp !== undefined;
  const [internalFilters, setInternalFilters] = useState<FilterState>(
    defaultFilters ?? {},
  );
  const currentFilters = filtersControlled ? (filtersProp ?? {}) : internalFilters;
  const hasFilters = columns.some((c) => c.filterable);

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      const next = { ...currentFilters, [key]: value };
      // Remove empty filters
      if (!value) delete next[key];
      if (!filtersControlled) setInternalFilters(next);
      onFilterChange?.(next);
    },
    [currentFilters, filtersControlled, onFilterChange],
  );

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

  // Filter data
  const filteredData = useMemo(() => {
    const activeFilters = Object.entries(currentFilters).filter(
      ([, v]) => v !== "",
    );
    if (activeFilters.length === 0) return data;

    return data.filter((row) =>
      activeFilters.every(([key, filterValue]) => {
        const col = columns.find((c) => c.key === key);
        if (!col?.filterable) return true;
        if (col.filterFn) return col.filterFn(row, filterValue);
        // Default: case-insensitive string includes
        const cellValue = String(
          (row as Record<string, unknown>)[key] ?? "",
        ).toLowerCase();
        return cellValue.includes(filterValue.toLowerCase());
      }),
    );
  }, [data, columns, currentFilters]);

  // Compute unique values for select filters (from unfiltered data)
  const selectOptions = useMemo(() => {
    const opts: Record<string, string[]> = {};
    for (const col of columns) {
      if (col.filterable === "select") {
        const values = new Set<string>();
        for (const row of data) {
          const v = String((row as Record<string, unknown>)[col.key] ?? "");
          if (v) values.add(v);
        }
        opts[col.key] = Array.from(values).sort();
      }
    }
    return opts;
  }, [columns, data]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!currentSort) return filteredData;
    const col = columns.find((c) => c.key === currentSort.key);
    if (!col?.sortable) return data;

    const sorted = [...filteredData].sort((a, b) => {
      if (col.sortFn) return col.sortFn(a, b);
      // Default: compare rendered output as strings
      const aVal = String((a as Record<string, unknown>)[col.key] ?? "");
      const bVal = String((b as Record<string, unknown>)[col.key] ?? "");
      return aVal.localeCompare(bVal);
    });

    if (currentSort.direction === "desc") sorted.reverse();
    return sorted;
  }, [filteredData, columns, currentSort]);

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

            {/* Filter row */}
            {hasFilters && (
              <div
                className="grid items-center gap-x-4 px-4 py-2 border-b border-slate-100 bg-slate-25"
                style={{ gridTemplateColumns: fullTemplate }}
              >
                {selectable && <div />}
                {columns.map((col) => (
                  <div key={col.key}>
                    {col.filterable === "text" && (
                      <input
                        type="text"
                        placeholder={`Filter ${col.header}...`}
                        value={currentFilters[col.key] ?? ""}
                        onChange={(e) =>
                          handleFilterChange(col.key, e.target.value)
                        }
                        aria-label={`Filter by ${col.header}`}
                        className="w-full h-7 px-2 text-xs border border-slate-200 rounded-md bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                    )}
                    {col.filterable === "select" && (
                      <select
                        value={currentFilters[col.key] ?? ""}
                        onChange={(e) =>
                          handleFilterChange(col.key, e.target.value)
                        }
                        aria-label={`Filter by ${col.header}`}
                        className="w-full h-7 px-2 text-xs border border-slate-200 rounded-md bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      >
                        <option value="">All</option>
                        {(selectOptions[col.key] ?? []).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            )}

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
export type { DataTableProps, Column, SortState, SortDirection, FilterState, ColumnFilterType };

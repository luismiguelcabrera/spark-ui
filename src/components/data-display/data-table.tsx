"use client";

import {
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
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
   * Direction is applied automatically -- always sort ascending.
   */
  sortFn?: (a: T, b: T) => number;
  /**
   * Enable filtering on this column.
   * - `"text"` -- free-text search input
   * - `"select"` -- dropdown of unique values
   */
  filterable?: ColumnFilterType;
  /**
   * Custom filter predicate. Receives a row and the current filter value.
   * Return true to include the row. When omitted, defaults to
   * case-insensitive string includes on `row[key]`.
   */
  filterFn?: (row: T, filterValue: string) => boolean;
  /** Enable inline cell editing on this column */
  editable?: boolean;
  /**
   * Custom edit renderer. When omitted, a plain text input is used.
   * @param value - current cell value
   * @param row - the full row
   * @param onChange - call with the new value to commit
   */
  editRender?: (
    value: unknown,
    row: T,
    onChange: (val: unknown) => void,
  ) => ReactNode;
};

/* -------------------------------------------------------------------------- */
/*  Filter types                                                               */
/* -------------------------------------------------------------------------- */

type FilterState = Record<string, string>;

/* -------------------------------------------------------------------------- */
/*  Expandable config                                                          */
/* -------------------------------------------------------------------------- */

type ExpandableConfig<T> = {
  /** Renders the expanded detail content below the row */
  render: (row: T) => ReactNode;
};

/* -------------------------------------------------------------------------- */
/*  Edit state                                                                 */
/* -------------------------------------------------------------------------- */

type EditingCell = {
  rowIndex: number;
  columnKey: string;
  value: unknown;
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
  /** Controlled filter state -- keys are column keys, values are filter strings */
  filters?: FilterState;
  /** Default filter state (uncontrolled) */
  defaultFilters?: FilterState;
  /** Called when any filter changes */
  onFilterChange?: (filters: FilterState) => void;
  /** Row expansion configuration */
  expandable?: ExpandableConfig<T>;
  /** Controlled expanded rows (row indices) */
  expandedRows?: number[];
  /** Default expanded rows (uncontrolled) */
  defaultExpandedRows?: number[];
  /** Called when expanded rows change */
  onExpandChange?: (rows: number[]) => void;
  /** Enable column resizing by dragging header dividers */
  resizable?: boolean;
  /** Called when a cell is edited */
  onCellEdit?: (rowIndex: number, columnKey: string, newValue: unknown) => void;
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

/* -------------------------------------------------------------------------- */
/*  DefaultSkeleton                                                            */
/* -------------------------------------------------------------------------- */

function DefaultSkeleton() {
  return (
    <div className="p-6 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 py-4 border-b border-slate-50 last:border-0"
        >
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
/*  SortIndicator helper                                                       */
/* -------------------------------------------------------------------------- */

function SortIndicator({ direction }: { direction?: SortDirection }) {
  if (!direction) {
    return (
      <Icon
        name="unfold_more"
        size="sm"
        className="text-slate-300 ml-1 shrink-0"
      />
    );
  }
  return (
    <Icon
      name={direction === "asc" ? "expand_less" : "expand_more"}
      size="sm"
      className="text-primary ml-1 shrink-0"
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Inline edit cell                                                           */
/* -------------------------------------------------------------------------- */

function InlineEditInput({
  value,
  onSave,
  onCancel,
}: {
  value: unknown;
  onSave: (val: unknown) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(String(value ?? ""));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSave(draft);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={() => onCancel()}
      className={cn(
        "w-full h-7 px-2 text-sm border border-primary rounded-md bg-white",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
      )}
      aria-label="Edit cell value"
    />
  );
}
InlineEditInput.displayName = "InlineEditInput";

/* -------------------------------------------------------------------------- */
/*  Column resize handle                                                       */
/* -------------------------------------------------------------------------- */

const MIN_COLUMN_WIDTH = 60;

function ResizeHandle({
  onResize,
}: {
  onResize: (deltaX: number) => void;
}) {
  const handleMouseDown = (e: ReactMouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      onResize(delta);
    };

    const handleMouseUp = () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
  };

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      className={cn(
        "absolute right-0 top-0 bottom-0 w-[4px] cursor-col-resize z-10",
        "bg-transparent hover:bg-primary/40 transition-colors",
      )}
      onMouseDown={handleMouseDown}
    />
  );
}
ResizeHandle.displayName = "ResizeHandle";

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
  expandable,
  expandedRows: expandedRowsProp,
  defaultExpandedRows,
  onExpandChange,
  resizable = false,
  onCellEdit,
  header: headerSlot,
  isLoading,
  skeleton,
  emptyState,
  mobileCard,
  className,
}: DataTableProps<T>) {
  /* -- Selection state -- */
  const [selected, setSelected] = useControllable<number[]>({
    value: selectedRows,
    defaultValue: defaultSelectedRows ?? [],
    onChange: onSelectionChange,
  });

  /* -- Sort state (controlled or uncontrolled) -- */
  const sortControlled = sortProp !== undefined;
  const [internalSort, setInternalSort] = useState<SortState | null>(
    defaultSort ?? null,
  );
  const currentSort = sortControlled ? (sortProp ?? null) : internalSort;

  /* -- Filter state (controlled or uncontrolled) -- */
  const filtersControlled = filtersProp !== undefined;
  const [internalFilters, setInternalFilters] = useState<FilterState>(
    defaultFilters ?? {},
  );
  const currentFilters = filtersControlled
    ? (filtersProp ?? {})
    : internalFilters;
  const hasFilters = columns.some((c) => c.filterable);

  /* -- Expanded rows state -- */
  const [expanded, setExpanded] = useControllable<number[]>({
    value: expandedRowsProp,
    defaultValue: defaultExpandedRows ?? [],
    onChange: onExpandChange,
  });

  /* -- Column widths state (for resizing) -- */
  const headerRef = useRef<HTMLDivElement>(null);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const resizeStartWidths = useRef<Record<string, number>>({});

  /* -- Editing state -- */
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);

  /* ---------- Filter logic ---------- */

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      const next = { ...currentFilters, [key]: value };
      if (!value) delete next[key];
      if (!filtersControlled) setInternalFilters(next);
      onFilterChange?.(next);
    },
    [currentFilters, filtersControlled, onFilterChange],
  );

  /* ---------- Sort logic ---------- */

  const handleSortToggle = useCallback(
    (key: string) => {
      let next: SortState | null;
      if (currentSort?.key === key) {
        if (currentSort.direction === "asc") {
          next = { key, direction: "desc" };
        } else {
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

  /* ---------- Filter data ---------- */

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
        const cellValue = String(
          (row as Record<string, unknown>)[key] ?? "",
        ).toLowerCase();
        return cellValue.includes(filterValue.toLowerCase());
      }),
    );
  }, [data, columns, currentFilters]);

  /* ---------- Select options for filters ---------- */

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

  /* ---------- Sort data ---------- */

  const sortedData = useMemo(() => {
    if (!currentSort) return filteredData;
    const col = columns.find((c) => c.key === currentSort.key);
    if (!col?.sortable) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      if (col.sortFn) return col.sortFn(a, b);
      const aVal = String((a as Record<string, unknown>)[col.key] ?? "");
      const bVal = String((b as Record<string, unknown>)[col.key] ?? "");
      return aVal.localeCompare(bVal);
    });

    if (currentSort.direction === "desc") sorted.reverse();
    return sorted;
  }, [filteredData, columns, currentSort]);

  /* ---------- Expand logic ---------- */

  const toggleExpand = useCallback(
    (index: number) => {
      if (expanded.includes(index)) {
        setExpanded(expanded.filter((i) => i !== index));
      } else {
        setExpanded([...expanded, index]);
      }
    },
    [expanded, setExpanded],
  );

  /* ---------- Edit logic ---------- */

  const handleCellDoubleClick = useCallback(
    (rowIndex: number, col: Column<T>, row: T) => {
      if (!col.editable) return;
      const value = (row as Record<string, unknown>)[col.key];
      setEditingCell({ rowIndex, columnKey: col.key, value });
    },
    [],
  );

  const handleEditSave = useCallback(
    (rowIndex: number, columnKey: string, newValue: unknown) => {
      setEditingCell(null);
      onCellEdit?.(rowIndex, columnKey, newValue);
    },
    [onCellEdit],
  );

  const handleEditCancel = useCallback(() => {
    setEditingCell(null);
  }, []);

  /* ---------- Resize logic ---------- */

  const handleResizeStart = useCallback(
    (colKey: string) => {
      // Snapshot current widths at drag start
      const widths: Record<string, number> = {};
      if (headerRef.current) {
        const headerCells =
          headerRef.current.querySelectorAll<HTMLElement>("[data-col-key]");
        headerCells.forEach((cell) => {
          const key = cell.getAttribute("data-col-key");
          if (key) {
            widths[key] = cell.getBoundingClientRect().width;
          }
        });
      }
      // Fill in any columns not yet measured
      for (const col of columns) {
        if (!widths[col.key]) {
          widths[col.key] = columnWidths[col.key] ?? 150;
        }
      }
      resizeStartWidths.current = widths;
      return widths[colKey] ?? 150;
    },
    [columns, columnWidths],
  );

  const makeResizeHandler = useCallback(
    (colKey: string) => {
      let startWidth = 0;
      return (deltaX: number) => {
        if (startWidth === 0) {
          startWidth = handleResizeStart(colKey);
        }
        const newWidth = Math.max(MIN_COLUMN_WIDTH, startWidth + deltaX);
        setColumnWidths((prev) => ({
          ...resizeStartWidths.current,
          ...prev,
          [colKey]: newWidth,
        }));
      };
    },
    [handleResizeStart],
  );

  /* ---------- Grid template ---------- */

  const hasExpandColumn = !!expandable;

  const gridTemplate = useMemo(() => {
    if (resizable && Object.keys(columnWidths).length > 0) {
      return columns
        .map((col) =>
          columnWidths[col.key]
            ? `${columnWidths[col.key]}px`
            : (col.width ?? "1fr"),
        )
        .join(" ");
    }
    return columns.map((col) => col.width ?? "1fr").join(" ");
  }, [columns, resizable, columnWidths]);

  const fullTemplate = [
    hasExpandColumn ? "40px" : "",
    selectable ? "40px" : "",
    gridTemplate,
  ]
    .filter(Boolean)
    .join(" ");

  /* ---------- Selection helpers ---------- */

  const allSelected =
    sortedData.length > 0 && selected.length === sortedData.length;

  const toggleAll = () => {
    if (allSelected) setSelected([]);
    else setSelected(sortedData.map((_, i) => i));
  };

  const toggleRow = (index: number) => {
    if (selected.includes(index))
      setSelected(selected.filter((i) => i !== index));
    else setSelected([...selected, index]);
  };

  /* ---------- Empty content ---------- */

  const emptyContent = emptyState ? (
    <div className="py-12 text-center">{emptyState}</div>
  ) : null;

  /* ---------- Render ---------- */

  return (
    <div className={cn(s.dataTableWrapper, "@container", className)}>
      {/* Header slot */}
      {headerSlot && (
        <div className="p-3 border-b border-slate-100">{headerSlot}</div>
      )}

      {/* Loading state */}
      {isLoading && (skeleton ?? <DefaultSkeleton />)}

      {/* Content */}
      {!isLoading && (
        <>
          {/* Desktop: grid table -- hidden on mobile when mobileCard is provided */}
          <div className={cn(mobileCard && "hidden @[600px]:block")}>
            {/* Header row */}
            <div
              ref={headerRef}
              className={s.dataTableHeader}
              style={{ gridTemplateColumns: fullTemplate }}
            >
              {/* Expand column header */}
              {hasExpandColumn && <div />}

              {/* Checkbox column header */}
              {selectable && (
                <div className="flex items-center justify-center">
                  <Checkbox checked={allSelected} onChange={toggleAll} />
                </div>
              )}

              {/* Column headers */}
              {columns.map((col, colIdx) => {
                const sortDir =
                  currentSort?.key === col.key
                    ? currentSort.direction
                    : undefined;
                const sortLabel =
                  sortDir === "asc"
                    ? "ascending"
                    : sortDir === "desc"
                      ? "descending"
                      : "none";
                return (
                  <div
                    key={col.key}
                    data-col-key={col.key}
                    data-sort={col.sortable ? sortLabel : undefined}
                    className="relative"
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSortToggle(col.key)}
                        className={cn(
                          "inline-flex items-center gap-0.5 cursor-pointer",
                          "hover:text-slate-700 transition-colors select-none",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded",
                        )}
                        aria-label={`Sort by ${col.header}, currently ${sortLabel}`}
                      >
                        {col.header}
                        <SortIndicator direction={sortDir} />
                      </button>
                    ) : (
                      col.header
                    )}

                    {/* Resize handle */}
                    {resizable && colIdx < columns.length - 1 && (
                      <ResizeHandle onResize={makeResizeHandler(col.key)} />
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
                {hasExpandColumn && <div />}
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

            {/* Data rows */}
            {sortedData.length === 0
              ? emptyContent
              : sortedData.map((row, i) => {
                  const isExpanded = expanded.includes(i);
                  return (
                    <div key={i}>
                      {/* Main row */}
                      <div
                        className={s.dataTableRow}
                        style={{ gridTemplateColumns: fullTemplate }}
                      >
                        {/* Expand toggle */}
                        {hasExpandColumn && (
                          <div className="flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => toggleExpand(i)}
                              aria-expanded={isExpanded}
                              aria-label={
                                isExpanded ? "Collapse row" : "Expand row"
                              }
                              className={cn(
                                "p-0.5 rounded transition-colors",
                                "hover:bg-slate-100",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                              )}
                            >
                              <Icon
                                name={
                                  isExpanded
                                    ? "expand_more"
                                    : "chevron_right"
                                }
                                size="sm"
                                className="text-slate-500"
                              />
                            </button>
                          </div>
                        )}

                        {/* Selection checkbox */}
                        {selectable && (
                          <div className="flex items-center justify-center">
                            <Checkbox
                              checked={selected.includes(i)}
                              onChange={() => toggleRow(i)}
                            />
                          </div>
                        )}

                        {/* Data cells */}
                        {columns.map((col) => {
                          const isEditing =
                            editingCell?.rowIndex === i &&
                            editingCell?.columnKey === col.key;

                          if (isEditing) {
                            if (col.editRender) {
                              return (
                                <div
                                  key={col.key}
                                  className="text-sm text-slate-700"
                                >
                                  {col.editRender(
                                    editingCell.value,
                                    row,
                                    (newVal) =>
                                      handleEditSave(i, col.key, newVal),
                                  )}
                                </div>
                              );
                            }
                            return (
                              <div
                                key={col.key}
                                className="text-sm text-slate-700"
                              >
                                <InlineEditInput
                                  value={editingCell.value}
                                  onSave={(val) =>
                                    handleEditSave(i, col.key, val)
                                  }
                                  onCancel={handleEditCancel}
                                />
                              </div>
                            );
                          }

                          return (
                            <div
                              key={col.key}
                              className={cn(
                                "text-sm text-slate-700",
                                col.editable && "cursor-text",
                              )}
                              onDoubleClick={() =>
                                handleCellDoubleClick(i, col, row)
                              }
                              data-editable={col.editable || undefined}
                            >
                              {col.render(row)}
                            </div>
                          );
                        })}
                      </div>

                      {/* Expanded detail row */}
                      {hasExpandColumn && isExpanded && (
                        <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50">
                          {expandable!.render(row)}
                        </div>
                      )}
                    </div>
                  );
                })}
          </div>

          {/* Mobile: card list -- hidden on desktop */}
          {mobileCard && (
            <div className="@[600px]:hidden divide-y divide-slate-100">
              {sortedData.length === 0
                ? emptyContent
                : sortedData.map((row, i) => (
                    <div key={i} className="px-4 py-3">
                      {mobileCard(row)}
                    </div>
                  ))}
            </div>
          )}
        </>
      )}

      {/* Pagination -- only shown when there is more than one page */}
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
export type {
  DataTableProps,
  Column,
  SortState,
  SortDirection,
  FilterState,
  ColumnFilterType,
  ExpandableConfig,
  EditingCell,
};

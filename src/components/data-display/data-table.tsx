"use client";

import { type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Checkbox } from "../forms/checkbox";
import { Pagination } from "../navigation/pagination";
import { useControllable } from "../../hooks/use-controllable";

type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  width?: string;
};

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
    <div className="p-6 animate-pulse motion-reduce:animate-none" aria-busy="true" aria-label="Loading table data">
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

function DataTable<T>({
  columns,
  data,
  selectable = false,
  selectedRows,
  defaultSelectedRows,
  onSelectionChange,
  onPageChange,
  pagination,
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

  const gridTemplate = columns.map((col) => col.width ?? "1fr").join(" ");
  const fullTemplate = selectable ? `40px ${gridTemplate}` : gridTemplate;
  const allSelected = data.length > 0 && selected.length === data.length;

  const toggleAll = () => {
    if (allSelected) setSelected([]);
    else setSelected(data.map((_, i) => i));
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
          <div className={cn(mobileCard && "hidden @[600px]:block")} role="table">
            <div
              role="row"
              className={s.dataTableHeader}
              style={{ gridTemplateColumns: fullTemplate }}
            >
              {selectable && (
                <div role="columnheader" className="flex items-center justify-center">
                  <Checkbox checked={allSelected} onChange={toggleAll} aria-label="Select all rows" />
                </div>
              )}
              {columns.map((col) => (
                <div role="columnheader" key={col.key}>{col.header}</div>
              ))}
            </div>

            {data.length === 0 ? (
              emptyContent
            ) : (
              data.map((row, i) => (
                <div
                  key={i}
                  role="row"
                  className={s.dataTableRow}
                  style={{ gridTemplateColumns: fullTemplate }}
                >
                  {selectable && (
                    <div role="cell" className="flex items-center justify-center">
                      <Checkbox
                        checked={selected.includes(i)}
                        onChange={() => toggleRow(i)}
                        aria-label={`Select row ${i + 1}`}
                      />
                    </div>
                  )}
                  {columns.map((col) => (
                    <div role="cell" key={col.key} className="text-sm text-slate-700">
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
              {data.length === 0 ? (
                emptyContent
              ) : (
                data.map((row, i) => (
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
export type { DataTableProps, Column };

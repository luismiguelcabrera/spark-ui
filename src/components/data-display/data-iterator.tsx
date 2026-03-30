"use client";

import { useState, useMemo, useCallback, type ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type SortDirection = "asc" | "desc";

type DataIteratorSlotProps<T> = {
  /** Processed (filtered + sorted + paginated) items */
  items: T[];
  /** All items after filter + sort (before pagination) */
  allItems: T[];
  /** Current page (1-based) */
  page: number;
  /** Total number of pages */
  pageCount: number;
  /** Current sort key */
  sortBy: string | null;
  /** Current sort direction */
  sortDirection: SortDirection;
  /** Set the sort key (toggles direction if same key) */
  setSortBy: (key: string) => void;
  /** Go to next page */
  nextPage: () => void;
  /** Go to previous page */
  prevPage: () => void;
  /** Go to a specific page */
  goToPage: (page: number) => void;
  /** Whether on the first page */
  isFirst: boolean;
  /** Whether on the last page */
  isLast: boolean;
  /** Total item count (after filtering) */
  totalItems: number;
};

type DataIteratorProps<T> = {
  /** Source data array */
  items: T[];
  /** Initial or controlled sort key */
  sortBy?: string;
  /** Initial or controlled sort direction */
  sortDirection?: SortDirection;
  /** Custom comparator for sorting — receives two items and the sort key */
  sortFn?: (a: T, b: T, key: string, direction: SortDirection) => number;
  /** Filter function — return true to include item */
  filterFn?: (item: T) => boolean;
  /** Number of items per page (0 = no pagination) */
  pageSize?: number;
  /** Initial page (1-based) */
  page?: number;
  /** Render function receiving slot props */
  children: (props: DataIteratorSlotProps<T>) => ReactNode;
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

function DataIterator<T>({
  items,
  sortBy: sortByProp,
  sortDirection: sortDirectionProp = "asc",
  sortFn,
  filterFn,
  pageSize = 0,
  page: pageProp,
  children,
}: DataIteratorProps<T>) {
  const [internalSortBy, setInternalSortBy] = useState<string | null>(
    sortByProp ?? null,
  );
  const [internalSortDir, setInternalSortDir] =
    useState<SortDirection>(sortDirectionProp);
  const [internalPage, setInternalPage] = useState(pageProp ?? 1);

  const sortBy = sortByProp !== undefined ? sortByProp : internalSortBy;
  const sortDirection =
    sortByProp !== undefined ? sortDirectionProp : internalSortDir;
  const page = pageProp !== undefined ? pageProp : internalPage;

  // Filter
  const filtered = useMemo(
    () => (filterFn ? items.filter(filterFn) : items),
    [items, filterFn],
  );

  // Sort
  const sorted = useMemo(() => {
    if (!sortBy) return filtered;

    const arr = [...filtered];
    arr.sort((a, b) => {
      if (sortFn) return sortFn(a, b, sortBy, sortDirection);

      const aVal = (a as Record<string, unknown>)[sortBy];
      const bVal = (b as Record<string, unknown>)[sortBy];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      let cmp = 0;
      if (typeof aVal === "string" && typeof bVal === "string") {
        cmp = aVal.localeCompare(bVal);
      } else {
        cmp = Number(aVal) - Number(bVal);
      }
      return sortDirection === "desc" ? -cmp : cmp;
    });
    return arr;
  }, [filtered, sortBy, sortDirection, sortFn]);

  // Pagination
  const pageCount = pageSize > 0 ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;

  const paginated = useMemo(() => {
    if (pageSize <= 0) return sorted;
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  const setSortBy = useCallback(
    (key: string) => {
      if (sortBy === key) {
        setInternalSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setInternalSortBy(key);
        setInternalSortDir("asc");
      }
    },
    [sortBy],
  );

  const nextPage = useCallback(() => {
    setInternalPage((p) => Math.min(p + 1, pageCount));
  }, [pageCount]);

  const prevPage = useCallback(() => {
    setInternalPage((p) => Math.max(p - 1, 1));
  }, []);

  const goToPage = useCallback(
    (p: number) => {
      setInternalPage(Math.max(1, Math.min(p, pageCount)));
    },
    [pageCount],
  );

  return (
    <>
      {children({
        items: paginated,
        allItems: sorted,
        page,
        pageCount,
        sortBy,
        sortDirection,
        setSortBy,
        nextPage,
        prevPage,
        goToPage,
        isFirst: page <= 1,
        isLast: page >= pageCount,
        totalItems: sorted.length,
      })}
    </>
  );
}

DataIterator.displayName = "DataIterator";

export { DataIterator };
export type { DataIteratorProps, DataIteratorSlotProps, SortDirection };

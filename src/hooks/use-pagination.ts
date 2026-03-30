"use client";

import { useCallback, useMemo } from "react";
import { useControllable } from "./use-controllable";

export type UsePaginationOptions = {
  total: number;
  pageSize: number;
  page?: number;
  defaultPage?: number;
  onChange?: (page: number) => void;
  siblings?: number;
  boundaries?: number;
};

export type PaginationRange = (number | "dots")[];

export type UsePaginationReturn = {
  page: number;
  totalPages: number;
  next: () => void;
  prev: () => void;
  first: () => void;
  last: () => void;
  setPage: (page: number) => void;
  range: PaginationRange;
};

function generateRange(
  current: number,
  totalPages: number,
  siblings: number,
  boundaries: number,
): PaginationRange {
  if (totalPages <= 0) return [];

  // Total slots we want to display at most
  // boundaries on left + dots + siblings + current + siblings + dots + boundaries on right
  const totalSlots = boundaries * 2 + siblings * 2 + 3; // 3 = current + 2 potential dots

  // If total pages fits within the slots, return all pages
  if (totalPages <= totalSlots) {
    return range(1, totalPages);
  }

  const leftBoundaryEnd = boundaries;
  const rightBoundaryStart = totalPages - boundaries + 1;

  const leftSiblingStart = Math.max(current - siblings, boundaries + 1);
  const leftSiblingEnd = current - 1;
  const rightSiblingStart = current + 1;
  const rightSiblingEnd = Math.min(current + siblings, totalPages - boundaries);

  const result: PaginationRange = [];

  // Left boundary pages
  for (let i = 1; i <= Math.min(leftBoundaryEnd, totalPages); i++) {
    result.push(i);
  }

  // Left dots
  if (leftSiblingStart > leftBoundaryEnd + 2) {
    result.push("dots");
  } else {
    // Fill the gap instead of dots
    for (let i = leftBoundaryEnd + 1; i < leftSiblingStart; i++) {
      result.push(i);
    }
  }

  // Left siblings
  for (let i = leftSiblingStart; i <= leftSiblingEnd; i++) {
    if (i > leftBoundaryEnd && i < rightBoundaryStart) {
      result.push(i);
    }
  }

  // Current page (if not already in boundaries)
  if (current > leftBoundaryEnd && current < rightBoundaryStart) {
    result.push(current);
  }

  // Right siblings
  for (let i = rightSiblingStart; i <= rightSiblingEnd; i++) {
    if (i > leftBoundaryEnd && i < rightBoundaryStart) {
      result.push(i);
    }
  }

  // Right dots
  if (rightSiblingEnd < rightBoundaryStart - 2) {
    result.push("dots");
  } else {
    // Fill the gap instead of dots
    for (let i = rightSiblingEnd + 1; i < rightBoundaryStart; i++) {
      if (i > leftBoundaryEnd) {
        result.push(i);
      }
    }
  }

  // Right boundary pages
  for (let i = Math.max(rightBoundaryStart, leftBoundaryEnd + 1); i <= totalPages; i++) {
    result.push(i);
  }

  return result;
}

function range(start: number, end: number): number[] {
  const result: number[] = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
}

export function usePagination(options: UsePaginationOptions): UsePaginationReturn {
  const {
    total,
    pageSize,
    page: controlledPage,
    defaultPage = 1,
    onChange,
    siblings = 1,
    boundaries = 1,
  } = options;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const [page, setPageRaw] = useControllable({
    value: controlledPage,
    defaultValue: Math.min(Math.max(defaultPage, 1), totalPages),
    onChange,
  });

  const setPage = useCallback(
    (p: number) => {
      const clamped = Math.min(Math.max(p, 1), totalPages);
      setPageRaw(clamped);
    },
    [totalPages, setPageRaw],
  );

  const next = useCallback(() => {
    setPage(page + 1);
  }, [page, setPage]);

  const prev = useCallback(() => {
    setPage(page - 1);
  }, [page, setPage]);

  const first = useCallback(() => {
    setPage(1);
  }, [setPage]);

  const last = useCallback(() => {
    setPage(totalPages);
  }, [setPage, totalPages]);

  const paginationRange = useMemo(
    () => generateRange(page, totalPages, siblings, boundaries),
    [page, totalPages, siblings, boundaries],
  );

  return {
    page,
    totalPages,
    next,
    prev,
    first,
    last,
    setPage,
    range: paginationRange,
  };
}

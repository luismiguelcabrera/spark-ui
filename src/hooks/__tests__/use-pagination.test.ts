import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { usePagination } from "../use-pagination";

describe("usePagination", () => {
  // --- Initial state ---
  it("calculates total pages from total and pageSize", () => {
    const { result } = renderHook(() =>
      usePagination({ total: 100, pageSize: 10 }),
    );
    expect(result.current.totalPages).toBe(10);
    expect(result.current.page).toBe(1);
  });

  it("defaults to page 1", () => {
    const { result } = renderHook(() =>
      usePagination({ total: 50, pageSize: 10 }),
    );
    expect(result.current.page).toBe(1);
  });

  it("respects defaultPage", () => {
    const { result } = renderHook(() =>
      usePagination({ total: 100, pageSize: 10, defaultPage: 5 }),
    );
    expect(result.current.page).toBe(5);
  });

  it("clamps defaultPage to valid range", () => {
    const { result } = renderHook(() =>
      usePagination({ total: 30, pageSize: 10, defaultPage: 100 }),
    );
    expect(result.current.page).toBe(3);
  });

  it("rounds totalPages up", () => {
    const { result } = renderHook(() =>
      usePagination({ total: 25, pageSize: 10 }),
    );
    expect(result.current.totalPages).toBe(3);
  });

  // --- Navigation ---
  it("goes to next page", () => {
    const { result } = renderHook(() =>
      usePagination({ total: 50, pageSize: 10 }),
    );
    act(() => result.current.next());
    expect(result.current.page).toBe(2);
  });

  it("does not go past the last page", () => {
    const { result } = renderHook(() =>
      usePagination({ total: 30, pageSize: 10, defaultPage: 3 }),
    );
    act(() => result.current.next());
    expect(result.current.page).toBe(3);
  });

  it("goes to previous page", () => {
    const { result } = renderHook(() =>
      usePagination({ total: 50, pageSize: 10, defaultPage: 3 }),
    );
    act(() => result.current.prev());
    expect(result.current.page).toBe(2);
  });

  it("does not go before page 1", () => {
    const { result } = renderHook(() =>
      usePagination({ total: 50, pageSize: 10 }),
    );
    act(() => result.current.prev());
    expect(result.current.page).toBe(1);
  });

  it("goes to the first page", () => {
    const { result } = renderHook(() =>
      usePagination({ total: 50, pageSize: 10, defaultPage: 4 }),
    );
    act(() => result.current.first());
    expect(result.current.page).toBe(1);
  });

  it("goes to the last page", () => {
    const { result } = renderHook(() =>
      usePagination({ total: 50, pageSize: 10 }),
    );
    act(() => result.current.last());
    expect(result.current.page).toBe(5);
  });

  it("sets a specific page", () => {
    const { result } = renderHook(() =>
      usePagination({ total: 100, pageSize: 10 }),
    );
    act(() => result.current.setPage(7));
    expect(result.current.page).toBe(7);
  });

  it("clamps setPage to valid range", () => {
    const { result } = renderHook(() =>
      usePagination({ total: 50, pageSize: 10 }),
    );
    act(() => result.current.setPage(100));
    expect(result.current.page).toBe(5);
    act(() => result.current.setPage(-1));
    expect(result.current.page).toBe(1);
  });

  // --- onChange ---
  it("calls onChange when page changes", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      usePagination({ total: 50, pageSize: 10, onChange }),
    );
    act(() => result.current.next());
    expect(onChange).toHaveBeenCalledWith(2);
  });

  // --- Controlled mode ---
  it("respects controlled page prop", () => {
    const { result } = renderHook(() =>
      usePagination({ total: 100, pageSize: 10, page: 5 }),
    );
    expect(result.current.page).toBe(5);
  });

  // --- Range generation ---
  it("returns all pages when totalPages is small", () => {
    const { result } = renderHook(() =>
      usePagination({ total: 50, pageSize: 10 }),
    );
    expect(result.current.range).toEqual([1, 2, 3, 4, 5]);
  });

  it("generates range with dots for many pages", () => {
    const { result } = renderHook(() =>
      usePagination({ total: 100, pageSize: 10, defaultPage: 5 }),
    );
    const range = result.current.range;
    expect(range[0]).toBe(1);
    expect(range).toContain("dots");
    expect(range[range.length - 1]).toBe(10);
    expect(range).toContain(5);
  });

  it("shows dots only on the right when near the start", () => {
    const { result } = renderHook(() =>
      usePagination({ total: 100, pageSize: 10, defaultPage: 1 }),
    );
    const range = result.current.range;
    expect(range[0]).toBe(1);
    // Should have dots on the right side
    const dotsCount = range.filter((r) => r === "dots").length;
    expect(dotsCount).toBeGreaterThanOrEqual(1);
    expect(range[range.length - 1]).toBe(10);
  });

  it("shows dots only on the left when near the end", () => {
    const { result } = renderHook(() =>
      usePagination({ total: 100, pageSize: 10, defaultPage: 10 }),
    );
    const range = result.current.range;
    expect(range[0]).toBe(1);
    expect(range[range.length - 1]).toBe(10);
    const dotsCount = range.filter((r) => r === "dots").length;
    expect(dotsCount).toBeGreaterThanOrEqual(1);
  });

  it("respects siblings option", () => {
    const { result } = renderHook(() =>
      usePagination({
        total: 200,
        pageSize: 10,
        defaultPage: 10,
        siblings: 2,
      }),
    );
    const range = result.current.range;
    // Current page 10 with 2 siblings should show 8, 9, 10, 11, 12
    expect(range).toContain(8);
    expect(range).toContain(9);
    expect(range).toContain(10);
    expect(range).toContain(11);
    expect(range).toContain(12);
  });

  // --- Edge cases ---
  it("handles total of 0", () => {
    const { result } = renderHook(() =>
      usePagination({ total: 0, pageSize: 10 }),
    );
    expect(result.current.totalPages).toBe(1);
    expect(result.current.page).toBe(1);
  });

  it("handles pageSize larger than total", () => {
    const { result } = renderHook(() =>
      usePagination({ total: 5, pageSize: 10 }),
    );
    expect(result.current.totalPages).toBe(1);
    expect(result.current.range).toEqual([1]);
  });

  // --- Callback reference stability ---
  it("returns stable callback references", () => {
    const { result, rerender } = renderHook(() =>
      usePagination({ total: 100, pageSize: 10 }),
    );
    const { first, last } = result.current;
    rerender();
    expect(result.current.first).toBe(first);
    expect(result.current.last).toBe(last);
  });
});

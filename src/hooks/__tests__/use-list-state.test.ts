import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useListState } from "../use-list-state";

describe("useListState", () => {
  // --- Initial state ---
  it("defaults to an empty array", () => {
    const { result } = renderHook(() => useListState());
    expect(result.current[0]).toEqual([]);
  });

  it("accepts an initial array", () => {
    const { result } = renderHook(() => useListState([1, 2, 3]));
    expect(result.current[0]).toEqual([1, 2, 3]);
  });

  // --- append ---
  it("appends an item to the end", () => {
    const { result } = renderHook(() => useListState([1, 2]));
    act(() => result.current[1].append(3));
    expect(result.current[0]).toEqual([1, 2, 3]);
  });

  // --- prepend ---
  it("prepends an item to the beginning", () => {
    const { result } = renderHook(() => useListState([2, 3]));
    act(() => result.current[1].prepend(1));
    expect(result.current[0]).toEqual([1, 2, 3]);
  });

  // --- remove ---
  it("removes an item at a given index", () => {
    const { result } = renderHook(() => useListState(["a", "b", "c"]));
    act(() => result.current[1].remove(1));
    expect(result.current[0]).toEqual(["a", "c"]);
  });

  it("ignores remove with out-of-bounds index", () => {
    const { result } = renderHook(() => useListState([1, 2]));
    const before = result.current[0];
    act(() => result.current[1].remove(10));
    expect(result.current[0]).toBe(before);
  });

  it("ignores remove with negative index", () => {
    const { result } = renderHook(() => useListState([1, 2]));
    const before = result.current[0];
    act(() => result.current[1].remove(-1));
    expect(result.current[0]).toBe(before);
  });

  // --- insert ---
  it("inserts an item at a given index", () => {
    const { result } = renderHook(() => useListState([1, 3]));
    act(() => result.current[1].insert(1, 2));
    expect(result.current[0]).toEqual([1, 2, 3]);
  });

  it("clamps insert index to list bounds", () => {
    const { result } = renderHook(() => useListState([1, 2]));
    act(() => result.current[1].insert(100, 3));
    expect(result.current[0]).toEqual([1, 2, 3]);
  });

  it("inserts at beginning for negative index", () => {
    const { result } = renderHook(() => useListState([2, 3]));
    act(() => result.current[1].insert(-5, 1));
    expect(result.current[0]).toEqual([1, 2, 3]);
  });

  // --- reorder ---
  it("reorders items from one index to another", () => {
    const { result } = renderHook(() => useListState(["a", "b", "c", "d"]));
    act(() => result.current[1].reorder(0, 2));
    expect(result.current[0]).toEqual(["b", "c", "a", "d"]);
  });

  it("returns same reference when reorder indices are equal", () => {
    const { result } = renderHook(() => useListState([1, 2, 3]));
    const before = result.current[0];
    act(() => result.current[1].reorder(1, 1));
    expect(result.current[0]).toBe(before);
  });

  it("returns same reference for out-of-bounds reorder", () => {
    const { result } = renderHook(() => useListState([1, 2]));
    const before = result.current[0];
    act(() => result.current[1].reorder(0, 10));
    expect(result.current[0]).toBe(before);
  });

  // --- setItem ---
  it("sets an item at a given index", () => {
    const { result } = renderHook(() => useListState(["a", "b", "c"]));
    act(() => result.current[1].setItem(1, "x"));
    expect(result.current[0]).toEqual(["a", "x", "c"]);
  });

  it("ignores setItem with out-of-bounds index", () => {
    const { result } = renderHook(() => useListState([1, 2]));
    const before = result.current[0];
    act(() => result.current[1].setItem(5, 99));
    expect(result.current[0]).toBe(before);
  });

  // --- filter ---
  it("filters items based on a predicate", () => {
    const { result } = renderHook(() => useListState([1, 2, 3, 4, 5]));
    act(() => result.current[1].filter((n) => n % 2 === 0));
    expect(result.current[0]).toEqual([2, 4]);
  });

  // --- setState ---
  it("replaces the entire list", () => {
    const { result } = renderHook(() => useListState([1, 2]));
    act(() => result.current[1].setState([10, 20, 30]));
    expect(result.current[0]).toEqual([10, 20, 30]);
  });

  // --- Callback reference stability ---
  it("returns stable handler references", () => {
    const { result, rerender } = renderHook(() => useListState<number>());
    const handlers = result.current[1];
    rerender();
    expect(result.current[1].append).toBe(handlers.append);
    expect(result.current[1].prepend).toBe(handlers.prepend);
    expect(result.current[1].remove).toBe(handlers.remove);
    expect(result.current[1].insert).toBe(handlers.insert);
    expect(result.current[1].reorder).toBe(handlers.reorder);
    expect(result.current[1].setItem).toBe(handlers.setItem);
    expect(result.current[1].filter).toBe(handlers.filter);
    expect(result.current[1].setState).toBe(handlers.setState);
  });

  // --- Edge case: empty list operations ---
  it("appends to an empty list", () => {
    const { result } = renderHook(() => useListState<number>());
    act(() => result.current[1].append(1));
    expect(result.current[0]).toEqual([1]);
  });

  it("filters an empty list without error", () => {
    const { result } = renderHook(() => useListState<number>());
    act(() => result.current[1].filter(() => true));
    expect(result.current[0]).toEqual([]);
  });
});

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useSet } from "../use-set";

describe("useSet", () => {
  // --- Initial state ---
  it("starts with an empty set by default", () => {
    const { result } = renderHook(() => useSet<number>());
    expect(result.current.size).toBe(0);
  });

  it("accepts initial values", () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));
    expect(result.current.size).toBe(3);
    expect(result.current.has(1)).toBe(true);
    expect(result.current.has(2)).toBe(true);
    expect(result.current.has(3)).toBe(true);
  });

  it("deduplicates initial values", () => {
    const { result } = renderHook(() => useSet([1, 1, 2, 2]));
    expect(result.current.size).toBe(2);
  });

  // --- add ---
  it("adds a value", () => {
    const { result } = renderHook(() => useSet<number>());
    act(() => result.current.add(1));
    expect(result.current.has(1)).toBe(true);
    expect(result.current.size).toBe(1);
  });

  it("does not change reference when adding an existing value", () => {
    const { result } = renderHook(() => useSet([1, 2]));
    const before = result.current.set;
    act(() => result.current.add(1));
    expect(result.current.set).toBe(before);
  });

  // --- delete ---
  it("deletes a value", () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));
    act(() => result.current.delete(2));
    expect(result.current.has(2)).toBe(false);
    expect(result.current.size).toBe(2);
  });

  it("does not change reference when deleting a non-existent value", () => {
    const { result } = renderHook(() => useSet([1]));
    const before = result.current.set;
    act(() => result.current.delete(99));
    expect(result.current.set).toBe(before);
  });

  // --- has ---
  it("returns true for existing values", () => {
    const { result } = renderHook(() => useSet(["a", "b"]));
    expect(result.current.has("a")).toBe(true);
  });

  it("returns false for missing values", () => {
    const { result } = renderHook(() => useSet<string>());
    expect(result.current.has("nope")).toBe(false);
  });

  // --- clear ---
  it("clears all values", () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));
    act(() => result.current.clear());
    expect(result.current.size).toBe(0);
  });

  // --- toggle ---
  it("adds value if not present", () => {
    const { result } = renderHook(() => useSet<number>());
    act(() => result.current.toggle(5));
    expect(result.current.has(5)).toBe(true);
  });

  it("removes value if present", () => {
    const { result } = renderHook(() => useSet([5]));
    act(() => result.current.toggle(5));
    expect(result.current.has(5)).toBe(false);
  });

  // --- reset ---
  it("resets to initial values", () => {
    const { result } = renderHook(() => useSet([1, 2]));
    act(() => result.current.add(3));
    act(() => result.current.delete(1));
    act(() => result.current.reset());
    expect(result.current.size).toBe(2);
    expect(result.current.has(1)).toBe(true);
    expect(result.current.has(2)).toBe(true);
    expect(result.current.has(3)).toBe(false);
  });

  it("resets to empty when no initial values", () => {
    const { result } = renderHook(() => useSet<number>());
    act(() => result.current.add(1));
    act(() => result.current.reset());
    expect(result.current.size).toBe(0);
  });

  // --- New Set reference on mutation ---
  it("returns a new Set reference on add", () => {
    const { result } = renderHook(() => useSet<number>());
    const before = result.current.set;
    act(() => result.current.add(1));
    expect(result.current.set).not.toBe(before);
  });

  it("returns a new Set reference on delete", () => {
    const { result } = renderHook(() => useSet([1]));
    const before = result.current.set;
    act(() => result.current.delete(1));
    expect(result.current.set).not.toBe(before);
  });

  it("returns a new Set reference on toggle", () => {
    const { result } = renderHook(() => useSet<number>());
    const before = result.current.set;
    act(() => result.current.toggle(1));
    expect(result.current.set).not.toBe(before);
  });

  // --- Callback reference stability ---
  it("returns stable callback references for add, delete, clear, toggle, reset", () => {
    const { result, rerender } = renderHook(() => useSet<number>());
    const { add, clear, toggle, reset } = result.current;
    const del = result.current.delete;
    rerender();
    expect(result.current.add).toBe(add);
    expect(result.current.delete).toBe(del);
    expect(result.current.clear).toBe(clear);
    expect(result.current.toggle).toBe(toggle);
    expect(result.current.reset).toBe(reset);
  });
});

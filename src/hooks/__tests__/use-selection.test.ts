import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useSelection } from "../use-selection";

describe("useSelection", () => {
  // --- Initial state ---
  it("starts with no selected items", () => {
    const { result } = renderHook(() => useSelection<string>());
    expect(result.current.selected).toEqual([]);
  });

  // --- Single selection mode (default) ---
  describe("single selection (default)", () => {
    it("selects a single item", () => {
      const { result } = renderHook(() => useSelection<string>());
      act(() => result.current.select("a"));
      expect(result.current.selected).toEqual(["a"]);
      expect(result.current.isSelected("a")).toBe(true);
    });

    it("replaces selection when selecting a new item", () => {
      const { result } = renderHook(() => useSelection<string>());
      act(() => result.current.select("a"));
      act(() => result.current.select("b"));
      expect(result.current.selected).toEqual(["b"]);
      expect(result.current.isSelected("a")).toBe(false);
      expect(result.current.isSelected("b")).toBe(true);
    });

    it("does not duplicate when selecting the same item", () => {
      const { result } = renderHook(() => useSelection<string>());
      act(() => result.current.select("a"));
      const before = result.current.selected;
      act(() => result.current.select("a"));
      expect(result.current.selected).toBe(before);
    });

    it("toggles selection on", () => {
      const { result } = renderHook(() => useSelection<string>());
      act(() => result.current.toggle("a"));
      expect(result.current.selected).toEqual(["a"]);
    });

    it("toggles selection off", () => {
      const { result } = renderHook(() => useSelection<string>());
      act(() => result.current.toggle("a"));
      act(() => result.current.toggle("a"));
      expect(result.current.selected).toEqual([]);
    });

    it("replaces selection on toggle of a new item", () => {
      const { result } = renderHook(() => useSelection<string>());
      act(() => result.current.toggle("a"));
      act(() => result.current.toggle("b"));
      expect(result.current.selected).toEqual(["b"]);
    });

    it("selectAll picks only the first item in single mode", () => {
      const { result } = renderHook(() => useSelection<string>());
      act(() => result.current.selectAll(["a", "b", "c"]));
      expect(result.current.selected).toEqual(["a"]);
    });
  });

  // --- Multiple selection mode ---
  describe("multiple selection", () => {
    it("selects multiple items", () => {
      const { result } = renderHook(() =>
        useSelection<string>({ multiple: true }),
      );
      act(() => result.current.select("a"));
      act(() => result.current.select("b"));
      expect(result.current.selected).toEqual(["a", "b"]);
    });

    it("does not duplicate when selecting same item", () => {
      const { result } = renderHook(() =>
        useSelection<string>({ multiple: true }),
      );
      act(() => result.current.select("a"));
      const before = result.current.selected;
      act(() => result.current.select("a"));
      expect(result.current.selected).toBe(before);
    });

    it("toggles items in multi mode", () => {
      const { result } = renderHook(() =>
        useSelection<string>({ multiple: true }),
      );
      act(() => result.current.toggle("a"));
      act(() => result.current.toggle("b"));
      act(() => result.current.toggle("a"));
      expect(result.current.selected).toEqual(["b"]);
    });

    it("selectAll selects all items in multiple mode", () => {
      const { result } = renderHook(() =>
        useSelection<string>({ multiple: true }),
      );
      act(() => result.current.selectAll(["a", "b", "c"]));
      expect(result.current.selected).toEqual(["a", "b", "c"]);
    });
  });

  // --- deselect ---
  it("deselects a specific item", () => {
    const { result } = renderHook(() =>
      useSelection<string>({ multiple: true }),
    );
    act(() => result.current.select("a"));
    act(() => result.current.select("b"));
    act(() => result.current.deselect("a"));
    expect(result.current.selected).toEqual(["b"]);
  });

  it("does not change reference when deselecting non-existent item", () => {
    const { result } = renderHook(() => useSelection<string>());
    const before = result.current.selected;
    act(() => result.current.deselect("z"));
    expect(result.current.selected).toBe(before);
  });

  // --- isSelected ---
  it("returns false for items not selected", () => {
    const { result } = renderHook(() => useSelection<number>());
    expect(result.current.isSelected(42)).toBe(false);
  });

  // --- clear ---
  it("clears all selections", () => {
    const { result } = renderHook(() =>
      useSelection<string>({ multiple: true }),
    );
    act(() => result.current.select("a"));
    act(() => result.current.select("b"));
    act(() => result.current.clear());
    expect(result.current.selected).toEqual([]);
  });

  // --- selectAll edge cases ---
  it("selectAll with empty array does nothing in single mode", () => {
    const { result } = renderHook(() => useSelection<string>());
    const before = result.current.selected;
    act(() => result.current.selectAll([]));
    // selected stays the same (empty) in single mode with empty items
    expect(result.current.selected).toBe(before);
  });

  // --- Works with number items ---
  it("works with number items", () => {
    const { result } = renderHook(() =>
      useSelection<number>({ multiple: true }),
    );
    act(() => result.current.select(1));
    act(() => result.current.select(2));
    expect(result.current.isSelected(1)).toBe(true);
    expect(result.current.isSelected(3)).toBe(false);
  });

  // --- Callback reference stability ---
  it("returns stable callback references for select, deselect, clear", () => {
    const { result, rerender } = renderHook(() => useSelection<string>());
    const { select, deselect, toggle, clear, selectAll } = result.current;
    rerender();
    expect(result.current.select).toBe(select);
    expect(result.current.deselect).toBe(deselect);
    expect(result.current.toggle).toBe(toggle);
    expect(result.current.clear).toBe(clear);
    expect(result.current.selectAll).toBe(selectAll);
  });
});

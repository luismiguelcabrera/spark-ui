import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useStateHistory } from "../use-state-history";

describe("useStateHistory", () => {
  // --- Initial state ---
  it("starts with the initial value", () => {
    const { result } = renderHook(() => useStateHistory("a"));
    expect(result.current.state).toBe("a");
    expect(result.current.pointer).toBe(0);
    expect(result.current.history).toEqual(["a"]);
  });

  it("cannot undo or redo at initial state", () => {
    const { result } = renderHook(() => useStateHistory(0));
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  // --- set ---
  it("pushes new values onto history", () => {
    const { result } = renderHook(() => useStateHistory("a"));
    act(() => result.current.set("b"));
    expect(result.current.state).toBe("b");
    expect(result.current.history).toEqual(["a", "b"]);
    expect(result.current.pointer).toBe(1);
  });

  it("can set multiple values", () => {
    const { result } = renderHook(() => useStateHistory(0));
    act(() => result.current.set(1));
    act(() => result.current.set(2));
    act(() => result.current.set(3));
    expect(result.current.state).toBe(3);
    expect(result.current.history).toEqual([0, 1, 2, 3]);
    expect(result.current.pointer).toBe(3);
  });

  // --- undo ---
  it("undoes the last action", () => {
    const { result } = renderHook(() => useStateHistory("a"));
    act(() => result.current.set("b"));
    act(() => result.current.undo());
    expect(result.current.state).toBe("a");
    expect(result.current.pointer).toBe(0);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(true);
  });

  it("does nothing when undo is called at initial state", () => {
    const { result } = renderHook(() => useStateHistory("x"));
    act(() => result.current.undo());
    expect(result.current.state).toBe("x");
    expect(result.current.pointer).toBe(0);
  });

  // --- redo ---
  it("redoes an undone action", () => {
    const { result } = renderHook(() => useStateHistory("a"));
    act(() => result.current.set("b"));
    act(() => result.current.undo());
    act(() => result.current.redo());
    expect(result.current.state).toBe("b");
    expect(result.current.pointer).toBe(1);
    expect(result.current.canRedo).toBe(false);
  });

  it("does nothing when redo is called at latest state", () => {
    const { result } = renderHook(() => useStateHistory("a"));
    act(() => result.current.set("b"));
    act(() => result.current.redo());
    expect(result.current.state).toBe("b");
    expect(result.current.pointer).toBe(1);
  });

  // --- Branching: set after undo truncates future ---
  it("truncates future history when setting after undo", () => {
    const { result } = renderHook(() => useStateHistory("a"));
    act(() => result.current.set("b"));
    act(() => result.current.set("c"));
    act(() => result.current.undo());
    act(() => result.current.set("d"));
    expect(result.current.state).toBe("d");
    expect(result.current.history).toEqual(["a", "b", "d"]);
    expect(result.current.pointer).toBe(2);
    expect(result.current.canRedo).toBe(false);
  });

  // --- reset ---
  it("resets to the initial value", () => {
    const { result } = renderHook(() => useStateHistory("a"));
    act(() => result.current.set("b"));
    act(() => result.current.set("c"));
    act(() => result.current.reset());
    expect(result.current.state).toBe("a");
    expect(result.current.history).toEqual(["a"]);
    expect(result.current.pointer).toBe(0);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it("resets to a specific value", () => {
    const { result } = renderHook(() => useStateHistory("a"));
    act(() => result.current.set("b"));
    act(() => result.current.reset("z"));
    expect(result.current.state).toBe("z");
    expect(result.current.history).toEqual(["z"]);
    expect(result.current.pointer).toBe(0);
  });

  // --- Multiple undo/redo ---
  it("handles multiple undo and redo steps", () => {
    const { result } = renderHook(() => useStateHistory(0));
    act(() => result.current.set(1));
    act(() => result.current.set(2));
    act(() => result.current.set(3));

    act(() => result.current.undo());
    act(() => result.current.undo());
    expect(result.current.state).toBe(1);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(true);

    act(() => result.current.redo());
    expect(result.current.state).toBe(2);
  });

  // --- Callback reference stability ---
  it("returns stable callback references", () => {
    const { result, rerender } = renderHook(() => useStateHistory(0));
    const { set, undo, redo, reset } = result.current;
    rerender();
    expect(result.current.set).toBe(set);
    expect(result.current.undo).toBe(undo);
    expect(result.current.redo).toBe(redo);
    expect(result.current.reset).toBe(reset);
  });

  // --- Works with objects ---
  it("works with object state", () => {
    const { result } = renderHook(() => useStateHistory({ x: 1 }));
    act(() => result.current.set({ x: 2 }));
    act(() => result.current.undo());
    expect(result.current.state).toEqual({ x: 1 });
  });
});

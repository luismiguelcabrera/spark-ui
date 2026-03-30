import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useCounter } from "../use-counter";

describe("useCounter", () => {
  // --- Initial state ---
  it("defaults to 0 with no arguments", () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it("starts at the given initial value", () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
  });

  it("clamps initial value to min", () => {
    const { result } = renderHook(() => useCounter(-5, { min: 0 }));
    expect(result.current.count).toBe(0);
  });

  it("clamps initial value to max", () => {
    const { result } = renderHook(() => useCounter(20, { max: 10 }));
    expect(result.current.count).toBe(10);
  });

  // --- increment ---
  it("increments by 1", () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });

  it("does not increment beyond max", () => {
    const { result } = renderHook(() => useCounter(10, { max: 10 }));
    act(() => result.current.increment());
    expect(result.current.count).toBe(10);
  });

  // --- decrement ---
  it("decrements by 1", () => {
    const { result } = renderHook(() => useCounter(5));
    act(() => result.current.decrement());
    expect(result.current.count).toBe(4);
  });

  it("does not decrement below min", () => {
    const { result } = renderHook(() => useCounter(0, { min: 0 }));
    act(() => result.current.decrement());
    expect(result.current.count).toBe(0);
  });

  // --- set ---
  it("sets an arbitrary value", () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => result.current.set(42));
    expect(result.current.count).toBe(42);
  });

  it("clamps set value to min/max", () => {
    const { result } = renderHook(() => useCounter(5, { min: 0, max: 10 }));
    act(() => result.current.set(100));
    expect(result.current.count).toBe(10);
    act(() => result.current.set(-100));
    expect(result.current.count).toBe(0);
  });

  // --- reset ---
  it("resets to the initial value", () => {
    const { result } = renderHook(() => useCounter(3));
    act(() => result.current.increment());
    act(() => result.current.increment());
    expect(result.current.count).toBe(5);
    act(() => result.current.reset());
    expect(result.current.count).toBe(3);
  });

  // --- Callback reference stability ---
  it("returns stable callback references", () => {
    const { result, rerender } = renderHook(() => useCounter(0));
    const { increment, decrement, set, reset } = result.current;
    rerender();
    expect(result.current.increment).toBe(increment);
    expect(result.current.decrement).toBe(decrement);
    expect(result.current.set).toBe(set);
    expect(result.current.reset).toBe(reset);
  });

  // --- Edge cases ---
  it("works with negative initial values", () => {
    const { result } = renderHook(() => useCounter(-3));
    expect(result.current.count).toBe(-3);
    act(() => result.current.increment());
    expect(result.current.count).toBe(-2);
  });

  it("works with min equal to max", () => {
    const { result } = renderHook(() => useCounter(5, { min: 5, max: 5 }));
    expect(result.current.count).toBe(5);
    act(() => result.current.increment());
    expect(result.current.count).toBe(5);
    act(() => result.current.decrement());
    expect(result.current.count).toBe(5);
  });
});

import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useEventCallback } from "../use-event-callback";

describe("useEventCallback", () => {
  it("returns a function", () => {
    const { result } = renderHook(() => useEventCallback(() => 42));
    expect(result.current).toBeTypeOf("function");
  });

  it("calls the provided callback", () => {
    const callback = vi.fn(() => "hello");
    const { result } = renderHook(() => useEventCallback(callback));

    const returnValue = result.current();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe("hello");
  });

  it("passes arguments through", () => {
    const callback = vi.fn((a: number, b: string) => `${a}-${b}`);
    const { result } = renderHook(() => useEventCallback(callback));

    const returnValue = result.current(5, "test");
    expect(callback).toHaveBeenCalledWith(5, "test");
    expect(returnValue).toBe("5-test");
  });

  it("returns a stable function reference across rerenders", () => {
    const { result, rerender } = renderHook(
      ({ cb }) => useEventCallback(cb),
      { initialProps: { cb: (() => 1) as () => number } },
    );

    const firstRef = result.current;
    rerender({ cb: () => 2 });

    expect(result.current).toBe(firstRef);
  });

  it("always calls the latest callback version", () => {
    let count = 0;
    const { result, rerender } = renderHook(
      ({ cb }) => useEventCallback(cb),
      { initialProps: { cb: () => ++count } },
    );

    result.current();
    expect(count).toBe(1);

    // Update the callback
    let newCount = 100;
    rerender({ cb: () => ++newCount });

    result.current();
    expect(newCount).toBe(101);
  });

  it("works with void callbacks", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useEventCallback(callback));

    result.current();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

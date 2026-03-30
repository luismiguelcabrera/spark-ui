import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useDebouncedCallback } from "../use-debounced-callback";

describe("useDebouncedCallback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("debounces the callback by the specified delay", () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 200));

    act(() => {
      result.current("a");
      result.current("b");
      result.current("c");
    });

    expect(fn).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("c");
  });

  it("invokes callback after delay elapses", () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 100));

    act(() => {
      result.current("hello");
    });

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(fn).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(fn).toHaveBeenCalledWith("hello");
  });

  it("cancel() clears pending invocation", () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 200));

    act(() => {
      result.current("value");
    });

    act(() => {
      result.current.cancel();
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(fn).not.toHaveBeenCalled();
  });

  it("flush() invokes the callback immediately", () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 500));

    act(() => {
      result.current("flushed");
    });

    act(() => {
      result.current.flush();
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("flushed");

    // Should not fire again after delay
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("flush() does nothing when there is no pending invocation", () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 200));

    act(() => {
      result.current.flush();
    });

    expect(fn).not.toHaveBeenCalled();
  });

  it("isPending() returns correct state", () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 200));

    expect(result.current.isPending()).toBe(false);

    act(() => {
      result.current("test");
    });

    expect(result.current.isPending()).toBe(true);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.isPending()).toBe(false);
  });

  it("isPending() returns false after cancel", () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 200));

    act(() => {
      result.current("test");
    });

    expect(result.current.isPending()).toBe(true);

    act(() => {
      result.current.cancel();
    });

    expect(result.current.isPending()).toBe(false);
  });

  it("uses the latest callback without restarting debounce", () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    const { result, rerender } = renderHook(
      ({ cb }) => useDebouncedCallback(cb, 200),
      { initialProps: { cb: fn1 } }
    );

    act(() => {
      result.current("value");
    });

    // Change callback mid-debounce
    rerender({ cb: fn2 });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledWith("value");
  });

  it("cleans up timeout on unmount", () => {
    const fn = vi.fn();
    const { result, unmount } = renderHook(() =>
      useDebouncedCallback(fn, 200)
    );

    act(() => {
      result.current("value");
    });

    unmount();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(fn).not.toHaveBeenCalled();
  });

  it("resets debounce timer on each call", () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 200));

    act(() => {
      result.current("a");
    });

    act(() => {
      vi.advanceTimersByTime(150);
    });

    act(() => {
      result.current("b");
    });

    act(() => {
      vi.advanceTimersByTime(150);
    });

    // Should not have fired yet (150ms since last call)
    expect(fn).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("b");
  });

  it("handles delay change by creating new debounced function", () => {
    const fn = vi.fn();
    const { result, rerender } = renderHook(
      ({ delay }) => useDebouncedCallback(fn, delay),
      { initialProps: { delay: 200 } }
    );

    act(() => {
      result.current("first");
    });

    // Change delay before timer fires
    rerender({ delay: 500 });

    act(() => {
      result.current("second");
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(fn).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(fn).toHaveBeenCalledWith("second");
  });
});

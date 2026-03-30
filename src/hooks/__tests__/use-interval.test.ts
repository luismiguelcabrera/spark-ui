import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useInterval } from "../use-interval";

describe("useInterval", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls the callback at the specified interval", () => {
    const fn = vi.fn();
    renderHook(() => useInterval(fn, 100));

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(5);
  });

  it("does not start interval when delay is null", () => {
    const fn = vi.fn();
    renderHook(() => useInterval(fn, null));

    vi.advanceTimersByTime(1000);
    expect(fn).not.toHaveBeenCalled();
  });

  it("pauses interval when delay changes to null", () => {
    const fn = vi.fn();
    const { rerender } = renderHook(
      ({ delay }) => useInterval(fn, delay),
      { initialProps: { delay: 100 as number | null } }
    );

    vi.advanceTimersByTime(250);
    expect(fn).toHaveBeenCalledTimes(2);

    rerender({ delay: null });

    vi.advanceTimersByTime(500);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("resumes interval when delay changes from null to a number", () => {
    const fn = vi.fn();
    const { rerender } = renderHook(
      ({ delay }) => useInterval(fn, delay),
      { initialProps: { delay: null as number | null } }
    );

    vi.advanceTimersByTime(500);
    expect(fn).not.toHaveBeenCalled();

    rerender({ delay: 100 });

    vi.advanceTimersByTime(350);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("uses the latest callback without restarting interval", () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    const { rerender } = renderHook(
      ({ cb }) => useInterval(cb, 100),
      { initialProps: { cb: fn1 } }
    );

    vi.advanceTimersByTime(100);
    expect(fn1).toHaveBeenCalledTimes(1);

    rerender({ cb: fn2 });

    vi.advanceTimersByTime(100);
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);
  });

  it("restarts interval when delay changes", () => {
    const fn = vi.fn();
    const { rerender } = renderHook(
      ({ delay }) => useInterval(fn, delay),
      { initialProps: { delay: 100 as number | null } }
    );

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);

    rerender({ delay: 200 });

    vi.advanceTimersByTime(100);
    // Should not have fired yet — new interval is 200ms
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("cleans up interval on unmount", () => {
    const fn = vi.fn();
    const { unmount } = renderHook(() => useInterval(fn, 100));

    vi.advanceTimersByTime(250);
    expect(fn).toHaveBeenCalledTimes(2);

    unmount();

    vi.advanceTimersByTime(500);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("handles small delay", () => {
    const fn = vi.fn();
    renderHook(() => useInterval(fn, 10));

    vi.advanceTimersByTime(55);
    expect(fn).toHaveBeenCalledTimes(5);
  });
});

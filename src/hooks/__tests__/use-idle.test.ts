import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useIdle } from "../use-idle";

describe("useIdle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns false initially (user is active)", () => {
    const { result } = renderHook(() => useIdle(1000));
    expect(result.current).toBe(false);
  });

  it("returns true after the timeout elapses", () => {
    const { result } = renderHook(() => useIdle(1000));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe(true);
  });

  it("resets to active on user interaction", () => {
    const { result } = renderHook(() => useIdle(1000));

    // Advance halfway
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe(false);

    // Simulate user activity
    act(() => {
      document.dispatchEvent(new Event("mousemove"));
    });

    // Advance past original timeout but not past new one
    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(result.current).toBe(false);

    // Now let the new timer expire
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe(true);
  });

  it("resets on keydown events", () => {
    const { result } = renderHook(() => useIdle(1000));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe(true);

    act(() => {
      document.dispatchEvent(new Event("keydown"));
    });

    expect(result.current).toBe(false);
  });

  it("resets on touchstart events", () => {
    const { result } = renderHook(() => useIdle(1000));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe(true);

    act(() => {
      document.dispatchEvent(new Event("touchstart"));
    });

    expect(result.current).toBe(false);
  });

  it("resets on scroll events", () => {
    const { result } = renderHook(() => useIdle(1000));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe(true);

    act(() => {
      document.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(false);
  });

  it("uses default timeout of 60000ms", () => {
    const { result } = renderHook(() => useIdle());

    act(() => {
      vi.advanceTimersByTime(59999);
    });

    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe(true);
  });

  it("cleans up event listeners and timers on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

    const { unmount } = renderHook(() => useIdle(1000));
    unmount();

    const removedEvents = removeEventListenerSpy.mock.calls.map(
      (call) => call[0],
    );
    expect(removedEvents).toContain("mousemove");
    expect(removedEvents).toContain("mousedown");
    expect(removedEvents).toContain("keydown");
    expect(removedEvents).toContain("touchstart");
    expect(removedEvents).toContain("scroll");
  });

  it("does not report idle before timeout when user is continuously active", () => {
    const { result } = renderHook(() => useIdle(1000));

    // Simulate repeated activity
    for (let i = 0; i < 5; i++) {
      act(() => {
        vi.advanceTimersByTime(800);
        document.dispatchEvent(new Event("mousemove"));
      });
    }

    expect(result.current).toBe(false);
  });
});

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useScrollIntoView } from "../use-scroll-into-view";

describe("useScrollIntoView", () => {
  const originalScrollTo = window.scrollTo;
  const originalMatchMedia = window.matchMedia;
  const originalRAF = window.requestAnimationFrame;
  const originalCAF = window.cancelAnimationFrame;

  beforeEach(() => {
    window.scrollTo = vi.fn();
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });
  });

  afterEach(() => {
    window.scrollTo = originalScrollTo;
    window.matchMedia = originalMatchMedia;
    window.requestAnimationFrame = originalRAF;
    window.cancelAnimationFrame = originalCAF;
  });

  it("returns a ref and scrollIntoView function", () => {
    const { result } = renderHook(() => useScrollIntoView());

    expect(result.current.ref).toBeDefined();
    expect(typeof result.current.scrollIntoView).toBe("function");
  });

  it("scrollIntoView does nothing when ref has no element", () => {
    const { result } = renderHook(() => useScrollIntoView());

    act(() => {
      result.current.scrollIntoView();
    });

    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("scrolls instantly when prefers-reduced-motion is enabled", () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true });

    const element = document.createElement("div");
    vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
      top: 500,
      left: 0,
      bottom: 600,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 500,
      toJSON: () => {},
    });

    const { result } = renderHook(() => useScrollIntoView());
    (result.current.ref as { current: HTMLElement | null }).current = element;

    act(() => {
      result.current.scrollIntoView();
    });

    expect(window.scrollTo).toHaveBeenCalledWith(0, expect.any(Number));
  });

  it("scrolls instantly when duration is 0", () => {
    const element = document.createElement("div");
    vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
      top: 300,
      left: 0,
      bottom: 400,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 300,
      toJSON: () => {},
    });

    const { result } = renderHook(() =>
      useScrollIntoView({ duration: 0 })
    );
    (result.current.ref as { current: HTMLElement | null }).current = element;

    act(() => {
      result.current.scrollIntoView();
    });

    expect(window.scrollTo).toHaveBeenCalledTimes(1);
  });

  it("applies offset to scroll position", () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true });

    const element = document.createElement("div");
    vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
      top: 500,
      left: 0,
      bottom: 600,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 500,
      toJSON: () => {},
    });

    Object.defineProperty(document.documentElement, "scrollTop", {
      value: 0,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() =>
      useScrollIntoView({ offset: 100 })
    );
    (result.current.ref as { current: HTMLElement | null }).current = element;

    act(() => {
      result.current.scrollIntoView();
    });

    // scrollTo should be called with target position minus offset
    const call = (window.scrollTo as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call[0]).toBe(0);
    expect(call[1]).toBe(400); // 500 (top) + 0 (scrollTop) - 100 (offset)
  });

  it("uses requestAnimationFrame for animated scroll", () => {
    const rafCallbacks: FrameRequestCallback[] = [];
    window.requestAnimationFrame = vi.fn((cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });
    window.cancelAnimationFrame = vi.fn();

    const element = document.createElement("div");
    vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
      top: 500,
      left: 0,
      bottom: 600,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 500,
      toJSON: () => {},
    });

    const { result } = renderHook(() =>
      useScrollIntoView({ duration: 300 })
    );
    (result.current.ref as { current: HTMLElement | null }).current = element;

    act(() => {
      result.current.scrollIntoView();
    });

    expect(window.requestAnimationFrame).toHaveBeenCalled();
  });

  it("accepts a custom easing function", () => {
    const customEasing = vi.fn((t: number) => t);

    // Collect RAF callbacks instead of calling them immediately
    const rafCallbacks: FrameRequestCallback[] = [];
    let rafId = 0;
    window.requestAnimationFrame = vi.fn((cb) => {
      rafCallbacks.push(cb);
      return ++rafId;
    });
    window.cancelAnimationFrame = vi.fn();

    const element = document.createElement("div");
    vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
      top: 500,
      left: 0,
      bottom: 600,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 500,
      toJSON: () => {},
    });

    const { result } = renderHook(() =>
      useScrollIntoView({ duration: 300, easing: customEasing })
    );
    (result.current.ref as { current: HTMLElement | null }).current = element;

    act(() => {
      result.current.scrollIntoView();
    });

    // Simulate one animation frame at the midpoint
    if (rafCallbacks.length > 0) {
      act(() => {
        rafCallbacks[0](performance.now() + 150);
      });
    }

    expect(customEasing).toHaveBeenCalled();
  });

  it("scrollIntoView returns a stable reference", () => {
    const { result, rerender } = renderHook(() => useScrollIntoView());

    const firstRef = result.current.scrollIntoView;
    rerender();
    const secondRef = result.current.scrollIntoView;

    expect(firstRef).toBe(secondRef);
  });
});

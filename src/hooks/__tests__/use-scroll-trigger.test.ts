import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useScrollTrigger } from "../use-scroll-trigger";

describe("useScrollTrigger", () => {
  let scrollY: number;

  beforeEach(() => {
    scrollY = 0;
    Object.defineProperty(window, "scrollY", {
      get: () => scrollY,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns false initially when at top", () => {
    const { result } = renderHook(() => useScrollTrigger());
    expect(result.current).toBe(false);
  });

  it("triggers when scroll exceeds default threshold (100)", () => {
    const { result } = renderHook(() =>
      useScrollTrigger({ disableHysteresis: true }),
    );

    act(() => {
      scrollY = 150;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(true);
  });

  it("does not trigger below threshold", () => {
    const { result } = renderHook(() =>
      useScrollTrigger({ disableHysteresis: true }),
    );

    act(() => {
      scrollY = 50;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(false);
  });

  it("uses custom threshold", () => {
    const { result } = renderHook(() =>
      useScrollTrigger({ threshold: 200, disableHysteresis: true }),
    );

    act(() => {
      scrollY = 150;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(false);

    act(() => {
      scrollY = 250;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(true);
  });

  it("with hysteresis: triggers on scroll down past threshold", () => {
    const { result } = renderHook(() => useScrollTrigger({ threshold: 100 }));

    // Scroll down past threshold
    act(() => {
      scrollY = 150;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(true);
  });

  it("with hysteresis: stays triggered when scrolling up but above threshold", () => {
    const { result } = renderHook(() => useScrollTrigger({ threshold: 100 }));

    // Scroll down
    act(() => {
      scrollY = 200;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(true);

    // Scroll up but still above threshold
    act(() => {
      scrollY = 150;
      window.dispatchEvent(new Event("scroll"));
    });

    // With hysteresis, stays triggered until below threshold
    expect(result.current).toBe(true);
  });

  it("with hysteresis: untriggers when scroll goes below threshold", () => {
    const { result } = renderHook(() => useScrollTrigger({ threshold: 100 }));

    // Scroll down past threshold
    act(() => {
      scrollY = 200;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(true);

    // Scroll back below threshold
    act(() => {
      scrollY = 50;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(false);
  });

  it("without hysteresis: flips immediately at threshold", () => {
    const { result } = renderHook(() =>
      useScrollTrigger({ threshold: 100, disableHysteresis: true }),
    );

    act(() => {
      scrollY = 150;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(true);

    act(() => {
      scrollY = 50;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(false);
  });

  it("works with a custom target element", () => {
    const el = document.createElement("div");
    Object.defineProperty(el, "scrollTop", {
      get: () => 200,
      configurable: true,
    });

    const { result } = renderHook(() =>
      useScrollTrigger({
        target: el,
        threshold: 100,
        disableHysteresis: true,
      }),
    );

    act(() => {
      el.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(true);
  });

  it("cleans up scroll listener on unmount", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useScrollTrigger());

    expect(addSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      { passive: true },
    );

    unmount();

    expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
  });
});

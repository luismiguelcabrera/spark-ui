import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useMorph } from "../use-morph";

function createMockMediaQueryList(matches: boolean) {
  return {
    matches,
    media: "(prefers-reduced-motion: reduce)",
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    onchange: null,
    dispatchEvent: vi.fn(),
  } as unknown as MediaQueryList;
}

describe("useMorph", () => {
  let rafCallback: FrameRequestCallback | null = null;
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    rafCallback = null;
    originalMatchMedia = window.matchMedia;
    // Default: no reduced motion
    window.matchMedia = vi.fn(() => createMockMediaQueryList(false));
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      rafCallback = cb;
      return 1;
    });
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  it("returns a ref and trigger function", () => {
    const { result } = renderHook(() => useMorph<HTMLDivElement>());
    expect(result.current.ref).toBeDefined();
    expect(result.current.ref.current).toBeNull();
    expect(result.current.trigger).toBeTypeOf("function");
  });

  it("trigger does nothing when ref is null", () => {
    const { result } = renderHook(() => useMorph<HTMLDivElement>());
    result.current.trigger();
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  });

  it("trigger captures bounding rect and schedules rAF", () => {
    const { result } = renderHook(() => useMorph<HTMLDivElement>());
    const el = document.createElement("div");
    vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
      top: 10, left: 20, width: 100, height: 50,
      right: 120, bottom: 60, x: 20, y: 10, toJSON: () => {},
    });
    (result.current.ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
    result.current.trigger();
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
  });

  it("respects prefers-reduced-motion", () => {
    window.matchMedia = vi.fn(() => createMockMediaQueryList(true));
    const { result } = renderHook(() => useMorph<HTMLDivElement>());
    const el = document.createElement("div");
    const animateSpy = vi.fn();
    el.animate = animateSpy;

    let callCount = 0;
    vi.spyOn(el, "getBoundingClientRect").mockImplementation(() => {
      callCount++;
      return callCount === 1
        ? { top: 10, left: 20, width: 100, height: 50, right: 120, bottom: 60, x: 20, y: 10, toJSON: () => {} }
        : { top: 50, left: 80, width: 100, height: 50, right: 180, bottom: 100, x: 80, y: 50, toJSON: () => {} };
    });

    (result.current.ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
    result.current.trigger();
    if (rafCallback) rafCallback(0);
    expect(animateSpy).not.toHaveBeenCalled();
  });

  it("animates when element moves and reduced motion is off", () => {
    const { result } = renderHook(() => useMorph<HTMLDivElement>());
    const el = document.createElement("div");
    const animateSpy = vi.fn();
    el.animate = animateSpy;

    let callCount = 0;
    vi.spyOn(el, "getBoundingClientRect").mockImplementation(() => {
      callCount++;
      return callCount === 1
        ? { top: 10, left: 20, width: 100, height: 50, right: 120, bottom: 60, x: 20, y: 10, toJSON: () => {} }
        : { top: 50, left: 80, width: 100, height: 50, right: 180, bottom: 100, x: 80, y: 50, toJSON: () => {} };
    });

    (result.current.ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
    result.current.trigger();
    if (rafCallback) rafCallback(0);
    expect(animateSpy).toHaveBeenCalledTimes(1);
    expect(animateSpy).toHaveBeenCalledWith(
      [
        { transform: "translate(-60px, -40px) scale(1, 1)" },
        { transform: "translate(0, 0) scale(1, 1)" },
      ],
      { duration: 300, easing: "ease-in-out" },
    );
  });

  it("does not animate when position is unchanged", () => {
    const { result } = renderHook(() => useMorph<HTMLDivElement>());
    const el = document.createElement("div");
    const animateSpy = vi.fn();
    el.animate = animateSpy;

    vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
      top: 10, left: 20, width: 100, height: 50,
      right: 120, bottom: 60, x: 20, y: 10, toJSON: () => {},
    });

    (result.current.ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
    result.current.trigger();
    if (rafCallback) rafCallback(0);
    expect(animateSpy).not.toHaveBeenCalled();
  });

  it("trigger returns a stable function reference", () => {
    const { result, rerender } = renderHook(() => useMorph<HTMLDivElement>());
    const trigger1 = result.current.trigger;
    rerender();
    expect(result.current.trigger).toBe(trigger1);
  });
});

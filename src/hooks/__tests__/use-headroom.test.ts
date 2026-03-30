import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useHeadroom } from "../use-headroom";

describe("useHeadroom", () => {
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

  it("returns true initially (pinned)", () => {
    const { result } = renderHook(() => useHeadroom());
    expect(result.current).toBe(true);
  });

  it("returns false when scrolling down past fixedAt", () => {
    const { result } = renderHook(() => useHeadroom({ fixedAt: 50 }));

    // Scroll down
    act(() => {
      scrollY = 100;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(false);
  });

  it("returns true when scrolling up", () => {
    const { result } = renderHook(() => useHeadroom());

    // First scroll down
    act(() => {
      scrollY = 200;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(false);

    // Then scroll up
    act(() => {
      scrollY = 150;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(true);
  });

  it("returns true when at top (scroll <= fixedAt)", () => {
    const { result } = renderHook(() => useHeadroom({ fixedAt: 100 }));

    // Scroll down past fixedAt
    act(() => {
      scrollY = 200;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(false);

    // Scroll back to top (within fixedAt)
    act(() => {
      scrollY = 50;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(true);
  });

  it("defaults fixedAt to 0", () => {
    const { result } = renderHook(() => useHeadroom());

    // Any scroll down hides
    act(() => {
      scrollY = 10;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(false);
  });

  it("stays pinned when scrolling within fixedAt", () => {
    const { result } = renderHook(() => useHeadroom({ fixedAt: 100 }));

    act(() => {
      scrollY = 50;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(true);
  });

  it("cleans up scroll listener on unmount", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useHeadroom());

    expect(addSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      { passive: true },
    );

    unmount();

    expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
  });
});

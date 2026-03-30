import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useOrientation } from "../use-orientation";

describe("useOrientation", () => {
  let orientationListeners: ((e: Event) => void)[];

  beforeEach(() => {
    orientationListeners = [];

    // Mock screen.orientation
    Object.defineProperty(window.screen, "orientation", {
      value: {
        angle: 0,
        type: "portrait-primary",
        addEventListener: vi.fn((_, handler) => {
          orientationListeners.push(handler);
        }),
        removeEventListener: vi.fn((_, handler) => {
          const idx = orientationListeners.indexOf(handler);
          if (idx >= 0) orientationListeners.splice(idx, 1);
        }),
      },
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns current orientation", () => {
    const { result } = renderHook(() => useOrientation());

    expect(result.current.angle).toBe(0);
    expect(result.current.type).toBe("portrait-primary");
  });

  it("updates when orientation changes", () => {
    const { result } = renderHook(() => useOrientation());

    // Simulate orientation change
    Object.defineProperty(window.screen, "orientation", {
      value: {
        angle: 90,
        type: "landscape-primary",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
      configurable: true,
      writable: true,
    });

    act(() => {
      orientationListeners.forEach((handler) => handler(new Event("change")));
    });

    expect(result.current.angle).toBe(90);
    expect(result.current.type).toBe("landscape-primary");
  });

  it("cleans up event listener on unmount", () => {
    const { unmount } = renderHook(() => useOrientation());

    unmount();

    expect(
      window.screen.orientation.removeEventListener,
    ).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("returns default values when screen.orientation is unavailable", () => {
    // Remove screen.orientation
    Object.defineProperty(window.screen, "orientation", {
      value: undefined,
      configurable: true,
      writable: true,
    });

    const { result } = renderHook(() => useOrientation());

    expect(result.current.angle).toBe(0);
    expect(result.current.type).toBe("landscape-primary");
  });
});

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { useDocumentVisibility } from "../use-document-visibility";

describe("useDocumentVisibility", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns initial visibility state", () => {
    const { result } = renderHook(() => useDocumentVisibility());
    // jsdom defaults to "visible"
    expect(result.current).toBe("visible");
  });

  it("updates when visibility changes to hidden", () => {
    const { result } = renderHook(() => useDocumentVisibility());

    act(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "hidden",
        writable: true,
        configurable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(result.current).toBe("hidden");
  });

  it("updates when visibility changes back to visible", () => {
    const { result } = renderHook(() => useDocumentVisibility());

    act(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "hidden",
        writable: true,
        configurable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(result.current).toBe("hidden");

    act(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "visible",
        writable: true,
        configurable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(result.current).toBe("visible");
  });

  it("cleans up the event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

    const { unmount } = renderHook(() => useDocumentVisibility());
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function),
    );
  });
});

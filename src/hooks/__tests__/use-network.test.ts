import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { useNetwork } from "../use-network";

describe("useNetwork", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    // Restore navigator.onLine
    Object.defineProperty(navigator, "onLine", {
      value: true,
      writable: true,
      configurable: true,
    });
  });

  it("returns online: true by default", () => {
    const { result } = renderHook(() => useNetwork());
    expect(result.current.online).toBe(true);
  });

  it("updates to offline when offline event fires", () => {
    const { result } = renderHook(() => useNetwork());

    act(() => {
      Object.defineProperty(navigator, "onLine", {
        value: false,
        writable: true,
        configurable: true,
      });
      window.dispatchEvent(new Event("offline"));
    });

    expect(result.current.online).toBe(false);
  });

  it("updates back to online when online event fires", () => {
    Object.defineProperty(navigator, "onLine", {
      value: false,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useNetwork());
    expect(result.current.online).toBe(false);

    act(() => {
      Object.defineProperty(navigator, "onLine", {
        value: true,
        writable: true,
        configurable: true,
      });
      window.dispatchEvent(new Event("online"));
    });

    expect(result.current.online).toBe(true);
  });

  it("cleans up event listeners on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useNetwork());
    unmount();

    const removedEvents = removeEventListenerSpy.mock.calls.map(
      (call) => call[0],
    );
    expect(removedEvents).toContain("online");
    expect(removedEvents).toContain("offline");
  });

  it("reads connection properties when available", () => {
    const connectionMock = {
      downlink: 10,
      effectiveType: "4g",
      rtt: 50,
      saveData: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    Object.defineProperty(navigator, "connection", {
      value: connectionMock,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useNetwork());

    expect(result.current.downlink).toBe(10);
    expect(result.current.effectiveType).toBe("4g");
    expect(result.current.rtt).toBe(50);
    expect(result.current.saveData).toBe(false);

    // Clean up
    Object.defineProperty(navigator, "connection", {
      value: undefined,
      writable: true,
      configurable: true,
    });
  });

  it("subscribes to connection change events when available", () => {
    const connectionMock = {
      downlink: 10,
      effectiveType: "4g",
      rtt: 50,
      saveData: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    Object.defineProperty(navigator, "connection", {
      value: connectionMock,
      writable: true,
      configurable: true,
    });

    const { unmount } = renderHook(() => useNetwork());

    expect(connectionMock.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );

    unmount();

    expect(connectionMock.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );

    // Clean up
    Object.defineProperty(navigator, "connection", {
      value: undefined,
      writable: true,
      configurable: true,
    });
  });

  it("returns online true when connection info is unavailable", () => {
    const { result } = renderHook(() => useNetwork());

    expect(result.current.online).toBe(true);
    expect(result.current.downlink).toBeUndefined();
    expect(result.current.effectiveType).toBeUndefined();
    expect(result.current.rtt).toBeUndefined();
    expect(result.current.saveData).toBeUndefined();
  });
});

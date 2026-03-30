import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useResizeObserver } from "../use-resize-observer";
import { createRef } from "react";

describe("useResizeObserver", () => {
  let observeMock: ReturnType<typeof vi.fn>;
  let disconnectMock: ReturnType<typeof vi.fn>;
  let callbackRef: ((entries: unknown[]) => void) | null = null;

  beforeEach(() => {
    observeMock = vi.fn();
    disconnectMock = vi.fn();
    callbackRef = null;

    class MockResizeObserver {
      constructor(cb: (entries: unknown[]) => void) {
        callbackRef = cb;
      }
      observe = observeMock;
      disconnect = disconnectMock;
      unobserve = vi.fn();
    }

    vi.stubGlobal("ResizeObserver", MockResizeObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns initial size of { width: 0, height: 0 }", () => {
    const ref = createRef<HTMLDivElement>();
    const { result } = renderHook(() => useResizeObserver(ref));
    expect(result.current).toEqual({ width: 0, height: 0 });
  });

  it("observes the element when ref is set", () => {
    const el = document.createElement("div");
    const ref = { current: el };

    renderHook(() => useResizeObserver(ref));

    expect(observeMock).toHaveBeenCalledWith(el);
  });

  it("updates size when ResizeObserver fires", () => {
    const el = document.createElement("div");
    const ref = { current: el };

    const { result } = renderHook(() => useResizeObserver(ref));

    act(() => {
      callbackRef?.([{ contentRect: { width: 200, height: 100 } }]);
    });

    expect(result.current).toEqual({ width: 200, height: 100 });
  });

  it("disconnects the observer on unmount", () => {
    const el = document.createElement("div");
    const ref = { current: el };

    const { unmount } = renderHook(() => useResizeObserver(ref));
    unmount();

    expect(disconnectMock).toHaveBeenCalled();
  });

  it("does not crash when ref.current is null", () => {
    const ref = createRef<HTMLDivElement>();
    const { result } = renderHook(() => useResizeObserver(ref));
    expect(result.current).toEqual({ width: 0, height: 0 });
  });

  it("handles missing ResizeObserver (SSR)", () => {
    vi.stubGlobal("ResizeObserver", undefined);

    const el = document.createElement("div");
    const ref = { current: el };

    const { result } = renderHook(() => useResizeObserver(ref));
    expect(result.current).toEqual({ width: 0, height: 0 });
  });
});

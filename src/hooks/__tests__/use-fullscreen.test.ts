import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useFullscreen } from "../use-fullscreen";

describe("useFullscreen", () => {
  let requestFullscreenMock: ReturnType<typeof vi.fn>;
  let exitFullscreenMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    requestFullscreenMock = vi.fn().mockResolvedValue(undefined);
    exitFullscreenMock = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(document, "fullscreenEnabled", {
      value: true,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(document, "fullscreenElement", {
      value: null,
      writable: true,
      configurable: true,
    });
    document.exitFullscreen = exitFullscreenMock as typeof document.exitFullscreen;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns initial state with isFullscreen false", () => {
    const el = document.createElement("div");
    const ref = { current: el };

    const { result } = renderHook(() => useFullscreen(ref));

    expect(result.current.isFullscreen).toBe(false);
    expect(typeof result.current.enter).toBe("function");
    expect(typeof result.current.exit).toBe("function");
    expect(typeof result.current.toggle).toBe("function");
  });

  it("updates isFullscreen when fullscreenchange fires", () => {
    const el = document.createElement("div");
    const ref = { current: el };

    const { result } = renderHook(() => useFullscreen(ref));

    act(() => {
      Object.defineProperty(document, "fullscreenElement", {
        value: el,
        writable: true,
        configurable: true,
      });
      document.dispatchEvent(new Event("fullscreenchange"));
    });

    expect(result.current.isFullscreen).toBe(true);

    act(() => {
      Object.defineProperty(document, "fullscreenElement", {
        value: null,
        writable: true,
        configurable: true,
      });
      document.dispatchEvent(new Event("fullscreenchange"));
    });

    expect(result.current.isFullscreen).toBe(false);
  });

  it("calls requestFullscreen on enter", async () => {
    const el = document.createElement("div");
    el.requestFullscreen = requestFullscreenMock as typeof el.requestFullscreen;
    const ref = { current: el };

    const { result } = renderHook(() => useFullscreen(ref));

    await act(async () => {
      await result.current.enter();
    });

    expect(requestFullscreenMock).toHaveBeenCalled();
  });

  it("calls exitFullscreen on exit when in fullscreen", async () => {
    const el = document.createElement("div");
    el.requestFullscreen = requestFullscreenMock as typeof el.requestFullscreen;
    const ref = { current: el };

    Object.defineProperty(document, "fullscreenElement", {
      value: el,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useFullscreen(ref));

    await act(async () => {
      await result.current.exit();
    });

    expect(exitFullscreenMock).toHaveBeenCalled();
  });

  it("toggle enters fullscreen when not in fullscreen", async () => {
    const el = document.createElement("div");
    el.requestFullscreen = requestFullscreenMock as typeof el.requestFullscreen;
    const ref = { current: el };

    const { result } = renderHook(() => useFullscreen(ref));

    await act(async () => {
      await result.current.toggle();
    });

    expect(requestFullscreenMock).toHaveBeenCalled();
  });

  it("toggle exits fullscreen when in fullscreen", async () => {
    const el = document.createElement("div");
    el.requestFullscreen = requestFullscreenMock as typeof el.requestFullscreen;
    const ref = { current: el };

    Object.defineProperty(document, "fullscreenElement", {
      value: el,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useFullscreen(ref));

    await act(async () => {
      await result.current.toggle();
    });

    expect(exitFullscreenMock).toHaveBeenCalled();
  });

  it("cleans up event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");
    const el = document.createElement("div");
    const ref = { current: el };

    const { unmount } = renderHook(() => useFullscreen(ref));
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "fullscreenchange",
      expect.any(Function),
    );
  });

  it("returns stable function references across re-renders", () => {
    const el = document.createElement("div");
    const ref = { current: el };

    const { result, rerender } = renderHook(() => useFullscreen(ref));

    const { enter, exit, toggle } = result.current;
    rerender();

    expect(result.current.enter).toBe(enter);
    expect(result.current.exit).toBe(exit);
    expect(result.current.toggle).toBe(toggle);
  });
});

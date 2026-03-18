import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { useAsync } from "../use-async";
import { useDebounce } from "../use-debounce";
import { useWindowScroll } from "../use-window-scroll";
import { useUpdateEffect } from "../use-update-effect";
import { useClipboard } from "../use-clipboard";
import { useDisclosure } from "../use-disclosure";
import { useToggle } from "../use-toggle";
import { useScrollLock } from "../use-scroll-lock";
import { useBreakpoint } from "../use-breakpoint";
import { useIsomorphicId } from "../use-isomorphic-id";

// ---------------------------------------------------------------------------
// useDebounce
// ---------------------------------------------------------------------------
describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));
    expect(result.current).toBe("hello");
  });

  it("does not update the value before the delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 500 } },
    );

    rerender({ value: "b", delay: 500 });
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current).toBe("a");
  });

  it("updates the value after the delay has elapsed", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 300 } },
    );

    rerender({ value: "b", delay: 300 });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("b");
  });

  it("resets the timer when value changes rapidly", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "b" });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Change again before the first timer fires
    rerender({ value: "c" });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // "b" should have been skipped
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe("c");
  });

  it("uses default delay of 300ms", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: "start" } },
    );

    rerender({ value: "end" });
    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe("start");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("end");
  });
});

// ---------------------------------------------------------------------------
// useClipboard
// ---------------------------------------------------------------------------
describe("useClipboard", () => {
  const writeTextMock = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.useFakeTimers();
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    });
    writeTextMock.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts with copied = false", () => {
    const { result } = renderHook(() => useClipboard());
    expect(result.current.copied).toBe(false);
  });

  it("sets copied to true after a successful copy", async () => {
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy("test text");
    });

    expect(writeTextMock).toHaveBeenCalledWith("test text");
    expect(result.current.copied).toBe(true);
  });

  it("resets copied to false after the timeout", async () => {
    const { result } = renderHook(() => useClipboard(1000));

    await act(async () => {
      await result.current.copy("text");
    });
    expect(result.current.copied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.copied).toBe(false);
  });

  it("allows manual reset of copied state", async () => {
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy("text");
    });
    expect(result.current.copied).toBe(true);

    act(() => {
      result.current.reset();
    });
    expect(result.current.copied).toBe(false);
  });

  it("handles clipboard write failure gracefully", async () => {
    writeTextMock.mockRejectedValueOnce(new Error("Denied"));
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy("text");
    });

    expect(result.current.copied).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(
      "[spark-ui] useClipboard: Failed to copy to clipboard",
    );

    warnSpy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// useDisclosure
// ---------------------------------------------------------------------------
describe("useDisclosure", () => {
  it("defaults to closed", () => {
    const { result } = renderHook(() => useDisclosure());
    expect(result.current.isOpen).toBe(false);
  });

  it("respects defaultIsOpen = true", () => {
    const { result } = renderHook(() => useDisclosure(true));
    expect(result.current.isOpen).toBe(true);
  });

  it("opens when open() is called", () => {
    const { result } = renderHook(() => useDisclosure());

    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it("closes when close() is called", () => {
    const { result } = renderHook(() => useDisclosure(true));

    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it("toggles between open and closed", () => {
    const { result } = renderHook(() => useDisclosure());

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it("allows direct setIsOpen control", () => {
    const { result } = renderHook(() => useDisclosure());

    act(() => {
      result.current.setIsOpen(true);
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.setIsOpen(false);
    });
    expect(result.current.isOpen).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// useToggle
// ---------------------------------------------------------------------------
describe("useToggle", () => {
  it("defaults to false", () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current[0]).toBe(false);
  });

  it("respects custom initial value", () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current[0]).toBe(true);
  });

  it("toggles the value", () => {
    const { result } = renderHook(() => useToggle());

    act(() => {
      result.current[1](); // toggle
    });
    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1](); // toggle
    });
    expect(result.current[0]).toBe(false);
  });

  it("allows setting value directly with setValue", () => {
    const { result } = renderHook(() => useToggle());

    act(() => {
      result.current[2](true); // setValue
    });
    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[2](false); // setValue
    });
    expect(result.current[0]).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// useScrollLock
// ---------------------------------------------------------------------------
describe("useScrollLock", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
  });

  it("does nothing when locked is false", () => {
    renderHook(() => useScrollLock(false));
    expect(document.body.style.overflow).toBe("");
  });

  it("sets body overflow to hidden when locked is true", () => {
    renderHook(() => useScrollLock(true));
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores original overflow on unmount", () => {
    document.body.style.overflow = "auto";
    const { unmount } = renderHook(() => useScrollLock(true));

    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).toBe("auto");
  });

  it("restores overflow when locked changes from true to false", () => {
    document.body.style.overflow = "scroll";
    const { rerender } = renderHook(
      ({ locked }) => useScrollLock(locked),
      { initialProps: { locked: true } },
    );

    expect(document.body.style.overflow).toBe("hidden");

    rerender({ locked: false });
    expect(document.body.style.overflow).toBe("scroll");
  });
});

// ---------------------------------------------------------------------------
// useBreakpoint
// ---------------------------------------------------------------------------
describe("useBreakpoint", () => {
  let listeners: Array<(e: { matches: boolean }) => void>;
  let mockMatches: boolean;

  beforeEach(() => {
    listeners = [];
    mockMatches = false;

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: mockMatches,
        media: query,
        addEventListener: vi.fn(
          (_event: string, handler: (e: { matches: boolean }) => void) => {
            listeners.push(handler);
          },
        ),
        removeEventListener: vi.fn(),
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("returns false when viewport is below the breakpoint", () => {
    mockMatches = false;
    const { result } = renderHook(() => useBreakpoint("lg"));
    expect(result.current).toBe(false);
  });

  it("returns true when viewport matches the breakpoint", () => {
    mockMatches = true;
    const { result } = renderHook(() => useBreakpoint("lg"));
    expect(result.current).toBe(true);
  });

  it("passes the correct media query for each breakpoint", () => {
    const cases: Array<[Parameters<typeof useBreakpoint>[0], string]> = [
      ["sm", "(min-width: 640px)"],
      ["md", "(min-width: 768px)"],
      ["lg", "(min-width: 1024px)"],
      ["xl", "(min-width: 1280px)"],
      ["2xl", "(min-width: 1536px)"],
    ];

    for (const [bp, expectedQuery] of cases) {
      renderHook(() => useBreakpoint(bp));
      expect(window.matchMedia).toHaveBeenCalledWith(expectedQuery);
    }
  });

  it("reacts to media query changes", () => {
    mockMatches = false;
    const { result } = renderHook(() => useBreakpoint("md"));

    expect(result.current).toBe(false);

    // Simulate a change event from the MediaQueryList
    act(() => {
      for (const listener of listeners) {
        listener({ matches: true });
      }
    });

    expect(result.current).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// useIsomorphicId
// ---------------------------------------------------------------------------
describe("useIsomorphicId", () => {
  it("returns a string", () => {
    const { result } = renderHook(() => useIsomorphicId());
    expect(typeof result.current).toBe("string");
    expect(result.current.length).toBeGreaterThan(0);
  });

  it("returns a string with the given prefix", () => {
    const { result } = renderHook(() => useIsomorphicId("dialog"));
    expect(result.current).toMatch(/^dialog-/);
  });

  it("returns a stable id across re-renders", () => {
    const { result, rerender } = renderHook(() => useIsomorphicId("field"));

    const firstId = result.current;
    rerender();

    expect(result.current).toBe(firstId);
  });

  it("returns unique ids for different hook instances", () => {
    const { result: result1 } = renderHook(() => useIsomorphicId("a"));
    const { result: result2 } = renderHook(() => useIsomorphicId("b"));

    expect(result1.current).not.toBe(result2.current);
  });
});

// ---------------------------------------------------------------------------
// useAsync
// ---------------------------------------------------------------------------
describe("useAsync", () => {
  it("starts in idle state", () => {
    const fn = vi.fn().mockResolvedValue("data");
    const { result } = renderHook(() => useAsync(fn));

    expect(result.current.status).toBe("idle");
    expect(result.current.isIdle).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("transitions to loading then success", async () => {
    const fn = vi.fn().mockResolvedValue("hello");
    const { result } = renderHook(() => useAsync(fn));

    let promise: Promise<unknown>;
    act(() => {
      promise = result.current.execute();
    });

    // Should be loading
    expect(result.current.status).toBe("loading");
    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await promise!;
    });

    expect(result.current.status).toBe("success");
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe("hello");
    expect(result.current.error).toBeNull();
  });

  it("transitions to loading then error", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("fail"));
    const { result } = renderHook(() => useAsync(fn));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.status).toBe("error");
    expect(result.current.isError).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error?.message).toBe("fail");
  });

  it("wraps non-Error thrown values in Error", async () => {
    const fn = vi.fn().mockRejectedValue("string error");
    const { result } = renderHook(() => useAsync(fn));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("string error");
  });

  it("passes arguments to the async function", async () => {
    const fn = vi.fn().mockImplementation((x: number, y: number) =>
      Promise.resolve(x + y),
    );
    const { result } = renderHook(() => useAsync(fn));

    await act(async () => {
      await result.current.execute(3, 4);
    });

    expect(fn).toHaveBeenCalledWith(3, 4);
    expect(result.current.data).toBe(7);
  });

  it("returns the resolved value from execute", async () => {
    const fn = vi.fn().mockResolvedValue(42);
    const { result } = renderHook(() => useAsync(fn));

    let returnValue: unknown;
    await act(async () => {
      returnValue = await result.current.execute();
    });

    expect(returnValue).toBe(42);
  });

  it("returns null from execute on error", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("nope"));
    const { result } = renderHook(() => useAsync(fn));

    let returnValue: unknown;
    await act(async () => {
      returnValue = await result.current.execute();
    });

    expect(returnValue).toBeNull();
  });

  it("resets state back to idle", async () => {
    const fn = vi.fn().mockResolvedValue("data");
    const { result } = renderHook(() => useAsync(fn));

    await act(async () => {
      await result.current.execute();
    });
    expect(result.current.isSuccess).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe("idle");
    expect(result.current.isIdle).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("ignores stale responses when execute is called multiple times", async () => {
    let resolvers: Array<(v: string) => void> = [];
    const fn = vi.fn().mockImplementation(
      () =>
        new Promise<string>((resolve) => {
          resolvers.push(resolve);
        }),
    );
    const { result } = renderHook(() => useAsync(fn));

    // Fire two calls
    act(() => {
      result.current.execute();
    });
    act(() => {
      result.current.execute();
    });

    // Resolve the first (stale) call
    await act(async () => {
      resolvers[0]("stale");
    });

    // Should still be loading (waiting for second call)
    expect(result.current.isLoading).toBe(true);

    // Resolve the second (latest) call
    await act(async () => {
      resolvers[1]("latest");
    });

    expect(result.current.data).toBe("latest");
    expect(result.current.isSuccess).toBe(true);
  });

  it("can be re-executed after an error", async () => {
    let callCount = 0;
    const fn = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) return Promise.reject(new Error("first fails"));
      return Promise.resolve("second succeeds");
    });

    const { result } = renderHook(() => useAsync(fn));

    await act(async () => {
      await result.current.execute();
    });
    expect(result.current.isError).toBe(true);

    await act(async () => {
      await result.current.execute();
    });
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toBe("second succeeds");
  });
});

// ---------------------------------------------------------------------------
// useWindowScroll
// ---------------------------------------------------------------------------
describe("useWindowScroll", () => {
  let scrollHandlers: Array<() => void>;

  beforeEach(() => {
    scrollHandlers = [];
    vi.spyOn(window, "addEventListener").mockImplementation(
      (event: string, handler: unknown) => {
        if (event === "scroll") scrollHandlers.push(handler as () => void);
      },
    );
    vi.spyOn(window, "removeEventListener").mockImplementation(() => {});
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});

    Object.defineProperty(window, "scrollX", { value: 0, writable: true, configurable: true });
    Object.defineProperty(window, "scrollY", { value: 0, writable: true, configurable: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns initial scroll position", () => {
    const { result } = renderHook(() => useWindowScroll());
    expect(result.current.x).toBe(0);
    expect(result.current.y).toBe(0);
  });

  it("updates position on scroll event", () => {
    const { result } = renderHook(() => useWindowScroll());

    Object.defineProperty(window, "scrollX", { value: 100, writable: true, configurable: true });
    Object.defineProperty(window, "scrollY", { value: 250, writable: true, configurable: true });

    act(() => {
      scrollHandlers.forEach((h) => h());
    });

    expect(result.current.x).toBe(100);
    expect(result.current.y).toBe(250);
  });

  it("scrollToTop calls window.scrollTo with top: 0", () => {
    const { result } = renderHook(() => useWindowScroll());

    act(() => {
      result.current.scrollToTop();
    });

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  });

  it("scrollToTop accepts behavior argument", () => {
    const { result } = renderHook(() => useWindowScroll());

    act(() => {
      result.current.scrollToTop("instant");
    });

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  });

  it("scrollToBottom calls window.scrollTo with scrollHeight", () => {
    const { result } = renderHook(() => useWindowScroll());

    act(() => {
      result.current.scrollToBottom();
    });

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: document.documentElement.scrollHeight,
      left: 0,
      behavior: "smooth",
    });
  });

  it("scrollTo passes options through to window.scrollTo", () => {
    const { result } = renderHook(() => useWindowScroll());

    act(() => {
      result.current.scrollTo({ top: 500, behavior: "instant" });
    });

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 500,
      behavior: "instant",
    });
  });

  it("provides stable function references across re-renders", () => {
    const { result, rerender } = renderHook(() => useWindowScroll());

    const firstScrollTo = result.current.scrollTo;
    const firstScrollToTop = result.current.scrollToTop;
    const firstScrollToBottom = result.current.scrollToBottom;

    rerender();

    expect(result.current.scrollTo).toBe(firstScrollTo);
    expect(result.current.scrollToTop).toBe(firstScrollToTop);
    expect(result.current.scrollToBottom).toBe(firstScrollToBottom);
  });
});

// ---------------------------------------------------------------------------
// useUpdateEffect
// ---------------------------------------------------------------------------
describe("useUpdateEffect", () => {
  it("does NOT fire the effect on initial mount", () => {
    const effect = vi.fn();
    renderHook(() => useUpdateEffect(effect, [1]));
    expect(effect).not.toHaveBeenCalled();
  });

  it("fires the effect when deps change after mount", () => {
    const effect = vi.fn();
    const { rerender } = renderHook(
      ({ dep }) => useUpdateEffect(effect, [dep]),
      { initialProps: { dep: 1 } },
    );

    expect(effect).not.toHaveBeenCalled();

    rerender({ dep: 2 });
    expect(effect).toHaveBeenCalledTimes(1);
  });

  it("fires on every subsequent dep change", () => {
    const effect = vi.fn();
    const { rerender } = renderHook(
      ({ dep }) => useUpdateEffect(effect, [dep]),
      { initialProps: { dep: "a" } },
    );

    rerender({ dep: "b" });
    rerender({ dep: "c" });

    expect(effect).toHaveBeenCalledTimes(2);
  });

  it("does not fire when deps stay the same", () => {
    const effect = vi.fn();
    const { rerender } = renderHook(
      ({ dep }) => useUpdateEffect(effect, [dep]),
      { initialProps: { dep: 42 } },
    );

    rerender({ dep: 42 });
    rerender({ dep: 42 });

    expect(effect).not.toHaveBeenCalled();
  });

  it("calls the cleanup function on re-run", () => {
    const cleanup = vi.fn();
    const effect = vi.fn().mockReturnValue(cleanup);
    const { rerender } = renderHook(
      ({ dep }) => useUpdateEffect(effect, [dep]),
      { initialProps: { dep: 1 } },
    );

    rerender({ dep: 2 }); // first real run
    expect(cleanup).not.toHaveBeenCalled();

    rerender({ dep: 3 }); // second run → cleanup of first
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it("calls cleanup on unmount", () => {
    const cleanup = vi.fn();
    const effect = vi.fn().mockReturnValue(cleanup);
    const { rerender, unmount } = renderHook(
      ({ dep }) => useUpdateEffect(effect, [dep]),
      { initialProps: { dep: 1 } },
    );

    rerender({ dep: 2 }); // trigger effect
    unmount();

    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});

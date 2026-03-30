import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { useAsync } from "../use-async";
import { useDebounce } from "../use-debounce";
import { useWindowScroll } from "../use-window-scroll";
import { useUpdateEffect } from "../use-update-effect";
import { useOnClickOutside } from "../use-on-click-outside";
import { useClipboard } from "../use-clipboard";
import { useDisclosure } from "../use-disclosure";
import { useToggle } from "../use-toggle";
import { useScrollLock } from "../use-scroll-lock";
import { useBreakpoint } from "../use-breakpoint";
import { useIsomorphicId } from "../use-isomorphic-id";
import { useDisplay } from "../use-display";
import { useRtl } from "../use-rtl";
import { useDate } from "../use-date";
import { useHotkey } from "../use-hotkey";
import { useRipple } from "../use-ripple";
import { useTouch } from "../use-touch";
import { useMutationObserver } from "../use-mutation-observer";
import { useGoTo } from "../use-go-to";

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

// ---------------------------------------------------------------------------
// useOnClickOutside
// ---------------------------------------------------------------------------
describe("useOnClickOutside", () => {
  it("calls handler when clicking outside the ref", () => {
    const handler = vi.fn();
    const ref = { current: document.createElement("div") };
    document.body.appendChild(ref.current);

    renderHook(() => useOnClickOutside(ref, handler));

    act(() => {
      document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });

    expect(handler).toHaveBeenCalledTimes(1);
    document.body.removeChild(ref.current);
  });

  it("does not call handler when clicking inside the ref", () => {
    const handler = vi.fn();
    const el = document.createElement("div");
    document.body.appendChild(el);
    const ref = { current: el };

    renderHook(() => useOnClickOutside(ref, handler));

    act(() => {
      el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });

    expect(handler).not.toHaveBeenCalled();
    document.body.removeChild(el);
  });

  it("supports multiple refs", () => {
    const handler = vi.fn();
    const el1 = document.createElement("div");
    const el2 = document.createElement("div");
    document.body.appendChild(el1);
    document.body.appendChild(el2);
    const ref1 = { current: el1 };
    const ref2 = { current: el2 };

    renderHook(() => useOnClickOutside([ref1, ref2], handler));

    // Click inside ref2 — should NOT trigger
    act(() => {
      el2.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });
    expect(handler).not.toHaveBeenCalled();

    // Click outside both — should trigger
    act(() => {
      document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });
    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(el1);
    document.body.removeChild(el2);
  });

  it("does not call handler when enabled is false", () => {
    const handler = vi.fn();
    const ref = { current: document.createElement("div") };
    document.body.appendChild(ref.current);

    renderHook(() => useOnClickOutside(ref, handler, false));

    act(() => {
      document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });

    expect(handler).not.toHaveBeenCalled();
    document.body.removeChild(ref.current);
  });

  it("cleans up listeners on unmount", () => {
    const handler = vi.fn();
    const ref = { current: document.createElement("div") };
    document.body.appendChild(ref.current);

    const { unmount } = renderHook(() => useOnClickOutside(ref, handler));
    unmount();

    act(() => {
      document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });

    expect(handler).not.toHaveBeenCalled();
    document.body.removeChild(ref.current);
  });

  it("responds to touchstart events", () => {
    const handler = vi.fn();
    const ref = { current: document.createElement("div") };
    document.body.appendChild(ref.current);

    renderHook(() => useOnClickOutside(ref, handler));

    act(() => {
      document.dispatchEvent(new Event("touchstart", { bubbles: true }));
    });

    expect(handler).toHaveBeenCalledTimes(1);
    document.body.removeChild(ref.current);
  });
});

// ---------------------------------------------------------------------------
// useDisplay
// ---------------------------------------------------------------------------
describe("useDisplay", () => {
  let mediaQueryListeners: Map<string, Array<(e: { matches: boolean }) => void>>;
  let mediaQueryMatches: Map<string, boolean>;
  let resizeHandlers: Array<() => void>;

  beforeEach(() => {
    mediaQueryListeners = new Map();
    mediaQueryMatches = new Map();
    resizeHandlers = [];

    Object.defineProperty(window, "innerWidth", {
      value: 1024,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: 768,
      writable: true,
      configurable: true,
    });

    // Default: md breakpoint (768 matches, 1024 does not)
    mediaQueryMatches.set("(min-width: 640px)", true);
    mediaQueryMatches.set("(min-width: 768px)", true);
    mediaQueryMatches.set("(min-width: 1024px)", true);
    mediaQueryMatches.set("(min-width: 1280px)", false);
    mediaQueryMatches.set("(min-width: 1536px)", false);

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => {
        if (!mediaQueryListeners.has(query)) {
          mediaQueryListeners.set(query, []);
        }
        return {
          matches: mediaQueryMatches.get(query) ?? false,
          media: query,
          addEventListener: vi.fn((_: string, handler: (e: { matches: boolean }) => void) => {
            mediaQueryListeners.get(query)!.push(handler);
          }),
          removeEventListener: vi.fn(),
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        };
      }),
    });

    const originalAddEventListener = window.addEventListener.bind(window);
    vi.spyOn(window, "addEventListener").mockImplementation(
      (event: string, handler: unknown, ...rest: unknown[]) => {
        if (event === "resize") {
          resizeHandlers.push(handler as () => void);
        }
        return originalAddEventListener(event, handler as EventListenerOrEventListenerObject, ...(rest as [boolean | AddEventListenerOptions | undefined]));
      },
    );
    vi.spyOn(window, "removeEventListener").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns breakpoint, dimensions, and platform info", () => {
    const { result } = renderHook(() => useDisplay());

    expect(result.current.breakpoint).toBe("lg");
    expect(result.current.width).toBe(1024);
    expect(result.current.height).toBe(768);
    expect(result.current.mobile).toBe(false);
    expect(result.current.platform).toEqual(
      expect.objectContaining({
        touch: expect.any(Boolean),
        ios: expect.any(Boolean),
        android: expect.any(Boolean),
      }),
    );
  });

  it("reports mobile=true for xs breakpoint", () => {
    // All breakpoints below sm
    mediaQueryMatches.set("(min-width: 640px)", false);
    mediaQueryMatches.set("(min-width: 768px)", false);
    mediaQueryMatches.set("(min-width: 1024px)", false);
    mediaQueryMatches.set("(min-width: 1280px)", false);
    mediaQueryMatches.set("(min-width: 1536px)", false);

    Object.defineProperty(window, "innerWidth", { value: 320, configurable: true });

    const { result } = renderHook(() => useDisplay());
    expect(result.current.breakpoint).toBe("xs");
    expect(result.current.mobile).toBe(true);
  });

  it("reports mobile=true for sm breakpoint", () => {
    mediaQueryMatches.set("(min-width: 640px)", true);
    mediaQueryMatches.set("(min-width: 768px)", false);
    mediaQueryMatches.set("(min-width: 1024px)", false);
    mediaQueryMatches.set("(min-width: 1280px)", false);
    mediaQueryMatches.set("(min-width: 1536px)", false);

    Object.defineProperty(window, "innerWidth", { value: 640, configurable: true });

    const { result } = renderHook(() => useDisplay());
    expect(result.current.breakpoint).toBe("sm");
    expect(result.current.mobile).toBe(true);
  });

  it("reports mobile=false for md and above", () => {
    const { result } = renderHook(() => useDisplay());
    expect(result.current.breakpoint).toBe("lg");
    expect(result.current.mobile).toBe(false);
  });

  it("detects 2xl breakpoint", () => {
    mediaQueryMatches.set("(min-width: 640px)", true);
    mediaQueryMatches.set("(min-width: 768px)", true);
    mediaQueryMatches.set("(min-width: 1024px)", true);
    mediaQueryMatches.set("(min-width: 1280px)", true);
    mediaQueryMatches.set("(min-width: 1536px)", true);

    Object.defineProperty(window, "innerWidth", { value: 1920, configurable: true });

    const { result } = renderHook(() => useDisplay());
    expect(result.current.breakpoint).toBe("2xl");
  });

  it("updates dimensions on resize", () => {
    const { result } = renderHook(() => useDisplay());

    Object.defineProperty(window, "innerWidth", { value: 500, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 400, configurable: true });

    mediaQueryMatches.set("(min-width: 640px)", false);
    mediaQueryMatches.set("(min-width: 768px)", false);
    mediaQueryMatches.set("(min-width: 1024px)", false);

    act(() => {
      resizeHandlers.forEach((h) => h());
    });

    expect(result.current.width).toBe(500);
    expect(result.current.height).toBe(400);
  });

  it("returns stable platform reference across re-renders", () => {
    const { result, rerender } = renderHook(() => useDisplay());
    const first = result.current.platform;
    rerender();
    expect(result.current.platform).toBe(first);
  });
});

// ---------------------------------------------------------------------------
// useRtl
// ---------------------------------------------------------------------------
describe("useRtl", () => {
  let originalDir: string;

  beforeEach(() => {
    originalDir = document.documentElement.dir;
    document.documentElement.dir = "";
  });

  afterEach(() => {
    document.documentElement.dir = originalDir;
  });

  it("defaults to ltr when document.dir is empty", () => {
    const { result } = renderHook(() => useRtl());
    expect(result.current.isRtl).toBe(false);
    expect(result.current.dir).toBe("ltr");
  });

  it("reads initial rtl state from document", () => {
    document.documentElement.dir = "rtl";
    const { result } = renderHook(() => useRtl());
    expect(result.current.isRtl).toBe(true);
    expect(result.current.dir).toBe("rtl");
  });

  it("toggles from ltr to rtl", () => {
    const { result } = renderHook(() => useRtl());

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isRtl).toBe(true);
    expect(result.current.dir).toBe("rtl");
    expect(document.documentElement.dir).toBe("rtl");
  });

  it("toggles from rtl to ltr", () => {
    document.documentElement.dir = "rtl";
    const { result } = renderHook(() => useRtl());

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isRtl).toBe(false);
    expect(result.current.dir).toBe("ltr");
    expect(document.documentElement.dir).toBe("ltr");
  });

  it("toggles multiple times", () => {
    const { result } = renderHook(() => useRtl());

    act(() => {
      result.current.toggle();
    });
    expect(result.current.dir).toBe("rtl");

    act(() => {
      result.current.toggle();
    });
    expect(result.current.dir).toBe("ltr");

    act(() => {
      result.current.toggle();
    });
    expect(result.current.dir).toBe("rtl");
  });

  it("provides stable toggle reference across re-renders", () => {
    const { result, rerender } = renderHook(() => useRtl());
    const firstToggle = result.current.toggle;
    rerender();
    expect(result.current.toggle).toBe(firstToggle);
  });
});

// ---------------------------------------------------------------------------
// useDate
// ---------------------------------------------------------------------------
describe("useDate", () => {
  it("returns format, relative, isToday, and isSameDay functions", () => {
    const { result } = renderHook(() => useDate());
    expect(typeof result.current.format).toBe("function");
    expect(typeof result.current.relative).toBe("function");
    expect(typeof result.current.isToday).toBe("function");
    expect(typeof result.current.isSameDay).toBe("function");
  });

  describe("format", () => {
    it("formats YYYY-MM-DD", () => {
      const { result } = renderHook(() => useDate());
      const date = new Date(2024, 0, 15); // Jan 15 2024
      expect(result.current.format(date, "YYYY-MM-DD")).toBe("2024-01-15");
    });

    it("formats MM/DD/YYYY", () => {
      const { result } = renderHook(() => useDate());
      const date = new Date(2024, 11, 25); // Dec 25 2024
      expect(result.current.format(date, "MM/DD/YYYY")).toBe("12/25/2024");
    });

    it("formats HH:mm", () => {
      const { result } = renderHook(() => useDate());
      const date = new Date(2024, 0, 1, 14, 30);
      expect(result.current.format(date, "HH:mm")).toBe("14:30");
    });

    it("formats HH:mm:ss", () => {
      const { result } = renderHook(() => useDate());
      const date = new Date(2024, 0, 1, 9, 5, 3);
      expect(result.current.format(date, "HH:mm:ss")).toBe("09:05:03");
    });

    it("formats combined date and time", () => {
      const { result } = renderHook(() => useDate());
      const date = new Date(2024, 5, 1, 8, 30);
      expect(result.current.format(date, "YYYY-MM-DD HH:mm")).toBe("2024-06-01 08:30");
    });

    it("pads single-digit months and days", () => {
      const { result } = renderHook(() => useDate());
      const date = new Date(2024, 0, 5); // Jan 5
      expect(result.current.format(date, "MM-DD")).toBe("01-05");
    });
  });

  describe("relative", () => {
    it("returns 'just now' for recent dates", () => {
      const { result } = renderHook(() => useDate());
      const date = new Date(Date.now() - 10 * 1000); // 10 seconds ago
      expect(result.current.relative(date)).toBe("just now");
    });

    it("returns minutes ago", () => {
      const { result } = renderHook(() => useDate());
      const date = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
      expect(result.current.relative(date)).toBe("5 min ago");
    });

    it("returns hours ago (singular)", () => {
      const { result } = renderHook(() => useDate());
      const date = new Date(Date.now() - 1 * 60 * 60 * 1000);
      expect(result.current.relative(date)).toBe("1 hour ago");
    });

    it("returns hours ago (plural)", () => {
      const { result } = renderHook(() => useDate());
      const date = new Date(Date.now() - 3 * 60 * 60 * 1000);
      expect(result.current.relative(date)).toBe("3 hours ago");
    });

    it("returns 'yesterday' for 1 day ago", () => {
      const { result } = renderHook(() => useDate());
      const date = new Date(Date.now() - 24 * 60 * 60 * 1000);
      expect(result.current.relative(date)).toBe("yesterday");
    });

    it("returns days ago for multiple days", () => {
      const { result } = renderHook(() => useDate());
      const date = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
      expect(result.current.relative(date)).toBe("5 days ago");
    });

    it("returns formatted date for 30+ days ago", () => {
      const { result } = renderHook(() => useDate());
      const date = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
      // Should be a YYYY-MM-DD formatted string
      expect(result.current.relative(date)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("isToday", () => {
    it("returns true for today", () => {
      const { result } = renderHook(() => useDate());
      expect(result.current.isToday(new Date())).toBe(true);
    });

    it("returns false for yesterday", () => {
      const { result } = renderHook(() => useDate());
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(result.current.isToday(yesterday)).toBe(false);
    });
  });

  describe("isSameDay", () => {
    it("returns true for same day", () => {
      const { result } = renderHook(() => useDate());
      const a = new Date(2024, 0, 15, 10, 0);
      const b = new Date(2024, 0, 15, 22, 30);
      expect(result.current.isSameDay(a, b)).toBe(true);
    });

    it("returns false for different days", () => {
      const { result } = renderHook(() => useDate());
      const a = new Date(2024, 0, 15);
      const b = new Date(2024, 0, 16);
      expect(result.current.isSameDay(a, b)).toBe(false);
    });

    it("returns false for same day in different months", () => {
      const { result } = renderHook(() => useDate());
      const a = new Date(2024, 0, 15);
      const b = new Date(2024, 1, 15);
      expect(result.current.isSameDay(a, b)).toBe(false);
    });
  });

  it("returns stable references across re-renders", () => {
    const { result, rerender } = renderHook(() => useDate());
    const first = result.current;
    rerender();
    expect(result.current.format).toBe(first.format);
    expect(result.current.relative).toBe(first.relative);
    expect(result.current.isToday).toBe(first.isToday);
    expect(result.current.isSameDay).toBe(first.isSameDay);
  });
});

// ---------------------------------------------------------------------------
// useHotkey
// ---------------------------------------------------------------------------
describe("useHotkey", () => {
  it("calls callback when a simple key is pressed", () => {
    const handler = vi.fn();
    renderHook(() => useHotkey("escape", handler));

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Escape",
          bubbles: true,
        }),
      );
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("calls callback for ctrl+k combo", () => {
    const handler = vi.fn();
    renderHook(() => useHotkey("ctrl+k", handler));

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "k",
          ctrlKey: true,
          bubbles: true,
        }),
      );
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("calls callback for ctrl+shift+p combo", () => {
    const handler = vi.fn();
    renderHook(() => useHotkey("ctrl+shift+p", handler));

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "p",
          ctrlKey: true,
          shiftKey: true,
          bubbles: true,
        }),
      );
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("does not call callback when modifier is missing", () => {
    const handler = vi.fn();
    renderHook(() => useHotkey("ctrl+k", handler));

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "k",
          ctrlKey: false,
          bubbles: true,
        }),
      );
    });

    expect(handler).not.toHaveBeenCalled();
  });

  it("does not call callback when extra modifier is present", () => {
    const handler = vi.fn();
    renderHook(() => useHotkey("ctrl+k", handler));

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "k",
          ctrlKey: true,
          shiftKey: true,
          bubbles: true,
        }),
      );
    });

    expect(handler).not.toHaveBeenCalled();
  });

  it("does not call callback when enabled is false", () => {
    const handler = vi.fn();
    renderHook(() => useHotkey("escape", handler, { enabled: false }));

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Escape",
          bubbles: true,
        }),
      );
    });

    expect(handler).not.toHaveBeenCalled();
  });

  it("re-enables when enabled changes to true", () => {
    const handler = vi.fn();
    const { rerender } = renderHook(
      ({ enabled }) => useHotkey("escape", handler, { enabled }),
      { initialProps: { enabled: false } },
    );

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
    });
    expect(handler).not.toHaveBeenCalled();

    rerender({ enabled: true });

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
    });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("prevents default on matched combos", () => {
    const handler = vi.fn();
    renderHook(() => useHotkey("ctrl+s", handler));

    const event = new KeyboardEvent("keydown", {
      key: "s",
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    const preventSpy = vi.spyOn(event, "preventDefault");

    act(() => {
      document.dispatchEvent(event);
    });

    expect(preventSpy).toHaveBeenCalled();
  });

  it("supports multiple hotkeys registered independently", () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    renderHook(() => {
      useHotkey("ctrl+k", handler1);
      useHotkey("ctrl+j", handler2);
    });

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "k",
          ctrlKey: true,
          bubbles: true,
        }),
      );
    });

    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).not.toHaveBeenCalled();

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "j",
          ctrlKey: true,
          bubbles: true,
        }),
      );
    });

    expect(handler2).toHaveBeenCalledTimes(1);
  });

  it("cleans up listener on unmount", () => {
    const handler = vi.fn();
    const { unmount } = renderHook(() => useHotkey("escape", handler));

    unmount();

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
    });

    expect(handler).not.toHaveBeenCalled();
  });

  it("uses latest callback via ref", () => {
    let count = 0;
    const { rerender } = renderHook(
      ({ cb }) => useHotkey("escape", cb),
      { initialProps: { cb: () => { count = 1; } } },
    );

    rerender({ cb: () => { count = 2; } });

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
    });

    expect(count).toBe(2);
  });
});

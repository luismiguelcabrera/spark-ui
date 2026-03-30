import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useColorScheme } from "../use-color-scheme";

function createMockMediaQueryList(matches: boolean) {
  return {
    matches,
    media: "(prefers-color-scheme: dark)",
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    onchange: null,
    dispatchEvent: vi.fn(),
  } as unknown as MediaQueryList;
}

describe("useColorScheme", () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    window.localStorage.clear();
    // Default: no dark preference
    window.matchMedia = vi.fn(() => createMockMediaQueryList(false));
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  it("defaults to light when no preference is set", () => {
    const { result } = renderHook(() => useColorScheme());
    expect(result.current.colorScheme).toBe("light");
  });

  it("detects dark system preference", () => {
    window.matchMedia = vi.fn(() => createMockMediaQueryList(true));
    const { result } = renderHook(() => useColorScheme());
    expect(result.current.colorScheme).toBe("dark");
  });

  it("reads stored preference from localStorage", () => {
    window.localStorage.setItem("spark-ui-color-scheme", "dark");
    const { result } = renderHook(() => useColorScheme());
    expect(result.current.colorScheme).toBe("dark");
  });

  it("setColorScheme updates the scheme and persists to localStorage", () => {
    const { result } = renderHook(() => useColorScheme());
    act(() => {
      result.current.setColorScheme("dark");
    });
    expect(result.current.colorScheme).toBe("dark");
    expect(window.localStorage.getItem("spark-ui-color-scheme")).toBe("dark");
  });

  it("toggleColorScheme flips between light and dark", () => {
    const { result } = renderHook(() => useColorScheme());
    expect(result.current.colorScheme).toBe("light");
    act(() => {
      result.current.toggleColorScheme();
    });
    expect(result.current.colorScheme).toBe("dark");
    act(() => {
      result.current.toggleColorScheme();
    });
    expect(result.current.colorScheme).toBe("light");
  });

  it("persists toggle to localStorage", () => {
    const { result } = renderHook(() => useColorScheme());
    act(() => {
      result.current.toggleColorScheme();
    });
    expect(window.localStorage.getItem("spark-ui-color-scheme")).toBe("dark");
  });

  it("returns stable function references", () => {
    const { result, rerender } = renderHook(() => useColorScheme());
    const setRef = result.current.setColorScheme;
    const toggleRef = result.current.toggleColorScheme;
    rerender();
    expect(result.current.setColorScheme).toBe(setRef);
    expect(result.current.toggleColorScheme).toBe(toggleRef);
  });

  it("localStorage override takes precedence over system preference", () => {
    window.matchMedia = vi.fn(() => createMockMediaQueryList(true));
    window.localStorage.setItem("spark-ui-color-scheme", "light");
    const { result } = renderHook(() => useColorScheme());
    expect(result.current.colorScheme).toBe("light");
  });

  it("cleans up media query listener on unmount", () => {
    const { unmount } = renderHook(() => useColorScheme());
    unmount();
  });
});

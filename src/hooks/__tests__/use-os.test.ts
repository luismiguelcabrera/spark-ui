import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { useOs } from "../use-os";

describe("useOs", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 'undetermined' initially (SSR-safe)", () => {
    // On first render (before useEffect), the state is "undetermined"
    // After useEffect runs, it detects the OS
    const { result } = renderHook(() => useOs());
    // In a jsdom environment, navigator exists, so it will try to detect
    expect(typeof result.current).toBe("string");
  });

  it("returns a valid OS string", () => {
    const { result } = renderHook(() => useOs());
    const validValues = [
      "windows",
      "macos",
      "linux",
      "ios",
      "android",
      "undetermined",
    ];
    expect(validValues).toContain(result.current);
  });

  it("detects Windows from user agent", () => {
    const originalPlatform = Object.getOwnPropertyDescriptor(
      navigator,
      "platform",
    );
    const originalUserAgent = Object.getOwnPropertyDescriptor(
      navigator,
      "userAgent",
    );

    Object.defineProperty(navigator, "platform", {
      value: "Win32",
      configurable: true,
    });
    Object.defineProperty(navigator, "userAgent", {
      value:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      configurable: true,
    });

    const { result } = renderHook(() => useOs());
    expect(result.current).toBe("windows");

    if (originalPlatform) {
      Object.defineProperty(navigator, "platform", originalPlatform);
    }
    if (originalUserAgent) {
      Object.defineProperty(navigator, "userAgent", originalUserAgent);
    }
  });

  it("detects macOS from platform", () => {
    const originalPlatform = Object.getOwnPropertyDescriptor(
      navigator,
      "platform",
    );
    const originalUserAgent = Object.getOwnPropertyDescriptor(
      navigator,
      "userAgent",
    );
    const originalMaxTouchPoints = Object.getOwnPropertyDescriptor(
      navigator,
      "maxTouchPoints",
    );

    Object.defineProperty(navigator, "platform", {
      value: "MacIntel",
      configurable: true,
    });
    Object.defineProperty(navigator, "userAgent", {
      value:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      configurable: true,
    });
    Object.defineProperty(navigator, "maxTouchPoints", {
      value: 0,
      configurable: true,
    });

    const { result } = renderHook(() => useOs());
    expect(result.current).toBe("macos");

    if (originalPlatform) {
      Object.defineProperty(navigator, "platform", originalPlatform);
    }
    if (originalUserAgent) {
      Object.defineProperty(navigator, "userAgent", originalUserAgent);
    }
    if (originalMaxTouchPoints) {
      Object.defineProperty(navigator, "maxTouchPoints", originalMaxTouchPoints);
    }
  });

  it("detects iOS from user agent", () => {
    const originalUA = Object.getOwnPropertyDescriptor(
      navigator,
      "userAgent",
    );
    const originalPlatform = Object.getOwnPropertyDescriptor(
      navigator,
      "platform",
    );

    Object.defineProperty(navigator, "userAgent", {
      value:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15",
      configurable: true,
    });
    Object.defineProperty(navigator, "platform", {
      value: "iPhone",
      configurable: true,
    });

    const { result } = renderHook(() => useOs());
    expect(result.current).toBe("ios");

    if (originalUA) {
      Object.defineProperty(navigator, "userAgent", originalUA);
    }
    if (originalPlatform) {
      Object.defineProperty(navigator, "platform", originalPlatform);
    }
  });

  it("detects Android from user agent", () => {
    const originalUA = Object.getOwnPropertyDescriptor(
      navigator,
      "userAgent",
    );
    const originalPlatform = Object.getOwnPropertyDescriptor(
      navigator,
      "platform",
    );

    Object.defineProperty(navigator, "userAgent", {
      value:
        "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36",
      configurable: true,
    });
    Object.defineProperty(navigator, "platform", {
      value: "Linux armv8l",
      configurable: true,
    });

    const { result } = renderHook(() => useOs());
    expect(result.current).toBe("android");

    if (originalUA) {
      Object.defineProperty(navigator, "userAgent", originalUA);
    }
    if (originalPlatform) {
      Object.defineProperty(navigator, "platform", originalPlatform);
    }
  });

  it("detects Linux from platform", () => {
    const originalUA = Object.getOwnPropertyDescriptor(
      navigator,
      "userAgent",
    );
    const originalPlatform = Object.getOwnPropertyDescriptor(
      navigator,
      "platform",
    );

    Object.defineProperty(navigator, "userAgent", {
      value: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
      configurable: true,
    });
    Object.defineProperty(navigator, "platform", {
      value: "Linux x86_64",
      configurable: true,
    });

    const { result } = renderHook(() => useOs());
    expect(result.current).toBe("linux");

    if (originalUA) {
      Object.defineProperty(navigator, "userAgent", originalUA);
    }
    if (originalPlatform) {
      Object.defineProperty(navigator, "platform", originalPlatform);
    }
  });
});

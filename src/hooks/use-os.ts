"use client";

import { useState, useEffect } from "react";

export type Os = "windows" | "macos" | "linux" | "ios" | "android" | "undetermined";

function detectOs(): Os {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return "undetermined";
  }

  const ua = navigator.userAgent;

  // iOS detection (must be before macOS since iPad can report as Mac)
  if (/iPad|iPhone|iPod/.test(ua)) {
    return "ios";
  }

  // iPad with desktop user agent (iPadOS 13+)
  if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) {
    return "ios";
  }

  // Android
  if (/Android/.test(ua)) {
    return "android";
  }

  // Windows
  if (/Win/.test(navigator.platform) || /Windows/.test(ua)) {
    return "windows";
  }

  // macOS
  if (/Mac/.test(navigator.platform) || /Macintosh/.test(ua)) {
    return "macos";
  }

  // Linux
  if (/Linux/.test(navigator.platform) || /Linux/.test(ua)) {
    return "linux";
  }

  return "undetermined";
}

/**
 * Detect the user's operating system.
 *
 * SSR-safe: returns "undetermined" on the server.
 *
 * ```tsx
 * const os = useOs();
 * // "windows" | "macos" | "linux" | "ios" | "android" | "undetermined"
 * ```
 */
export function useOs(): Os {
  const [os, setOs] = useState<Os>("undetermined");

  useEffect(() => {
    setOs(detectOs()); // eslint-disable-line react-hooks/set-state-in-effect -- sync with browser OS on mount
  }, []);

  return os;
}

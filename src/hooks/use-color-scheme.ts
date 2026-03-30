"use client";

import { useState, useCallback, useEffect } from "react";

export type ColorScheme = "light" | "dark";

export type UseColorSchemeReturn = {
  /** Current color scheme */
  colorScheme: ColorScheme;
  /** Toggle between light and dark */
  toggleColorScheme: () => void;
  /** Set a specific color scheme */
  setColorScheme: (scheme: ColorScheme) => void;
};

const STORAGE_KEY = "spark-ui-color-scheme";

function getSystemScheme(): ColorScheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredScheme(): ColorScheme | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // localStorage may be unavailable
  }
  return null;
}

/**
 * Detect and manage color scheme preference.
 *
 * Uses `prefers-color-scheme` media query as default.
 * Persists user override to localStorage.
 * SSR-safe: defaults to "light".
 *
 * ```tsx
 * const { colorScheme, toggleColorScheme, setColorScheme } = useColorScheme();
 * ```
 */
export function useColorScheme(): UseColorSchemeReturn {
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() => {
    const stored = getStoredScheme();
    if (stored) return stored;
    return getSystemScheme();
  });

  // Listen for system preference changes (only when no stored override)
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      // Only follow system if there's no stored override
      if (!getStoredScheme()) {
        setColorSchemeState(e.matches ? "dark" : "light");
      }
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const setColorScheme = useCallback((scheme: ColorScheme) => {
    setColorSchemeState(scheme);
    try {
      window.localStorage.setItem(STORAGE_KEY, scheme);
    } catch {
      // localStorage may be unavailable
    }
  }, []);

  const toggleColorScheme = useCallback(() => {
    setColorSchemeState((prev) => {
      const next = prev === "light" ? "dark" : "light";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // localStorage may be unavailable
      }
      return next;
    });
  }, []);

  return { colorScheme, toggleColorScheme, setColorScheme };
}

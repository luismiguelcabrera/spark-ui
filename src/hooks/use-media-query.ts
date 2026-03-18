"use client";

import { useState, useEffect } from "react";

/**
 * Subscribe to a CSS media query and react to changes.
 *
 * @param query - CSS media query string, e.g. "(min-width: 768px)"
 * @param defaultValue - Value to use during SSR (default: false)
 * @returns Whether the media query currently matches
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia(query);
    setMatches(mql.matches); // eslint-disable-line react-hooks/set-state-in-effect -- sync with browser media query on mount

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

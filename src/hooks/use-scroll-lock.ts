"use client";

import { useEffect } from "react";

/**
 * Lock body scroll when a modal/drawer/sheet is open.
 * Restores the original overflow on cleanup.
 *
 * @param locked - Whether to lock scrolling (default: false)
 */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}

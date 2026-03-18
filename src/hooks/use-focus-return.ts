"use client";

import { useEffect, useRef } from "react";

type UseFocusReturnOptions = {
  /** Whether the target (e.g. modal) is opened */
  opened: boolean;
};

/**
 * Returns focus to the previously focused element when `opened` becomes false
 * or on unmount.
 *
 * Captures `document.activeElement` when `opened` becomes `true`,
 * and restores focus when `opened` becomes `false` or the hook unmounts
 * while still opened.
 *
 * SSR-safe: guards `document` access.
 *
 * @param options - Configuration with `opened` flag
 */
export function useFocusReturn(options?: UseFocusReturnOptions): void {
  const opened = options?.opened ?? false;
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (opened) {
      // Capture the currently focused element when opened becomes true
      if (typeof document !== "undefined") {
        previouslyFocusedRef.current =
          (document.activeElement as HTMLElement) ?? null;
      }
    } else {
      // Restore focus when opened becomes false
      if (previouslyFocusedRef.current) {
        const el = previouslyFocusedRef.current;
        previouslyFocusedRef.current = null;
        // Use requestAnimationFrame to ensure the element is still in the DOM
        requestAnimationFrame(() => {
          if (el && typeof el.focus === "function") {
            el.focus();
          }
        });
      }
    }
  }, [opened]);

  // Restore focus on unmount if still opened
  useEffect(() => {
    return () => {
      if (previouslyFocusedRef.current) {
        const el = previouslyFocusedRef.current;
        if (el && typeof el.focus === "function") {
          el.focus();
        }
      }
    };
     
  }, []);
}

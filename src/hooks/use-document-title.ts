"use client";

import { useEffect, useRef } from "react";

/**
 * Sets `document.title` reactively.
 *
 * @param title - The title to set
 * @param restoreOnUnmount - Whether to restore the original title on unmount (default: true)
 */
export function useDocumentTitle(
  title: string,
  restoreOnUnmount = true,
): void {
  const previousTitle = useRef<string | undefined>(undefined);

  useEffect(() => {
    // SSR guard
    if (typeof document === "undefined") return;

    // Capture original title on first mount only
    if (previousTitle.current === undefined) {
      previousTitle.current = document.title;
    }

    document.title = title;
  }, [title]);

  useEffect(() => {
    // SSR guard
    if (typeof document === "undefined") return;

    return () => {
      if (restoreOnUnmount && previousTitle.current !== undefined) {
        document.title = previousTitle.current;
      }
    };
  }, [restoreOnUnmount]);
}

"use client";

import { useState, useEffect } from "react";

/**
 * Returns the current document visibility state.
 *
 * SSR-safe: returns "visible" when `document` is not available.
 *
 * @returns DocumentVisibilityState ("visible" | "hidden")
 */
export function useDocumentVisibility(): DocumentVisibilityState {
  const [visibility, setVisibility] = useState<DocumentVisibilityState>(() =>
    typeof document !== "undefined" ? document.visibilityState : "visible",
  );

  useEffect(() => {
    const handler = () => {
      setVisibility(document.visibilityState);
    };

    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  return visibility;
}

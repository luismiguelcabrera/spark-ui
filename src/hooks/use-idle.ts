"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const ACTIVITY_EVENTS: (keyof DocumentEventMap)[] = [
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
];

/**
 * Detects user idle state after a given timeout.
 *
 * @param timeout - Idle timeout in milliseconds (default: 60000)
 * @returns Whether the user is currently idle
 */
export function useIdle(timeout = 60000): boolean {
  const [idle, setIdle] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    setIdle(false);

    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIdle(true);
    }, timeout);
  }, [timeout]);

  useEffect(() => {
    // SSR guard
    if (typeof document === "undefined") return;

    // Start the initial timer
    resetTimer();

    for (const event of ACTIVITY_EVENTS) {
      document.addEventListener(event, resetTimer, { passive: true });
    }

    return () => {
      for (const event of ACTIVITY_EVENTS) {
        document.removeEventListener(event, resetTimer);
      }

      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [resetTimer]);

  return idle;
}

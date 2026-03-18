"use client";

import { useRef, useCallback } from "react";
import type { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from "react";

export type UseLongPressOptions = {
  /** Time in ms before the long press fires (default: 500) */
  delay?: number;
  /** Called when the press starts */
  onStart?: () => void;
  /** Called when the press is cancelled before firing */
  onCancel?: () => void;
};

export type UseLongPressReturn = {
  onMouseDown: (e: ReactMouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onTouchStart: (e: ReactTouchEvent) => void;
  onTouchEnd: () => void;
};

/**
 * Detect long press gestures on an element.
 *
 * ```tsx
 * const handlers = useLongPress(() => console.log("long pressed!"), { delay: 800 });
 * return <button {...handlers}>Hold me</button>
 * ```
 *
 * @param callback - Fired when the long press duration is met
 * @param options - Configuration options
 */
export function useLongPress(
  callback: (event: MouseEvent | TouchEvent) => void,
  options: UseLongPressOptions = {},
): UseLongPressReturn {
  const { delay = 500, onStart, onCancel } = options;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback; // eslint-disable-line react-hooks/refs -- keep callback ref fresh

  const savedEventRef = useRef<MouseEvent | TouchEvent | null>(null);

  const start = useCallback(
    (event: ReactMouseEvent | ReactTouchEvent) => {
      savedEventRef.current = event.nativeEvent as MouseEvent | TouchEvent;
      onStart?.();
      timerRef.current = setTimeout(() => {
        callbackRef.current(savedEventRef.current!);
        timerRef.current = null;
      }, delay);
    },
    [delay, onStart],
  );

  const cancel = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      onCancel?.();
    }
    savedEventRef.current = null;
  }, [onCancel]);

  const onMouseDown = useCallback(
    (e: ReactMouseEvent) => start(e),
    [start],
  );

  const onTouchStart = useCallback(
    (e: ReactTouchEvent) => start(e),
    [start],
  );

  return {
    onMouseDown,
    onMouseUp: cancel,
    onMouseLeave: cancel,
    onTouchStart,
    onTouchEnd: cancel,
  };
}

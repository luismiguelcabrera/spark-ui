"use client";

import { useState, useCallback, useRef, useEffect } from "react";

type UseFocusWithinReturn<T extends HTMLElement> = {
  ref: React.RefObject<T | null>;
  focused: boolean;
};

/**
 * Detects whether focus is currently within an element.
 *
 * Uses `focusin`/`focusout` events with `relatedTarget` checking to determine
 * if focus has moved outside the container.
 *
 * SSR-safe: guards `document` access.
 *
 * @returns Object with `ref` to attach to the container and `focused` boolean
 */
export function useFocusWithin<
  T extends HTMLElement = HTMLElement,
>(): UseFocusWithinReturn<T> {
  const ref = useRef<T>(null);
  const [focused, setFocused] = useState(false);

  const handleFocusIn = useCallback(() => {
    setFocused(true);
  }, []);

  const handleFocusOut = useCallback(
    (event: FocusEvent) => {
      const container = ref.current;
      if (!container) return;

      // relatedTarget is the element receiving focus
      // If it's inside our container, focus is still within
      if (
        event.relatedTarget instanceof Node &&
        container.contains(event.relatedTarget)
      ) {
        return;
      }

      setFocused(false);
    },
    []
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener("focusin", handleFocusIn);
    el.addEventListener("focusout", handleFocusOut as EventListener);

    return () => {
      el.removeEventListener("focusin", handleFocusIn);
      el.removeEventListener("focusout", handleFocusOut as EventListener);
    };
  }, [handleFocusIn, handleFocusOut]);

  return { ref, focused };
}

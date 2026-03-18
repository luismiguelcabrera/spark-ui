"use client";

import { useEffect, useRef, useCallback, type RefObject } from "react";

/**
 * Detect clicks outside one or more elements and call a handler.
 * Supports multiple refs (e.g., a trigger + a dropdown that are siblings).
 *
 * ```tsx
 * const menuRef = useRef(null);
 * const buttonRef = useRef(null);
 * useOnClickOutside([menuRef, buttonRef], () => setOpen(false));
 * ```
 *
 * @param refs - Single ref or array of refs to treat as "inside"
 * @param handler - Called when a click/touch lands outside all refs
 * @param enabled - Whether the listener is active (default: true)
 */
export function useOnClickOutside<T extends HTMLElement>(
  refs: RefObject<T | null> | RefObject<T | null>[],
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled = true,
): void {
  // Stabilize the handler reference
  const handlerRef = useRef(handler);
  handlerRef.current = handler; // eslint-disable-line react-hooks/refs -- keep handler fresh

  const refsArray = Array.isArray(refs) ? refs : [refs];

  // Store refs in a stable ref to avoid re-subscribing on every render
  const refsRef = useRef(refsArray);
  refsRef.current = refsArray; // eslint-disable-line react-hooks/refs -- keep refs fresh

  const stableListener = useCallback((event: MouseEvent | TouchEvent) => {
    const target = event.target as Node;
    const isInside = refsRef.current.some((ref) => {
      const el = ref.current;
      return el && el.contains(target);
    });
    if (!isInside) {
      handlerRef.current(event);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("mousedown", stableListener);
    document.addEventListener("touchstart", stableListener);
    return () => {
      document.removeEventListener("mousedown", stableListener);
      document.removeEventListener("touchstart", stableListener);
    };
  }, [enabled, stableListener]);
}

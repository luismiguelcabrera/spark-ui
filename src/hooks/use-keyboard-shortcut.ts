"use client";

import { useEffect } from "react";

type KeyCombo = {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
};

/**
 * Listen for keyboard shortcuts globally.
 *
 * @param combo - Key combination to listen for
 * @param handler - Callback when the shortcut is triggered
 * @param enabled - Whether the listener is active (default: true)
 *
 * @example
 * useKeyboardShortcut({ key: "k", meta: true }, () => openSearch());
 * useKeyboardShortcut({ key: "Escape" }, () => close());
 */
export function useKeyboardShortcut(
  combo: KeyCombo,
  handler: (event: KeyboardEvent) => void,
  enabled = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: KeyboardEvent) => {
      const matchesKey = event.key.toLowerCase() === combo.key.toLowerCase();
      const matchesCtrl = combo.ctrl ? event.ctrlKey : !event.ctrlKey;
      const matchesMeta = combo.meta ? event.metaKey : !event.metaKey;
      const matchesShift = combo.shift ? event.shiftKey : !event.shiftKey;
      const matchesAlt = combo.alt ? event.altKey : !event.altKey;

      if (matchesKey && matchesCtrl && matchesMeta && matchesShift && matchesAlt) {
        event.preventDefault();
        handler(event);
      }
    };

    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [combo.key, combo.ctrl, combo.meta, combo.shift, combo.alt, handler, enabled]);
}

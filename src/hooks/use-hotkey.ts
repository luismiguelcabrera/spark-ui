"use client";

import { useEffect, useRef } from "react";

type HotkeyOptions = {
  enabled?: boolean;
};

function isMac(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
}

function parseCombo(combo: string): {
  key: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  alt: boolean;
} {
  const parts = combo
    .toLowerCase()
    .split("+")
    .map((p) => p.trim());

  let ctrl = false;
  let meta = false;
  let shift = false;
  let alt = false;
  let key = "";

  const mac = isMac();

  for (const part of parts) {
    switch (part) {
      case "mod":
        if (mac) {
          meta = true;
        } else {
          ctrl = true;
        }
        break;
      case "ctrl":
      case "control":
        ctrl = true;
        break;
      case "meta":
      case "cmd":
      case "command":
        meta = true;
        break;
      case "shift":
        shift = true;
        break;
      case "alt":
      case "option":
        alt = true;
        break;
      default:
        key = part;
    }
  }

  return { key, ctrl, meta, shift, alt };
}

/**
 * Register a keyboard shortcut with combo string support.
 *
 * @param combo - Key combination like "mod+k", "ctrl+shift+p", "escape"
 * @param callback - Handler to call when the combo is pressed
 * @param options - { enabled?: boolean }
 *
 * @example
 * useHotkey("mod+k", () => openSearch());
 * useHotkey("escape", () => close());
 * useHotkey("ctrl+shift+p", () => openCommandPalette(), { enabled: isOpen });
 */
export function useHotkey(
  combo: string,
  callback: () => void,
  options?: HotkeyOptions
): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback; // eslint-disable-line react-hooks/refs -- keep callback ref fresh

  const enabled = options?.enabled ?? true;

  useEffect(() => {
    if (!enabled) return;

    const parsed = parseCombo(combo);

    const handler = (event: KeyboardEvent) => {
      const matchesKey =
        event.key.toLowerCase() === parsed.key;
      const matchesCtrl = parsed.ctrl ? event.ctrlKey : !event.ctrlKey;
      const matchesMeta = parsed.meta ? event.metaKey : !event.metaKey;
      const matchesShift = parsed.shift ? event.shiftKey : !event.shiftKey;
      const matchesAlt = parsed.alt ? event.altKey : !event.altKey;

      if (
        matchesKey &&
        matchesCtrl &&
        matchesMeta &&
        matchesShift &&
        matchesAlt
      ) {
        event.preventDefault();
        callbackRef.current();
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [combo, enabled]);
}

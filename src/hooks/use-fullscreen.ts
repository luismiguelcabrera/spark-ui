"use client";

import { useState, useEffect, useCallback, type RefObject } from "react";

export type UseFullscreenReturn = {
  isFullscreen: boolean;
  enter: () => Promise<void>;
  exit: () => Promise<void>;
  toggle: () => Promise<void>;
};

/**
 * Manages the Fullscreen API for a given element.
 *
 * @param ref - Ref to the element to make fullscreen
 * @returns { isFullscreen, enter, exit, toggle }
 */
export function useFullscreen<T extends HTMLElement>(
  ref: RefObject<T | null>,
): UseFullscreenReturn {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // SSR guard
    if (typeof document === "undefined") return;

    const handler = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const enter = useCallback(async () => {
    const el = ref.current;
    if (!el) return;

    // SSR guard
    if (typeof document === "undefined" || !document.fullscreenEnabled) return;

    if (!document.fullscreenElement) {
      await el.requestFullscreen();
    }
  }, [ref]);

  const exit = useCallback(async () => {
    // SSR guard
    if (typeof document === "undefined" || !document.fullscreenEnabled) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  }, []);

  const toggle = useCallback(async () => {
    if (document.fullscreenElement) {
      await exit();
    } else {
      await enter();
    }
  }, [enter, exit]);

  return { isFullscreen, enter, exit, toggle };
}

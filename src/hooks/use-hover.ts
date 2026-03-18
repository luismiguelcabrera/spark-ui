"use client";

import { useState, type RefObject } from "react";
import { useEffect } from "react";

/**
 * Track hover state for an element.
 *
 * @param ref - Ref to the element to watch
 * @returns Whether the element is currently hovered
 */
export function useHover<T extends HTMLElement>(ref: RefObject<T | null>): boolean {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleEnter = () => setHovered(true);
    const handleLeave = () => setHovered(false);

    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [ref]);

  return hovered;
}

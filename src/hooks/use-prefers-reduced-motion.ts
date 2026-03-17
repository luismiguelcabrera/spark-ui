"use client";

import { useMediaQuery } from "./use-media-query";

/**
 * Check if the user prefers reduced motion.
 *
 * @returns true if the user has enabled reduced motion in their OS settings
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

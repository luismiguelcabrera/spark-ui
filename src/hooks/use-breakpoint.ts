"use client";

import { useMediaQuery } from "./use-media-query";

const breakpoints = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
} as const;

type Breakpoint = keyof typeof breakpoints;

/**
 * Check if the viewport matches a Tailwind breakpoint.
 *
 * @param breakpoint - Tailwind breakpoint name
 * @returns Whether the viewport is at or above the breakpoint
 *
 * @example
 * const isDesktop = useBreakpoint("lg");
 */
export function useBreakpoint(breakpoint: Breakpoint): boolean {
  return useMediaQuery(breakpoints[breakpoint]);
}

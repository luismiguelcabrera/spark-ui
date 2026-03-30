"use client";

import { useState, useEffect, useMemo } from "react";

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

type Platform = {
  touch: boolean;
  ios: boolean;
  android: boolean;
};

type DisplayInfo = {
  breakpoint: Breakpoint;
  mobile: boolean;
  width: number;
  height: number;
  platform: Platform;
};

const breakpointQueries: Record<string, string> = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
};

function getBreakpoint(): Breakpoint {
  if (typeof window === "undefined") return "xs";

  if (window.matchMedia(breakpointQueries["2xl"]).matches) return "2xl";
  if (window.matchMedia(breakpointQueries.xl).matches) return "xl";
  if (window.matchMedia(breakpointQueries.lg).matches) return "lg";
  if (window.matchMedia(breakpointQueries.md).matches) return "md";
  if (window.matchMedia(breakpointQueries.sm).matches) return "sm";
  return "xs";
}

function getPlatform(): Platform {
  if (typeof navigator === "undefined") {
    return { touch: false, ios: false, android: false };
  }

  const ua = navigator.userAgent;
  const touch =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const ios = /iPad|iPhone|iPod/.test(ua);
  const android = /Android/.test(ua);

  return { touch, ios, android };
}

/**
 * Reactive breakpoint + platform detection.
 *
 * Returns the current Tailwind breakpoint, viewport dimensions,
 * whether the viewport is mobile-sized, and platform info.
 *
 * @example
 * const { breakpoint, mobile, width, height, platform } = useDisplay();
 */
export function useDisplay(): DisplayInfo {
  const [state, setState] = useState<{
    breakpoint: Breakpoint;
    width: number;
    height: number;
  }>({
    breakpoint: "xs",
    width: 0,
    height: 0,
  });

  const platform = useMemo(() => getPlatform(), []);

  useEffect(() => {
    const update = () => {
      setState({
        breakpoint: getBreakpoint(),
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial values
    update();

    // Listen to all breakpoint media queries
    const mqls = Object.values(breakpointQueries).map((q) =>
      window.matchMedia(q)
    );

    const handleChange = () => update();

    for (const mql of mqls) {
      mql.addEventListener("change", handleChange);
    }

    window.addEventListener("resize", handleChange);

    return () => {
      for (const mql of mqls) {
        mql.removeEventListener("change", handleChange);
      }
      window.removeEventListener("resize", handleChange);
    };
  }, []);

  return {
    breakpoint: state.breakpoint,
    mobile: state.breakpoint === "xs" || state.breakpoint === "sm",
    width: state.width,
    height: state.height,
    platform,
  };
}

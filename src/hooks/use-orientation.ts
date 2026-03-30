"use client";

import { useState, useEffect } from "react";

export type UseOrientationReturn = {
  /** Current orientation angle in degrees */
  angle: number;
  /** Current orientation type */
  type: OrientationType;
};

function getOrientation(): UseOrientationReturn {
  if (typeof window === "undefined" || !window.screen?.orientation) {
    return { angle: 0, type: "landscape-primary" };
  }
  return {
    angle: window.screen.orientation.angle,
    type: window.screen.orientation.type,
  };
}

/**
 * Track device orientation changes.
 *
 * SSR-safe: returns `{ angle: 0, type: "landscape-primary" }`.
 *
 * ```tsx
 * const { angle, type } = useOrientation();
 * ```
 */
export function useOrientation(): UseOrientationReturn {
  const [orientation, setOrientation] = useState<UseOrientationReturn>(getOrientation);

  useEffect(() => {
    const handleChange = () => {
      setOrientation(getOrientation());
    };

    // Modern API
    const screenOrientation = window.screen?.orientation;
    if (screenOrientation) {
      screenOrientation.addEventListener("change", handleChange);
      return () => screenOrientation.removeEventListener("change", handleChange);
    }

    // Fallback to the deprecated orientationchange event
    window.addEventListener("orientationchange", handleChange);
    return () => window.removeEventListener("orientationchange", handleChange);
  }, []);

  return orientation;
}

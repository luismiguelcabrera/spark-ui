"use client";

import { useState, useCallback, useEffect } from "react";

type RtlState = {
  isRtl: boolean;
  dir: "ltr" | "rtl";
  toggle: () => void;
};

/**
 * RTL direction state management.
 *
 * Reads and updates `document.documentElement.dir`.
 * SSR-safe — defaults to "ltr".
 *
 * @example
 * const { isRtl, dir, toggle } = useRtl();
 */
export function useRtl(): RtlState {
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    const dir = document.documentElement.dir;
    setIsRtl(dir === "rtl"); // eslint-disable-line react-hooks/set-state-in-effect -- sync with DOM dir on mount
  }, []);

  const toggle = useCallback(() => {
    setIsRtl((prev) => {
      const next = !prev;
      document.documentElement.dir = next ? "rtl" : "ltr";
      return next;
    });
  }, []);

  return {
    isRtl,
    dir: isRtl ? "rtl" : "ltr",
    toggle,
  };
}

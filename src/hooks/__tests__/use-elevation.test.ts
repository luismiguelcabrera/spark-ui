import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useElevation } from "../use-elevation";
import type { ElevationLevel } from "../../lib/elevation";

describe("useElevation", () => {
  it.each([
    [0, "shadow-none"],
    [1, "shadow-sm"],
    [2, "shadow"],
    [3, "shadow-md"],
    [4, "shadow-lg"],
    [5, "shadow-xl"],
    [6, "shadow-2xl"],
  ] as [ElevationLevel, string][])(
    "returns '%s' for level %i",
    (level, expected) => {
      const { result } = renderHook(() => useElevation(level));
      expect(result.current).toBe(expected);
    },
  );
});

import { describe, it, expect } from "vitest";
import { elevation, getElevation } from "../elevation";
import type { ElevationLevel } from "../elevation";

describe("elevation", () => {
  it("maps level 0 to shadow-none", () => {
    expect(elevation[0]).toBe("shadow-none");
  });

  it("maps level 1 to shadow-sm", () => {
    expect(elevation[1]).toBe("shadow-sm");
  });

  it("maps level 2 to shadow", () => {
    expect(elevation[2]).toBe("shadow");
  });

  it("maps level 3 to shadow-md", () => {
    expect(elevation[3]).toBe("shadow-md");
  });

  it("maps level 4 to shadow-lg", () => {
    expect(elevation[4]).toBe("shadow-lg");
  });

  it("maps level 5 to shadow-xl", () => {
    expect(elevation[5]).toBe("shadow-xl");
  });

  it("maps level 6 to shadow-2xl", () => {
    expect(elevation[6]).toBe("shadow-2xl");
  });

  it("has 7 elevation levels (0-6)", () => {
    expect(Object.keys(elevation)).toHaveLength(7);
  });
});

describe("getElevation", () => {
  it.each([
    [0, "shadow-none"],
    [1, "shadow-sm"],
    [2, "shadow"],
    [3, "shadow-md"],
    [4, "shadow-lg"],
    [5, "shadow-xl"],
    [6, "shadow-2xl"],
  ] as [ElevationLevel, string][])(
    "returns %s for level %i",
    (level, expected) => {
      expect(getElevation(level)).toBe(expected);
    }
  );
});

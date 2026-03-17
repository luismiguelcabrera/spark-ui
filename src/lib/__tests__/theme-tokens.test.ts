import { describe, it, expect } from "vitest";
import { tokensToCssVars } from "../theme-tokens";

describe("tokensToCssVars", () => {
  it("converts colors to CSS variables", () => {
    const result = tokensToCssVars({
      colors: { primary: "#e11d48", secondary: "#0f172a" },
    });
    expect(result).toEqual({
      "--color-primary": "#e11d48",
      "--color-secondary": "#0f172a",
    });
  });

  it("converts radius to CSS variable", () => {
    const result = tokensToCssVars({ radius: "0.5rem" });
    expect(result).toEqual({ "--radius-base": "0.5rem" });
  });

  it("skips undefined values", () => {
    const result = tokensToCssVars({
      colors: { primary: "#e11d48", secondary: undefined },
    });
    expect(result).toEqual({ "--color-primary": "#e11d48" });
  });

  it("returns empty object for empty tokens", () => {
    const result = tokensToCssVars({});
    expect(result).toEqual({});
  });

  it("combines colors and radius", () => {
    const result = tokensToCssVars({
      colors: { accent: "#f59e0b" },
      radius: "1rem",
    });
    expect(result).toEqual({
      "--color-accent": "#f59e0b",
      "--radius-base": "1rem",
    });
  });
});

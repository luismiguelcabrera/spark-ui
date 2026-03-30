import { describe, it, expect } from "vitest";
import { createTheme, defaultThemes } from "../theme";

describe("createTheme", () => {
  it("creates a frozen theme object with name and colors", () => {
    const theme = createTheme("brand", { primary: "#ff0000" });
    expect(theme.name).toBe("brand");
    expect(theme.colors.primary).toBe("#ff0000");
    expect(Object.isFrozen(theme)).toBe(true);
  });

  it("allows partial color overrides", () => {
    const theme = createTheme("minimal", { accent: "#00ff00" });
    expect(theme.colors).toEqual({ accent: "#00ff00" });
  });

  it("creates theme with empty colors", () => {
    const theme = createTheme("empty", {});
    expect(theme.name).toBe("empty");
    expect(theme.colors).toEqual({});
  });
});

describe("defaultThemes", () => {
  it("includes light theme", () => {
    expect(defaultThemes.light).toBeDefined();
    expect(defaultThemes.light.primary).toBe("#4f46e5");
  });

  it("includes dark theme", () => {
    expect(defaultThemes.dark).toBeDefined();
    expect(defaultThemes.dark.primary).toBe("#818cf8");
  });

  it("light theme has all expected color tokens", () => {
    const keys = Object.keys(defaultThemes.light);
    expect(keys).toContain("primary");
    expect(keys).toContain("secondary");
    expect(keys).toContain("accent");
    expect(keys).toContain("surface");
    expect(keys).toContain("mint");
  });

  it("dark theme has all expected color tokens", () => {
    const keys = Object.keys(defaultThemes.dark);
    expect(keys).toContain("primary");
    expect(keys).toContain("secondary");
    expect(keys).toContain("accent");
    expect(keys).toContain("surface");
    expect(keys).toContain("mint");
  });
});

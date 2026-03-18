import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { ThemeScript } from "../theme-script";

// Helper: extract the inline script text from the rendered <script> tag.
function getScriptContent(container: HTMLElement): string {
  const script = container.querySelector("script");
  return script?.innerHTML ?? "";
}

describe("ThemeScript", () => {
  beforeEach(() => {
    // Reset any attribute set on <html>
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("data-mode");
    localStorage.clear();
  });

  // ---- Rendering ----

  it("renders a <script> element", () => {
    const { container } = render(<ThemeScript />);
    expect(container.querySelector("script")).not.toBeNull();
  });

  it("sets nonce when provided", () => {
    const { container } = render(<ThemeScript nonce="abc123" />);
    const script = container.querySelector("script");
    expect(script?.getAttribute("nonce")).toBe("abc123");
  });

  it("does not set nonce when omitted", () => {
    const { container } = render(<ThemeScript />);
    const script = container.querySelector("script");
    expect(script?.hasAttribute("nonce")).toBe(false);
  });

  // ---- Script content correctness ----

  it("uses default storageKey 'spark-ui-theme'", () => {
    const { container } = render(<ThemeScript />);
    const content = getScriptContent(container);
    expect(content).toContain("spark-ui-theme");
  });

  it("uses custom storageKey", () => {
    const { container } = render(<ThemeScript storageKey="my-theme" />);
    const content = getScriptContent(container);
    expect(content).toContain("my-theme");
  });

  it("uses default attribute 'data-theme'", () => {
    const { container } = render(<ThemeScript />);
    const content = getScriptContent(container);
    expect(content).toContain("data-theme");
  });

  it("uses custom attribute", () => {
    const { container } = render(<ThemeScript attribute="data-mode" />);
    const content = getScriptContent(container);
    expect(content).toContain("data-mode");
  });

  it("uses default theme 'system' when not specified", () => {
    const { container } = render(<ThemeScript />);
    const content = getScriptContent(container);
    expect(content).toContain('"system"');
  });

  it("respects custom defaultTheme", () => {
    const { container } = render(<ThemeScript defaultTheme="dark" />);
    const content = getScriptContent(container);
    expect(content).toContain('"dark"');
  });

  // ---- Script execution behavior ----

  describe("script execution", () => {
    // We evaluate the script in our jsdom environment to validate behavior.
    function executeScript(props: Parameters<typeof ThemeScript>[0] = {}) {
      const { container } = render(<ThemeScript {...props} />);
      const code = getScriptContent(container);
       
      eval(code);
    }

    it("sets attribute to 'light' when stored theme is 'light'", () => {
      localStorage.setItem("spark-ui-theme", "light");
      executeScript();
      expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    });

    it("sets attribute to 'dark' when stored theme is 'dark'", () => {
      localStorage.setItem("spark-ui-theme", "dark");
      executeScript();
      expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    });

    it("resolves 'system' to matchMedia preference (dark)", () => {
      localStorage.setItem("spark-ui-theme", "system");
      vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({
        matches: true,
        media: "(prefers-color-scheme:dark)",
      }));

      executeScript();
      expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

      vi.unstubAllGlobals();
    });

    it("resolves 'system' to matchMedia preference (light)", () => {
      localStorage.setItem("spark-ui-theme", "system");
      vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({
        matches: false,
        media: "(prefers-color-scheme:dark)",
      }));

      executeScript();
      expect(document.documentElement.getAttribute("data-theme")).toBe("light");

      vi.unstubAllGlobals();
    });

    it("falls back to defaultTheme when nothing is stored", () => {
      // defaultTheme='dark' → stored value will be 'dark' since no localStorage value
      executeScript({ defaultTheme: "dark" });
      expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    });

    it("falls back to system resolution when defaultTheme is 'system' and nothing stored", () => {
      vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({
        matches: true,
        media: "(prefers-color-scheme:dark)",
      }));

      executeScript({ defaultTheme: "system" });
      expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

      vi.unstubAllGlobals();
    });

    it("uses custom attribute when setting theme", () => {
      localStorage.setItem("custom-key", "dark");
      executeScript({ storageKey: "custom-key", attribute: "data-mode" });
      expect(document.documentElement.getAttribute("data-mode")).toBe("dark");
    });

    it("does not throw when localStorage is unavailable", () => {
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("SecurityError");
      });

      expect(() => executeScript()).not.toThrow();

      vi.restoreAllMocks();
    });

    it("handles unknown stored values by resolving via system preference", () => {
      localStorage.setItem("spark-ui-theme", "garbage-value");
      vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({
        matches: false,
        media: "(prefers-color-scheme:dark)",
      }));

      executeScript();
      // "garbage-value" is not "light" or "dark" → falls through to matchMedia
      expect(document.documentElement.getAttribute("data-theme")).toBe("light");

      vi.unstubAllGlobals();
    });
  });

  // ---- displayName ----

  it("has displayName set", () => {
    expect(ThemeScript.displayName).toBe("ThemeScript");
  });

  // ---- Script is synchronous (no async/await) ----

  it("does not contain async or await keywords", () => {
    const { container } = render(<ThemeScript />);
    const content = getScriptContent(container);
    expect(content).not.toContain("async");
    expect(content).not.toContain("await");
  });
});

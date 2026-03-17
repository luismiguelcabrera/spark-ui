import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ThemeProvider, useTheme } from "../theme-provider";

// jsdom doesn't implement matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

function ThemeDisplay() {
  const { theme, resolvedTheme, setTheme, colors, setColors } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <span data-testid="primary">{colors.primary ?? "none"}</span>
      <button onClick={() => setTheme("dark")}>Dark</button>
      <button onClick={() => setColors({ primary: "#ff0000" })}>Red</button>
    </div>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("light", "dark");
  });

  it("provides default system theme", () => {
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("theme").textContent).toBe("system");
  });

  it("allows setting theme", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>,
    );
    await user.click(screen.getByText("Dark"));
    expect(screen.getByTestId("theme").textContent).toBe("dark");
    expect(screen.getByTestId("resolved").textContent).toBe("dark");
  });

  it("persists theme to localStorage", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider storageKey="test-theme">
        <ThemeDisplay />
      </ThemeProvider>,
    );
    await user.click(screen.getByText("Dark"));
    expect(localStorage.getItem("test-theme")).toBe("dark");
  });

  it("applies color overrides via props", () => {
    const { container } = render(
      <ThemeProvider colors={{ primary: "#e11d48" }}>
        <ThemeDisplay />
      </ThemeProvider>,
    );
    const wrapper = container.querySelector("[style]") as HTMLElement;
    expect(wrapper?.style.getPropertyValue("--color-primary")).toBe("#e11d48");
  });

  it("applies runtime color overrides via setColors", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>,
    );
    await user.click(screen.getByText("Red"));
    expect(screen.getByTestId("primary").textContent).toBe("#ff0000");
  });

  it("does not wrap in div when no color overrides", () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>,
    );
    expect(container.querySelector("[style]")).toBeNull();
  });

  it("throws when useTheme is used outside provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<ThemeDisplay />)).toThrow(
      "useTheme must be used within <ThemeProvider>",
    );
    spy.mockRestore();
  });
});

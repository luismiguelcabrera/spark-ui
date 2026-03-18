import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Snippet } from "../snippet";

describe("Snippet", () => {
  it("renders without crashing", () => {
    const { container } = render(<Snippet>npm install react</Snippet>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Snippet ref={ref}>npm install</Snippet>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies className", () => {
    const { container } = render(
      <Snippet className="custom-snippet">npm install</Snippet>,
    );
    expect(container.firstChild).toHaveClass("custom-snippet");
  });

  // ── Content ─────────────────────────────────────────────────────────

  it("renders the code string", () => {
    render(<Snippet>npm install react</Snippet>);
    expect(screen.getByText("npm install react")).toBeInTheDocument();
  });

  it("renders inside a code element", () => {
    const { container } = render(<Snippet>npm install</Snippet>);
    const code = container.querySelector("code");
    expect(code).toBeInTheDocument();
  });

  // ── Symbol ──────────────────────────────────────────────────────────

  it("shows $ symbol by default", () => {
    render(<Snippet>npm install</Snippet>);
    expect(screen.getByText("$")).toBeInTheDocument();
  });

  it("uses custom symbol", () => {
    render(<Snippet symbol=">">{`echo hello`}</Snippet>);
    expect(screen.getByText(">")).toBeInTheDocument();
  });

  it("hides symbol when hideSymbol is true", () => {
    render(<Snippet hideSymbol>npm install</Snippet>);
    expect(screen.queryByText("$")).not.toBeInTheDocument();
  });

  it("symbol is aria-hidden", () => {
    const { container } = render(<Snippet>npm install</Snippet>);
    const symbolSpan = container.querySelector("[aria-hidden='true']");
    expect(symbolSpan).toBeInTheDocument();
    expect(symbolSpan?.textContent).toBe("$");
  });

  it("symbol has select-none class (not selectable)", () => {
    const { container } = render(<Snippet>npm install</Snippet>);
    const symbolSpan = container.querySelector("[aria-hidden='true']");
    expect(symbolSpan).toHaveClass("select-none");
  });

  // ── Color ───────────────────────────────────────────────────────────

  it.each([
    ["default", "bg-slate-100"],
    ["primary", "bg-primary/10"],
    ["secondary", "bg-secondary/10"],
    ["success", "bg-green-50"],
    ["warning", "bg-amber-50"],
    ["danger", "bg-red-50"],
  ] as const)("applies correct background for color=%s", (color, expectedClass) => {
    const { container } = render(
      <Snippet color={color}>npm install</Snippet>,
    );
    expect(container.firstChild).toHaveClass(expectedClass);
  });

  it("uses default color when color prop is not provided", () => {
    const { container } = render(<Snippet>npm install</Snippet>);
    expect(container.firstChild).toHaveClass("bg-slate-100");
  });

  // ── Copy button ─────────────────────────────────────────────────────

  it("renders copy button by default", () => {
    render(<Snippet>npm install</Snippet>);
    expect(
      screen.getByRole("button", { name: "Copy to clipboard" }),
    ).toBeInTheDocument();
  });

  it("hides copy button when hideCopyButton is true", () => {
    render(<Snippet hideCopyButton>npm install</Snippet>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("copy button has type=button", () => {
    render(<Snippet>npm install</Snippet>);
    const btn = screen.getByRole("button", { name: "Copy to clipboard" });
    expect(btn).toHaveAttribute("type", "button");
  });

  it("copy button has focus-visible ring classes", () => {
    render(<Snippet>npm install</Snippet>);
    const btn = screen.getByRole("button", { name: "Copy to clipboard" });
    expect(btn).toHaveClass("focus-visible:ring-2");
  });

  it("copy button has an SVG icon", () => {
    render(<Snippet>npm install</Snippet>);
    const btn = screen.getByRole("button", { name: "Copy to clipboard" });
    const svg = btn.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  // ── Copy functionality ──────────────────────────────────────────────

  it("calls navigator.clipboard.writeText on copy click", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText },
    });

    render(<Snippet>npm install react</Snippet>);
    const btn = screen.getByRole("button", { name: "Copy to clipboard" });
    fireEvent.click(btn);

    expect(writeText).toHaveBeenCalledWith("npm install react");
  });

  it("changes aria-label to 'Copied' after successful copy", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText },
    });

    render(<Snippet>npm install</Snippet>);
    const btn = screen.getByRole("button", { name: "Copy to clipboard" });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Copied" }),
      ).toBeInTheDocument();
    });
  });

  it("reverts aria-label back after timeout", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText },
    });

    render(<Snippet>npm install</Snippet>);
    const btn = screen.getByRole("button", { name: "Copy to clipboard" });
    fireEvent.click(btn);

    // Wait for the copied state
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Copied" }),
      ).toBeInTheDocument();
    });

    // Wait for the 2-second revert timeout
    await waitFor(
      () => {
        expect(
          screen.getByRole("button", { name: "Copy to clipboard" }),
        ).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it("handles clipboard API failure gracefully", () => {
    const writeText = vi.fn().mockRejectedValue(new Error("Not allowed"));
    Object.assign(navigator, {
      clipboard: { writeText },
    });

    render(<Snippet>npm install</Snippet>);
    const btn = screen.getByRole("button", { name: "Copy to clipboard" });

    // Should not throw
    expect(() => fireEvent.click(btn)).not.toThrow();
  });

  // ── Layout ──────────────────────────────────────────────────────────

  it("has font-mono class for monospace text", () => {
    const { container } = render(<Snippet>npm install</Snippet>);
    expect(container.firstChild).toHaveClass("font-mono");
  });

  it("has rounded-lg border", () => {
    const { container } = render(<Snippet>npm install</Snippet>);
    expect(container.firstChild).toHaveClass("rounded-lg");
    expect(container.firstChild).toHaveClass("border");
  });

  // ── Extra props ─────────────────────────────────────────────────────

  it("spreads extra HTML attributes", () => {
    render(<Snippet data-testid="my-snippet">npm install</Snippet>);
    expect(screen.getByTestId("my-snippet")).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Icon } from "../icon";

describe("Icon", () => {
  it("renders without error", () => {
    render(<Icon name="home" data-testid="icon" />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("has displayName", () => {
    expect(Icon.displayName).toBe("Icon");
  });

  it("is aria-hidden by default", () => {
    render(<Icon name="home" data-testid="icon" />);
    expect(screen.getByTestId("icon")).toHaveAttribute("aria-hidden", "true");
  });

  it("allows overriding aria-hidden", () => {
    render(<Icon name="home" data-testid="icon" aria-hidden={false} />);
    expect(screen.getByTestId("icon")).toHaveAttribute("aria-hidden", "false");
  });

  it("merges className", () => {
    render(<Icon name="home" data-testid="icon" className="custom-icon" />);
    const el = screen.getByTestId("icon");
    // SVG elements use getAttribute("class") instead of className (which is SVGAnimatedString)
    expect(el.getAttribute("class")).toContain("custom-icon");
  });

  it("renders built-in SVG icon from registry", () => {
    // "home" should be in the built-in registry
    render(<Icon name="home" data-testid="icon" />);
    const el = screen.getByTestId("icon");
    // Built-in icon renders as SVG
    expect(el.tagName.toLowerCase()).toBe("svg");
  });

  it("falls back to Material Symbols font for unknown names", () => {
    render(<Icon name="totally_unknown_icon_xyz" data-testid="icon" />);
    const el = screen.getByTestId("icon");
    // Font fallback renders as a span with the icon name as text
    expect(el.tagName).toBe("SPAN");
    expect(el.textContent).toBe("totally_unknown_icon_xyz");
    expect(el.className).toContain("material-symbols-outlined");
  });

  it("applies filled class for font fallback when filled=true", () => {
    render(<Icon name="totally_unknown_icon_xyz" filled data-testid="icon" />);
    const el = screen.getByTestId("icon");
    expect(el.className).toContain("icon-filled");
  });

  it.each(["sm", "md", "lg", "xl"] as const)(
    "renders size=%s without error",
    (size) => {
      render(<Icon name="home" size={size} data-testid={`icon-${size}`} />);
      expect(screen.getByTestId(`icon-${size}`)).toBeInTheDocument();
    }
  );

  it("applies correct font size class for font fallback", () => {
    render(<Icon name="totally_unknown_font" size="lg" data-testid="icon" />);
    const el = screen.getByTestId("icon");
    expect(el.className).toContain("text-[24px]");
  });

  it("applies shrink-0 class", () => {
    render(<Icon name="home" data-testid="icon" />);
    const el = screen.getByTestId("icon");
    // SVG elements use getAttribute("class") instead of className
    expect(el.getAttribute("class")).toContain("shrink-0");
  });

  it("passes through additional HTML attributes", () => {
    render(<Icon name="home" data-testid="icon" role="img" />);
    const el = screen.getByTestId("icon");
    expect(el).toHaveAttribute("role", "img");
  });
});

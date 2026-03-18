import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Badge } from "../badge";

describe("Badge", () => {
  it("renders text content", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    render(<Badge variant="success">OK</Badge>);
    expect(screen.getByText("OK").className).toContain("green");
  });

  it("applies size classes", () => {
    render(<Badge size="lg">Big</Badge>);
    expect(screen.getByText("Big").className).toContain("text-sm");
  });

  it("merges custom className", () => {
    render(<Badge className="custom-class">Test</Badge>);
    expect(screen.getByText("Test").className).toContain("custom-class");
  });

  it("renders as a span element", () => {
    render(<Badge>Tag</Badge>);
    const el = screen.getByText("Tag");
    expect(el.tagName).toBe("SPAN");
  });

  it("applies default variant classes", () => {
    render(<Badge>Default</Badge>);
    const el = screen.getByText("Default");
    expect(el.className).toContain("bg-gray-100");
  });

  it.each(["primary", "success", "warning", "danger", "info"] as const)(
    "renders variant=%s without error",
    (variant) => {
      render(<Badge variant={variant}>V</Badge>);
      expect(screen.getByText("V")).toBeInTheDocument();
    },
  );

  it.each(["sm", "md", "lg"] as const)(
    "renders size=%s without error",
    (size) => {
      render(<Badge size={size}>S</Badge>);
      expect(screen.getByText("S")).toBeInTheDocument();
    },
  );

  // --- Ref forwarding ---
  it("forwards ref", () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(<Badge ref={ref}>Ref</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});

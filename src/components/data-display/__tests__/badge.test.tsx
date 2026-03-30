import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Badge, type BadgeColor, type BadgeVariant } from "../badge";

const colors: BadgeColor[] = [
  "default",
  "primary",
  "secondary",
  "accent",
  "success",
  "warning",
  "danger",
  "info",
];

const variants: BadgeVariant[] = [
  "elevated",
  "flat",
  "tonal",
  "outlined",
  "text",
  "plain",
];

describe("Badge", () => {
  it("renders text content", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("applies default tonal + default color", () => {
    render(<Badge>Default</Badge>);
    const el = screen.getByText("Default");
    expect(el.className).toContain("bg-muted");
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
    expect(screen.getByText("Tag").tagName).toBe("SPAN");
  });

  // --- Color × Variant matrix ---

  it.each(colors)("renders color=%s without error", (color) => {
    render(<Badge color={color}>C</Badge>);
    expect(screen.getByText("C")).toBeInTheDocument();
  });

  it.each(variants)("renders variant=%s without error", (variant) => {
    render(<Badge variant={variant}>V</Badge>);
    expect(screen.getByText("V")).toBeInTheDocument();
  });

  it.each(["xs", "sm", "md", "lg", "xl"] as const)(
    "renders size=%s without error",
    (size) => {
      render(<Badge size={size}>S</Badge>);
      expect(screen.getByText("S")).toBeInTheDocument();
    },
  );

  // --- Bordered ---

  it("applies ring class when bordered", () => {
    render(<Badge bordered>Bordered</Badge>);
    expect(screen.getByText("Bordered").className).toContain("ring-2");
  });

  // --- Floating ---

  it("renders floating badge with content", () => {
    render(
      <Badge floating content="5" color="danger">
        <span>Avatar</span>
      </Badge>,
    );
    expect(screen.getByText("Avatar")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders floating dot", () => {
    const { container } = render(
      <Badge floating dot color="success">
        <span>Avatar</span>
      </Badge>,
    );
    expect(screen.getByText("Avatar")).toBeInTheDocument();
    const dots = container.querySelectorAll(".bg-success");
    expect(dots.length).toBeGreaterThan(0);
  });

  // --- Max ---

  it("caps content at max", () => {
    render(
      <Badge max={99} color="danger">
        150
      </Badge>,
    );
    expect(screen.getByText("99+")).toBeInTheDocument();
  });

  it("shows original when under max", () => {
    render(
      <Badge max={99} color="danger">
        50
      </Badge>,
    );
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  // --- Ref forwarding ---

  it("forwards ref", () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(<Badge ref={ref}>Ref</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});

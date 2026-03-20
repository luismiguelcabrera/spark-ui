import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatusDot } from "../status-dot";

describe("StatusDot", () => {
  it("renders without error", () => {
    const { container } = render(<StatusDot />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders as a span with role=status", () => {
    const { container } = render(<StatusDot />);
    const el = container.querySelector("[role='status']");
    expect(el).toBeInTheDocument();
    expect(el!.tagName).toBe("SPAN");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(<StatusDot ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("has correct displayName", () => {
    expect(StatusDot.displayName).toBe("StatusDot");
  });

  it("merges custom className", () => {
    const { container } = render(<StatusDot className="custom-class" />);
    const el = container.querySelector("[role='status']");
    expect(el!.className).toContain("custom-class");
  });

  it.each(["green", "amber", "red", "blue", "slate"] as const)(
    "renders with color=%s without error",
    (color) => {
      const { container } = render(<StatusDot color={color} />);
      expect(container.querySelector("[role='status']")).toBeInTheDocument();
    },
  );

  it.each(["sm", "md"] as const)(
    "renders with size=%s without error",
    (size) => {
      const { container } = render(<StatusDot size={size} />);
      expect(container.querySelector("[role='status']")).toBeInTheDocument();
    },
  );

  it("renders with pulse animation", () => {
    const { container } = render(<StatusDot pulse />);
    const el = container.querySelector("[role='status']");
    expect(el).toBeInTheDocument();
    // Pulse variant renders an additional animated span
    expect(el!.querySelectorAll("span").length).toBe(2);
  });

  it("forwards ref when pulse is true", () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(<StatusDot ref={ref} pulse />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("applies default green color", () => {
    const { container } = render(<StatusDot />);
    const el = container.querySelector("[role='status']");
    expect(el!.className).toContain("success");
  });
});

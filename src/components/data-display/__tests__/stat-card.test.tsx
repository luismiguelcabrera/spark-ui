import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatCard } from "../stat-card";

describe("StatCard", () => {
  const defaultProps = {
    icon: "chart",
    label: "Revenue",
    value: "$12,345",
  };

  it("renders label and value", () => {
    render(<StatCard {...defaultProps} />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$12,345")).toBeInTheDocument();
  });

  it("renders without error with required props", () => {
    const { container } = render(<StatCard {...defaultProps} />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<StatCard ref={ref} {...defaultProps} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has correct displayName", () => {
    expect(StatCard.displayName).toBe("StatCard");
  });

  it("merges custom className", () => {
    const { container } = render(<StatCard {...defaultProps} className="custom-class" />);
    expect(container.firstElementChild!.className).toContain("custom-class");
  });

  it("renders change text when provided", () => {
    render(<StatCard {...defaultProps} change="+12%" />);
    expect(screen.getByText("+12%")).toBeInTheDocument();
  });

  it("does not render change when not provided", () => {
    const { container } = render(<StatCard {...defaultProps} />);
    // Only label and value should be present
    expect(container.querySelectorAll("p").length).toBe(2);
  });

  it("renders with numeric value", () => {
    render(<StatCard icon="users" label="Users" value={1000} />);
    expect(screen.getByText("1000")).toBeInTheDocument();
  });
});

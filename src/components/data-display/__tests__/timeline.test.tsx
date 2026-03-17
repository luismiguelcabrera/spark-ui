import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Timeline } from "../timeline";

describe("Timeline", () => {
  const items = [
    { title: "Step 1", description: "First step", date: "Jan 1" },
    { title: "Step 2", description: "Second step", date: "Jan 2", active: true },
    { title: "Step 3", description: "Third step", date: "Jan 3" },
  ];

  it("renders all timeline items", () => {
    render(<Timeline items={items} />);
    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByText("Step 2")).toBeInTheDocument();
    expect(screen.getByText("Step 3")).toBeInTheDocument();
  });

  it("shows dates", () => {
    render(<Timeline items={items} />);
    expect(screen.getByText("Jan 1")).toBeInTheDocument();
  });

  it("shows descriptions", () => {
    render(<Timeline items={items} />);
    expect(screen.getByText("First step")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<Timeline items={items} className="custom" />);
    expect(container.firstChild).toHaveClass("custom");
  });
});

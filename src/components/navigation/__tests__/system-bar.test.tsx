import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { SystemBar } from "../system-bar";

describe("SystemBar", () => {
  it("renders a div with role=banner", () => {
    render(<SystemBar data-testid="bar" />);
    const el = screen.getByTestId("bar");
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveAttribute("role", "banner");
  });

  it("renders children", () => {
    render(<SystemBar>12:00 PM</SystemBar>);
    expect(screen.getByText("12:00 PM")).toBeInTheDocument();
  });

  it("uses default height of 24px", () => {
    render(<SystemBar data-testid="bar" />);
    expect(screen.getByTestId("bar").style.height).toBe("24px");
  });

  it("applies custom height", () => {
    render(<SystemBar height={30} data-testid="bar" />);
    expect(screen.getByTestId("bar").style.height).toBe("30px");
  });

  it("uses taller height when window=true", () => {
    render(<SystemBar window data-testid="bar" />);
    expect(screen.getByTestId("bar").style.height).toBe("32px");
  });

  it("window=true overrides custom height", () => {
    render(<SystemBar window height={10} data-testid="bar" />);
    expect(screen.getByTestId("bar").style.height).toBe("32px");
  });

  it("applies default color class", () => {
    render(<SystemBar data-testid="bar" />);
    expect(screen.getByTestId("bar").className).toContain("bg-background-dark");
  });

  it("applies custom color class", () => {
    render(<SystemBar color="bg-blue-600" data-testid="bar" />);
    const el = screen.getByTestId("bar");
    expect(el.className).toContain("bg-blue-600");
  });

  it("merges custom className", () => {
    render(<SystemBar className="custom" data-testid="bar" />);
    expect(screen.getByTestId("bar").className).toContain("custom");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<SystemBar ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads extra HTML attributes", () => {
    render(<SystemBar data-testid="bar" id="status" />);
    expect(screen.getByTestId("bar")).toHaveAttribute("id", "status");
  });
});

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Label } from "../label";

describe("Label", () => {
  it("renders text content", () => {
    render(<Label>Email</Label>);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders as a <label> element", () => {
    render(<Label>Name</Label>);
    expect(screen.getByText("Name").tagName).toBe("LABEL");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Label ref={ref}>Ref test</Label>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLLabelElement));
  });

  it("has displayName", () => {
    expect(Label.displayName).toBe("Label");
  });

  it("merges className", () => {
    render(<Label className="custom-class">Test</Label>);
    expect(screen.getByText("Test")).toHaveClass("custom-class");
  });

  it("passes htmlFor", () => {
    render(<Label htmlFor="email-input">Email</Label>);
    expect(screen.getByText("Email")).toHaveAttribute("for", "email-input");
  });

  it("has block display", () => {
    render(<Label>Name</Label>);
    expect(screen.getByText("Name")).toHaveClass("block");
  });
});

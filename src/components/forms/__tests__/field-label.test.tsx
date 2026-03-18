import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FieldLabel } from "../field-label";

describe("FieldLabel", () => {
  it("renders a label element", () => {
    render(<FieldLabel>Username</FieldLabel>);
    expect(screen.getByText("Username").tagName).toBe("LABEL");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLLabelElement | null };
    render(<FieldLabel ref={ref}>Name</FieldLabel>);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });

  it("has displayName", () => {
    expect(FieldLabel.displayName).toBe("FieldLabel");
  });

  it("merges className", () => {
    render(<FieldLabel className="custom-class">Name</FieldLabel>);
    expect(screen.getByText("Name")).toHaveClass("custom-class");
  });

  it("shows required asterisk when required", () => {
    render(<FieldLabel required>Email</FieldLabel>);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("hides asterisk from screen readers", () => {
    render(<FieldLabel required>Email</FieldLabel>);
    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
  });

  it("does not show asterisk when not required", () => {
    render(<FieldLabel>Email</FieldLabel>);
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("passes htmlFor attribute", () => {
    render(<FieldLabel htmlFor="email-input">Email</FieldLabel>);
    expect(screen.getByText("Email")).toHaveAttribute("for", "email-input");
  });

  it("has default text styling", () => {
    render(<FieldLabel>Name</FieldLabel>);
    const label = screen.getByText("Name");
    expect(label.className).toContain("text-sm");
    expect(label.className).toContain("font-medium");
  });
});

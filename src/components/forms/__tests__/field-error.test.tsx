import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FieldError } from "../field-error";

describe("FieldError", () => {
  it("renders error message with role='alert'", () => {
    render(<FieldError>This field is required</FieldError>);
    const el = screen.getByRole("alert");
    expect(el).toHaveTextContent("This field is required");
  });

  it("renders as a <p> element", () => {
    render(<FieldError>Error msg</FieldError>);
    expect(screen.getByRole("alert").tagName).toBe("P");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLParagraphElement | null };
    render(<FieldError ref={ref}>Error</FieldError>);
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });

  it("has displayName", () => {
    expect(FieldError.displayName).toBe("FieldError");
  });

  it("merges className", () => {
    render(<FieldError className="custom-error">Error</FieldError>);
    expect(screen.getByRole("alert")).toHaveClass("custom-error");
  });

  it("renders nothing when children is undefined", () => {
    const { container } = render(<FieldError>{undefined}</FieldError>);
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when children is null", () => {
    const { container } = render(<FieldError>{null}</FieldError>);
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when children is empty string", () => {
    const { container } = render(<FieldError>{""}</FieldError>);
    expect(container.innerHTML).toBe("");
  });

  it("has default error styling", () => {
    render(<FieldError>Error</FieldError>);
    const el = screen.getByRole("alert");
    expect(el.className).toContain("text-xs");
    expect(el.className).toContain("text-destructive");
  });
});

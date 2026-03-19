import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FieldLabel } from "../field-label";
import { FieldDescription } from "../field-description";
import { FieldError } from "../field-error";

describe("FieldLabel", () => {
  it("renders a label element", () => {
    render(<FieldLabel>Username</FieldLabel>);
    expect(screen.getByText("Username").tagName).toBe("LABEL");
  });

  it("shows required asterisk when required", () => {
    render(<FieldLabel required>Email</FieldLabel>);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("does not show asterisk when not required", () => {
    render(<FieldLabel>Email</FieldLabel>);
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("applies htmlFor", () => {
    render(<FieldLabel htmlFor="email-input">Email</FieldLabel>);
    expect(screen.getByText("Email")).toHaveAttribute("for", "email-input");
  });

  it("accepts className", () => {
    render(<FieldLabel className="custom-class">Name</FieldLabel>);
    expect(screen.getByText("Name")).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = { current: null } as React.RefObject<HTMLLabelElement | null>;
    render(<FieldLabel ref={ref}>Name</FieldLabel>);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });

  it("has default text styling", () => {
    render(<FieldLabel>Name</FieldLabel>);
    const label = screen.getByText("Name");
    expect(label.className).toContain("text-sm");
    expect(label.className).toContain("font-medium");
  });
});

describe("FieldDescription", () => {
  it("renders helper text", () => {
    render(<FieldDescription>Enter your email address</FieldDescription>);
    expect(screen.getByText("Enter your email address")).toBeInTheDocument();
  });

  it("renders as a paragraph", () => {
    render(<FieldDescription>Help text</FieldDescription>);
    expect(screen.getByText("Help text").tagName).toBe("P");
  });

  it("accepts className", () => {
    render(
      <FieldDescription className="custom-desc">Help</FieldDescription>,
    );
    expect(screen.getByText("Help")).toHaveClass("custom-desc");
  });

  it("forwards ref", () => {
    const ref = { current: null } as React.RefObject<HTMLParagraphElement | null>;
    render(<FieldDescription ref={ref}>Help</FieldDescription>);
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });

  it("has default styling", () => {
    render(<FieldDescription>Help</FieldDescription>);
    const el = screen.getByText("Help");
    expect(el.className).toContain("text-xs");
    expect(el.className).toContain("text-gray-600");
  });
});

describe("FieldError", () => {
  it("renders error message with role=alert", () => {
    render(<FieldError>This field is required</FieldError>);
    const el = screen.getByRole("alert");
    expect(el).toHaveTextContent("This field is required");
  });

  it("renders nothing when children is falsy (undefined)", () => {
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

  it("accepts className", () => {
    render(<FieldError className="custom-error">Error</FieldError>);
    expect(screen.getByRole("alert")).toHaveClass("custom-error");
  });

  it("forwards ref", () => {
    const ref = { current: null } as React.RefObject<HTMLParagraphElement | null>;
    render(<FieldError ref={ref}>Error</FieldError>);
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });

  it("has default error styling", () => {
    render(<FieldError>Error</FieldError>);
    const el = screen.getByRole("alert");
    expect(el.className).toContain("text-xs");
    expect(el.className).toContain("text-red-600");
  });

  it("renders as a paragraph element", () => {
    render(<FieldError>Error msg</FieldError>);
    expect(screen.getByRole("alert").tagName).toBe("P");
  });
});

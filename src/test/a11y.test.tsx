import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { describe, it, expect } from "vitest";
import { FieldLabel } from "../components/forms/field-label";
import { FieldDescription } from "../components/forms/field-description";
import { FieldError } from "../components/forms/field-error";

expect.extend(toHaveNoViolations);

describe("Accessibility (axe) — Field Primitives", () => {
  it("FieldLabel (default)", async () => {
    const { container } = render(<FieldLabel>Email</FieldLabel>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("FieldLabel (required)", async () => {
    const { container } = render(
      <FieldLabel required htmlFor="email">
        Email
      </FieldLabel>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("FieldLabel + input combo", async () => {
    const { container } = render(
      <div>
        <FieldLabel htmlFor="name-input">Name</FieldLabel>
        <input id="name-input" type="text" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("FieldDescription", async () => {
    const { container } = render(
      <FieldDescription>Helper text for the field</FieldDescription>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("FieldError (with message)", async () => {
    const { container } = render(
      <FieldError>This field is required</FieldError>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("FieldError (empty — renders nothing)", async () => {
    const { container } = render(<FieldError>{null}</FieldError>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Full field group (label + input + description + error)", async () => {
    const { container } = render(
      <div>
        <FieldLabel htmlFor="email-field" required>
          Email
        </FieldLabel>
        <input id="email-field" type="email" aria-describedby="email-desc email-err" />
        <FieldDescription id="email-desc">Enter your email</FieldDescription>
        <FieldError id="email-err">Invalid email address</FieldError>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

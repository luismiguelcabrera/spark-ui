import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FormField } from "../form-field";

describe("FormField", () => {
  it("renders label and input", () => {
    render(<FormField label="Email" placeholder="Enter email" />);
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
  });

  it("has displayName", () => {
    expect(FormField.displayName).toBe("FormField");
  });

  it("merges className", () => {
    const { container } = render(<FormField label="Name" className="custom" />);
    expect(container.firstChild).toHaveClass("custom");
  });

  it("shows error message", () => {
    render(<FormField label="Email" error="Required" />);
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("shows hint when no error", () => {
    render(
      <FormField label="Email" hint="We will never share your email">
        <input id="email" />
      </FormField>,
    );
    expect(screen.getByText("We will never share your email")).toBeInTheDocument();
  });

  it("hides hint when error is present", () => {
    render(
      <FormField label="Email" error="Required" hint="Hint text">
        <input id="email" />
      </FormField>,
    );
    expect(screen.queryByText("Hint text")).not.toBeInTheDocument();
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("wraps custom children with label", () => {
    render(
      <FormField label="Custom">
        <select>
          <option>Choose</option>
        </select>
      </FormField>,
    );
    expect(screen.getByText("Custom")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("error has role='alert'", () => {
    render(
      <FormField label="Email" error="Required">
        <input id="email" />
      </FormField>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });
});

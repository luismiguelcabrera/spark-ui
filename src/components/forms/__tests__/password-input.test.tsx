import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { PasswordInput } from "../password-input";

describe("PasswordInput", () => {
  it("renders a password input", () => {
    render(<PasswordInput placeholder="Password" />);
    expect(screen.getByPlaceholderText("Password")).toHaveAttribute("type", "password");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<PasswordInput ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

  it("has displayName", () => {
    expect(PasswordInput.displayName).toBe("PasswordInput");
  });

  it("merges className", () => {
    render(<PasswordInput className="custom" placeholder="pw" />);
    expect(screen.getByPlaceholderText("pw")).toHaveClass("custom");
  });

  it("shows toggle visibility button", () => {
    render(<PasswordInput />);
    expect(screen.getByRole("button", { name: "Show password" })).toBeInTheDocument();
  });

  it("toggles password visibility on button click", async () => {
    const user = userEvent.setup();
    render(<PasswordInput placeholder="Password" />);
    const input = screen.getByPlaceholderText("Password");
    expect(input).toHaveAttribute("type", "password");

    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Hide password" })).toBeInTheDocument();
  });

  it("displays error message", () => {
    render(<PasswordInput error="Password is too short" />);
    expect(screen.getByText("Password is too short")).toBeInTheDocument();
  });

  it("error has role='alert'", () => {
    render(<PasswordInput error="Too short" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Too short");
  });

  it("sets aria-invalid when error is present", () => {
    render(<PasswordInput error="Required" placeholder="pw" />);
    expect(screen.getByPlaceholderText("pw")).toHaveAttribute("aria-invalid", "true");
  });

  it("supports disabled state", () => {
    render(<PasswordInput disabled placeholder="disabled" />);
    expect(screen.getByPlaceholderText("disabled")).toBeDisabled();
  });
});

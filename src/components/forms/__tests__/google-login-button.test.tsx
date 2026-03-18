import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { GoogleLoginButton } from "../google-login-button";

describe("GoogleLoginButton", () => {
  it("renders with default label", () => {
    render(<GoogleLoginButton />);
    expect(screen.getByRole("button", { name: /continue with google/i })).toBeInTheDocument();
  });

  it("renders with custom label", () => {
    render(<GoogleLoginButton label="Sign in with Google" />);
    expect(screen.getByRole("button", { name: /sign in with google/i })).toBeInTheDocument();
  });

  it("has type='button'", () => {
    render(<GoogleLoginButton />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<GoogleLoginButton ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it("has displayName", () => {
    expect(GoogleLoginButton.displayName).toBe("GoogleLoginButton");
  });

  it("merges className", () => {
    render(<GoogleLoginButton className="custom" />);
    expect(screen.getByRole("button")).toHaveClass("custom");
  });

  it("fires onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<GoogleLoginButton onClick={onClick} />);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("supports disabled state", () => {
    render(<GoogleLoginButton disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("renders Google SVG icon", () => {
    const { container } = render(<GoogleLoginButton />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});

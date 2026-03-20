import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { PasswordStrength } from "../password-strength";

describe("PasswordStrength", () => {
  it("renders a password input", () => {
    render(<PasswordStrength placeholder="Enter password" />);
    const input = screen.getByPlaceholderText("Enter password");
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe("INPUT");
  });

  it("shows strength bar when password is not empty", async () => {
    const user = userEvent.setup();
    render(<PasswordStrength placeholder="pw" />);
    await user.type(screen.getByPlaceholderText("pw"), "a");
    expect(screen.getByRole("meter")).toBeInTheDocument();
  });

  it("hides strength bar when password is empty", () => {
    render(<PasswordStrength placeholder="pw" />);
    expect(screen.queryByRole("meter")).not.toBeInTheDocument();
  });

  it("shows rules checklist by default", async () => {
    const user = userEvent.setup();
    render(<PasswordStrength placeholder="pw" />);
    await user.type(screen.getByPlaceholderText("pw"), "a");
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText("At least 8 characters")).toBeInTheDocument();
    expect(screen.getByText("One uppercase letter")).toBeInTheDocument();
    expect(screen.getByText("One lowercase letter")).toBeInTheDocument();
    expect(screen.getByText("One number")).toBeInTheDocument();
    expect(screen.getByText("One special character")).toBeInTheDocument();
  });

  it("hides rules when hideRules is true", async () => {
    const user = userEvent.setup();
    render(<PasswordStrength placeholder="pw" hideRules />);
    await user.type(screen.getByPlaceholderText("pw"), "a");
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("hides strength bar when hideStrengthBar is true", async () => {
    const user = userEvent.setup();
    render(<PasswordStrength placeholder="pw" hideStrengthBar />);
    await user.type(screen.getByPlaceholderText("pw"), "a");
    expect(screen.queryByRole("meter")).not.toBeInTheDocument();
  });

  it("displays error message", () => {
    render(<PasswordStrength error="Password is required" placeholder="pw" />);
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<PasswordStrength ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

  it("has displayName", () => {
    expect(PasswordStrength.displayName).toBe("PasswordStrength");
  });

  it("calls onChange with new value", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<PasswordStrength placeholder="pw" onChange={onChange} />);
    await user.type(screen.getByPlaceholderText("pw"), "abc");
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenLastCalledWith("abc");
  });

  it("shows correct strength for weak password", async () => {
    const user = userEvent.setup();
    render(<PasswordStrength placeholder="pw" />);
    await user.type(screen.getByPlaceholderText("pw"), "a");
    expect(screen.getByText("Weak")).toBeInTheDocument();
  });

  it("shows correct strength for strong password", async () => {
    const user = userEvent.setup();
    render(<PasswordStrength placeholder="pw" />);
    await user.type(screen.getByPlaceholderText("pw"), "MyStr0ng!P");
    // This password passes all 5 rules: length >= 8, uppercase, lowercase, number, special
    expect(screen.getByText("Very strong")).toBeInTheDocument();
  });

  it("shows Fair for 2 passing rules", async () => {
    const user = userEvent.setup();
    render(<PasswordStrength placeholder="pw" />);
    // "aB" passes lowercase and uppercase (2 rules)
    await user.type(screen.getByPlaceholderText("pw"), "aB");
    expect(screen.getByText("Fair")).toBeInTheDocument();
  });

  it("shows Good for 3 passing rules", async () => {
    const user = userEvent.setup();
    render(<PasswordStrength placeholder="pw" />);
    // "aB1" passes lowercase, uppercase, number (3 rules)
    await user.type(screen.getByPlaceholderText("pw"), "aB1");
    expect(screen.getByText("Good")).toBeInTheDocument();
  });

  it("shows Strong for 4 passing rules", async () => {
    const user = userEvent.setup();
    render(<PasswordStrength placeholder="pw" />);
    // "aB1!" passes lowercase, uppercase, number, special (4 rules)
    await user.type(screen.getByPlaceholderText("pw"), "aB1!");
    expect(screen.getByText("Strong")).toBeInTheDocument();
  });

  it("supports disabled state", () => {
    render(
      <PasswordStrength
        disabled
        defaultValue="secret123"
        placeholder="pw"
      />,
    );
    expect(screen.getByPlaceholderText("pw")).toBeDisabled();
  });

  it("marks passing rules with check icon and green text", async () => {
    const user = userEvent.setup();
    render(<PasswordStrength placeholder="pw" />);
    // "a" passes only lowercase rule
    await user.type(screen.getByPlaceholderText("pw"), "a");

    const items = screen.getAllByRole("listitem");
    // The lowercase rule (third default rule) should be passing
    const lowercaseItem = items.find((item) =>
      item.textContent?.includes("One lowercase letter"),
    );
    expect(lowercaseItem).toBeDefined();
    expect(lowercaseItem).toHaveClass("text-success");

    // The uppercase rule should not be passing
    const uppercaseItem = items.find((item) =>
      item.textContent?.includes("One uppercase letter"),
    );
    expect(uppercaseItem).toBeDefined();
    expect(uppercaseItem).toHaveClass("text-muted-foreground");
  });

  it("supports controlled mode", async () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <PasswordStrength value="test" onChange={onChange} placeholder="pw" />,
    );
    expect(screen.getByPlaceholderText("pw")).toHaveValue("test");

    rerender(
      <PasswordStrength
        value="updated"
        onChange={onChange}
        placeholder="pw"
      />,
    );
    expect(screen.getByPlaceholderText("pw")).toHaveValue("updated");
  });

  it("supports custom rules", async () => {
    const user = userEvent.setup();
    const customRules = [
      {
        label: "Must contain 'foo'",
        test: (pw: string) => pw.includes("foo"),
      },
      {
        label: "At least 3 characters",
        test: (pw: string) => pw.length >= 3,
      },
    ];
    render(
      <PasswordStrength placeholder="pw" rules={customRules} />,
    );
    await user.type(screen.getByPlaceholderText("pw"), "foo");
    expect(screen.getByText("Must contain 'foo'")).toBeInTheDocument();
    expect(screen.getByText("At least 3 characters")).toBeInTheDocument();

    // Both rules pass
    const items = screen.getAllByRole("listitem");
    items.forEach((item) => {
      expect(item).toHaveClass("text-success");
    });
  });

  it("has aria-live on strength label for screen reader announcements", async () => {
    const user = userEvent.setup();
    render(<PasswordStrength placeholder="pw" />);
    await user.type(screen.getByPlaceholderText("pw"), "a");
    const strengthLabel = screen.getByText("Weak");
    expect(strengthLabel).toHaveAttribute("aria-live", "polite");
  });

  it("hides rules and strength bar when password is empty", () => {
    render(<PasswordStrength placeholder="pw" />);
    expect(screen.queryByRole("meter")).not.toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});

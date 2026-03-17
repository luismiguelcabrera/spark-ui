import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Button } from "../button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("defaults to type='button'", () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("allows type override", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("fires onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Nope</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled when loading", () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows spinner when loading", () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("sets aria-busy when loading", () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
  });

  it("does not set aria-busy when not loading", () => {
    render(<Button>Submit</Button>);
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-busy");
  });

  // ── Variants (style) ──

  it.each([
    ["solid", "bg-primary"],
    ["outline", "border"],
    ["ghost", "bg-transparent"],
    ["soft", "bg-primary/10"],
    ["link", "underline-offset-4"],
  ] as const)("applies %s variant", (variant, expectedClass) => {
    render(<Button variant={variant}>Test</Button>);
    expect(screen.getByRole("button").className).toContain(expectedClass);
  });

  // ── Colors ──

  it.each([
    ["primary", "solid", "bg-primary"],
    ["destructive", "solid", "bg-red-600"],
    ["success", "solid", "bg-green-600"],
    ["warning", "solid", "bg-amber-500"],
    ["accent", "solid", "bg-accent"],
    ["secondary", "solid", "bg-secondary"],
  ] as const)("applies %s color with solid variant", (color, variant, expectedClass) => {
    render(<Button color={color} variant={variant}>Test</Button>);
    expect(screen.getByRole("button").className).toContain(expectedClass);
  });

  // ── Color × Variant combinations ──

  it("applies destructive + outline", () => {
    render(<Button color="destructive" variant="outline">Delete</Button>);
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("border");
    expect(cls).toContain("text-red-600");
  });

  it("applies success + ghost", () => {
    render(<Button color="success" variant="ghost">OK</Button>);
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("text-green-600");
    expect(cls).toContain("bg-transparent");
  });

  it("applies warning + soft", () => {
    render(<Button color="warning" variant="soft">Warn</Button>);
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("bg-amber-50");
    expect(cls).toContain("text-amber-600");
  });

  it("applies primary + link", () => {
    render(<Button color="primary" variant="link">More</Button>);
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("text-primary");
    expect(cls).toContain("hover:underline");
  });

  // ── Sizes ──

  it.each([
    ["xs", "h-7"],
    ["sm", "h-9"],
    ["md", "h-11"],
    ["lg", "h-12"],
    ["xl", "h-14"],
  ] as const)("applies %s size", (size, expectedClass) => {
    render(<Button size={size}>Test</Button>);
    expect(screen.getByRole("button").className).toContain(expectedClass);
  });

  // ── Rounded ──

  it.each([
    ["default", "rounded-xl"],
    ["full", "rounded-full"],
    ["lg", "rounded-lg"],
    ["md", "rounded-md"],
    ["none", "rounded-none"],
  ] as const)("applies %s rounded shape", (rounded, expectedClass) => {
    render(<Button rounded={rounded}>Test</Button>);
    expect(screen.getByRole("button").className).toContain(expectedClass);
  });

  // ── Features ──

  it("applies fullWidth", () => {
    render(<Button fullWidth>Wide</Button>);
    expect(screen.getByRole("button")).toHaveClass("w-full");
  });

  it("renders custom leftIcon", () => {
    render(<Button leftIcon={<span data-testid="custom-icon">*</span>}>Go</Button>);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("renders custom rightIcon", () => {
    render(<Button rightIcon={<span data-testid="right">→</span>}>Go</Button>);
    expect(screen.getByTestId("right")).toBeInTheDocument();
  });

  it("renders as child element with asChild", () => {
    render(
      <Button asChild variant="solid" color="primary">
        <a href="/home">Home</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Home" });
    expect(link).toBeInTheDocument();
    expect(link.className).toContain("bg-primary");
  });

  // ── Spinner color ──

  it("uses white spinner for solid variant", () => {
    const { container } = render(<Button variant="solid" color="destructive" loading>Delete</Button>);
    const spinner = container.querySelector("[role='status']");
    expect(spinner?.className).toContain("text-white");
  });

  it("uses primary spinner for non-solid variants", () => {
    const { container } = render(<Button variant="outline" loading>Go</Button>);
    const spinner = container.querySelector("[role='status']");
    expect(spinner?.className).toContain("text-primary");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

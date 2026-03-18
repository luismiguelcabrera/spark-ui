import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Button } from "../button";
import { ButtonGroup } from "../button-group";

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

  // ── Focus ring ──

  it("has focus-visible ring classes", () => {
    render(<Button>Focus</Button>);
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("focus-visible:ring-2");
    expect(cls).toContain("focus-visible:ring-offset-2");
  });

  // ── Disabled pointer events ──

  it("disables pointer events when disabled", () => {
    render(<Button disabled>No</Button>);
    expect(screen.getByRole("button").className).toContain("disabled:pointer-events-none");
  });

  // ── Variants (style) ──

  it.each([
    ["primary", "bg-primary"],
    ["outline", "border"],
    ["ghost", "bg-transparent"],
    ["secondary", "bg-secondary"],
    ["link", "underline-offset-4"],
  ] as const)("applies %s variant", (variant, expectedClass) => {
    render(<Button variant={variant}>Test</Button>);
    expect(screen.getByRole("button").className).toContain(expectedClass);
  });

  // ── Variant-specific classes ──

  it("applies primary variant classes", () => {
    render(<Button variant="primary">Test</Button>);
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("bg-primary");
    expect(cls).toContain("text-white");
  });

  it("applies secondary variant classes", () => {
    render(<Button variant="secondary">Test</Button>);
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("bg-secondary");
    expect(cls).toContain("text-white");
  });

  it("applies outline variant classes", () => {
    render(<Button variant="outline">Test</Button>);
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("border");
    expect(cls).toContain("text-gray-600");
  });

  it("applies ghost variant classes", () => {
    render(<Button variant="ghost">Test</Button>);
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("bg-transparent");
    expect(cls).toContain("text-gray-600");
  });

  it("applies icon variant classes", () => {
    render(<Button variant="icon" aria-label="Test">Test</Button>);
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("rounded-full");
  });

  it("applies link variant classes", () => {
    render(<Button variant="link">More</Button>);
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("text-primary");
    expect(cls).toContain("underline-offset-4");
  });

  // ── Sizes ──

  it.each([
    ["sm", "h-9"],
    ["md", "h-11"],
    ["lg", "h-12"],
    ["icon", "h-10"],
  ] as const)("applies %s size", (size, expectedClass) => {
    render(<Button size={size}>Test</Button>);
    expect(screen.getByRole("button").className).toContain(expectedClass);
  });

  // ── Default variant and size ──

  it("defaults to primary variant and md size", () => {
    render(<Button>Default</Button>);
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("bg-primary");
    expect(cls).toContain("h-11");
  });

  // ── Features ──

  it("renders icon on the left by default", () => {
    const { container } = render(<Button icon="add">Go</Button>);
    const svg = container.querySelector("svg") || container.querySelector("[aria-hidden='true']");
    expect(svg).toBeInTheDocument();
  });

  it("renders icon on the right when iconPosition='right'", () => {
    const { container } = render(<Button icon="add" iconPosition="right">Go</Button>);
    const svg = container.querySelector("svg") || container.querySelector("[aria-hidden='true']");
    expect(svg).toBeInTheDocument();
  });

  // ── Loading ──

  it("keeps children when loading without loadingText", () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  // ── Spinner color ──

  it("uses white spinner for primary variant", () => {
    render(<Button variant="primary" loading>Submit</Button>);
    const spinner = screen.getByRole("status");
    expect(spinner.className).toContain("text-white");
  });

  it("uses white spinner for secondary variant", () => {
    render(<Button variant="secondary" loading>Submit</Button>);
    const spinner = screen.getByRole("status");
    expect(spinner.className).toContain("text-white");
  });

  it("uses primary spinner for non-primary/secondary variants", () => {
    render(<Button variant="outline" loading>Go</Button>);
    const spinner = screen.getByRole("status");
    expect(spinner.className).toContain("text-primary");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

describe("ButtonGroup", () => {
  it("renders with group role", () => {
    render(
      <ButtonGroup>
        <Button>A</Button>
        <Button>B</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <ButtonGroup>
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>,
    );
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("applies gap when not attached", () => {
    render(
      <ButtonGroup>
        <Button>A</Button>
        <Button>B</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("group")).toHaveClass("gap-2");
  });

  it("removes gap and merges borders when attached", () => {
    render(
      <ButtonGroup attached>
        <Button>A</Button>
        <Button>B</Button>
      </ButtonGroup>,
    );
    const group = screen.getByRole("group");
    expect(group.className).not.toContain("gap-2");
    expect(group.className).toContain("[&>*]:rounded-none");
  });

  it("supports vertical direction", () => {
    render(
      <ButtonGroup direction="vertical">
        <Button>A</Button>
        <Button>B</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("group")).toHaveClass("flex-col");
  });
});

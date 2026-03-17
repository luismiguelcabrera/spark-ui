import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe, toHaveNoViolations } from "jest-axe";
import { Switch } from "../switch";

expect.extend(toHaveNoViolations);

describe("Switch", () => {
  it("renders with correct role", () => {
    render(<Switch />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("toggles on click", () => {
    const onChange = vi.fn();
    render(<Switch onCheckedChange={onChange} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("toggles off when already checked", () => {
    const onChange = vi.fn();
    render(<Switch checked onCheckedChange={onChange} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("shows label and description", () => {
    render(<Switch label="Notifications" description="Enable push notifications" />);
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("Enable push notifications")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Switch disabled />);
    expect(screen.getByRole("switch")).toBeDisabled();
  });

  it("does not toggle when disabled", () => {
    const onChange = vi.fn();
    render(<Switch disabled onCheckedChange={onChange} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders aria-checked correctly when checked", () => {
    render(<Switch checked />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("renders aria-checked correctly when unchecked", () => {
    render(<Switch checked={false} />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("shows required indicator", () => {
    render(<Switch label="Accept terms" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
    expect(screen.getByRole("switch")).toHaveAttribute("aria-required", "true");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Switch label="Toggle" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe, toHaveNoViolations } from "jest-axe";
import { Fab } from "../fab";

expect.extend(toHaveNoViolations);

describe("Fab", () => {
  it("renders a button with an icon", () => {
    render(<Fab icon="plus" aria-label="Add" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders as type=button by default", () => {
    render(<Fab icon="plus" aria-label="Add" />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("fires onClick", () => {
    const onClick = vi.fn();
    render(<Fab icon="plus" aria-label="Add" onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("shows label when extended", () => {
    render(<Fab icon="plus" extended label="New item" aria-label="Add" />);
    expect(screen.getByText("New item")).toBeInTheDocument();
  });

  it("does not show label when not extended", () => {
    render(<Fab icon="plus" label="New item" aria-label="Add" />);
    expect(screen.queryByText("New item")).not.toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Fab icon="plus" aria-label="Add" disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it.each(["primary", "secondary", "destructive", "success"] as const)(
    "renders with color=%s without error",
    (color) => {
      const { container } = render(<Fab icon="plus" color={color} aria-label="Add" />);
      expect(container.firstChild).toBeTruthy();
    }
  );

  it.each(["sm", "md", "lg"] as const)(
    "renders with size=%s without error",
    (size) => {
      const { container } = render(<Fab icon="plus" size={size} aria-label="Add" />);
      expect(container.firstChild).toBeTruthy();
    }
  );

  it.each(["bottom-right", "bottom-left", "top-right", "top-left"] as const)(
    "renders with position=%s",
    (position) => {
      render(<Fab icon="plus" position={position} aria-label="Add" />);
      const btn = screen.getByRole("button");
      expect(btn.className).toContain("fixed");
    }
  );

  it("does not apply fixed positioning when position is undefined", () => {
    render(<Fab icon="plus" aria-label="Add" />);
    const btn = screen.getByRole("button");
    expect(btn.className).not.toContain("fixed");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Fab ref={ref} icon="plus" aria-label="Add" />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Fab icon="plus" aria-label="Add item" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations (extended)", async () => {
    const { container } = render(<Fab icon="plus" extended label="Add item" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

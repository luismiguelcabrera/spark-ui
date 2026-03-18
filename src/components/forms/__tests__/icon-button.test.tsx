import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { IconButton } from "../icon-button";

describe("IconButton", () => {
  it("renders a button", () => {
    render(<IconButton icon="settings" aria-label="Settings" />);
    expect(screen.getByRole("button", { name: "Settings" })).toBeInTheDocument();
  });

  it("has type='button'", () => {
    render(<IconButton icon="settings" aria-label="Settings" />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<IconButton icon="close" ref={ref} aria-label="Close" />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it("has displayName", () => {
    expect(IconButton.displayName).toBe("IconButton");
  });

  it("merges className", () => {
    render(<IconButton icon="settings" className="custom" aria-label="Settings" />);
    expect(screen.getByRole("button")).toHaveClass("custom");
  });

  it("fires onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<IconButton icon="close" onClick={onClick} aria-label="Close" />);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("supports disabled state", () => {
    render(<IconButton icon="edit" disabled aria-label="Edit" />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it.each(["sm", "md", "lg"] as const)(
    "renders with size=%s without error",
    (size) => {
      render(<IconButton icon="settings" size={size} aria-label="Settings" />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    },
  );

  it.each(["default", "ghost", "outline"] as const)(
    "renders with variant=%s without error",
    (variant) => {
      render(<IconButton icon="settings" variant={variant} aria-label="Settings" />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    },
  );
});

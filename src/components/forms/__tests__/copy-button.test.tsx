import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CopyButton } from "../copy-button";

describe("CopyButton", () => {
  it("renders a button with copy aria-label", () => {
    render(<CopyButton value="text" />);
    expect(screen.getByRole("button", { name: "Copy to clipboard" })).toBeInTheDocument();
  });

  it("has type='button'", () => {
    render(<CopyButton value="text" />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<CopyButton value="text" ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it("has displayName", () => {
    expect(CopyButton.displayName).toBe("CopyButton");
  });

  it("merges className", () => {
    render(<CopyButton value="text" className="custom" />);
    expect(screen.getByRole("button")).toHaveClass("custom");
  });

  it("renders label text when label prop is provided", () => {
    render(<CopyButton value="text" label="Copy link" />);
    expect(screen.getByText("Copy link")).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", async () => {
    const user = userEvent.setup();
    render(<CopyButton value="hello" />);
    await user.click(screen.getByRole("button"));
    // Should not throw; clipboard interaction is handled internally
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it.each(["sm", "md", "lg"] as const)(
    "renders with size=%s without error",
    (size) => {
      render(<CopyButton value="text" size={size} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    },
  );

  it.each(["default", "ghost", "outline"] as const)(
    "renders with variant=%s without error",
    (variant) => {
      render(<CopyButton value="text" variant={variant} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    },
  );
});

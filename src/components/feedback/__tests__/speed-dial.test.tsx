import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { SpeedDial } from "../speed-dial";

describe("SpeedDial", () => {
  const actions = [
    { icon: "edit", label: "Edit", onClick: vi.fn() },
    { icon: "delete", label: "Delete", onClick: vi.fn() },
  ];

  it("renders main button", () => {
    render(<SpeedDial actions={actions} />);
    expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<SpeedDial ref={ref} actions={actions} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("has displayName", () => {
    expect(SpeedDial.displayName).toBe("SpeedDial");
  });

  it("merges className", () => {
    const { container } = render(
      <SpeedDial actions={actions} className="custom-class" />
    );
    // The className is on the wrapper div (container > div with className)
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });

  it("has aria-expanded=false initially", () => {
    render(<SpeedDial actions={actions} />);
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("toggles aria-expanded and label on click", async () => {
    const user = userEvent.setup();
    render(<SpeedDial actions={actions} />);
    const btn = screen.getByRole("button", { name: "Open menu" });
    await user.click(btn);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("has aria-controls pointing to actions group", () => {
    render(<SpeedDial actions={actions} />);
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-controls",
      "speed-dial-actions"
    );
  });

  it("renders action buttons as accessible buttons", () => {
    render(<SpeedDial actions={actions} />);
    // Actions are aria-label'd buttons, not menuitems
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("calls action onClick and closes menu", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const testActions = [{ icon: "edit", label: "Edit", onClick }];
    render(<SpeedDial actions={testActions} />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(screen.getByRole("button", { name: "Edit" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    // Menu should close
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("renders tooltip labels", () => {
    render(<SpeedDial actions={actions} />);
    expect(screen.getAllByRole("tooltip")).toHaveLength(2);
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Popconfirm } from "../popconfirm";

describe("Popconfirm", () => {
  it("renders trigger children", () => {
    render(
      <Popconfirm title="Delete?">
        <button>Delete</button>
      </Popconfirm>
    );
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("forwards ref to the popover panel", async () => {
    const user = userEvent.setup();
    const ref = vi.fn();
    render(
      <Popconfirm ref={ref} title="Sure?">
        <button>Click</button>
      </Popconfirm>
    );
    await user.click(screen.getByRole("button", { name: "Click" }));
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("has displayName", () => {
    expect(Popconfirm.displayName).toBe("Popconfirm");
  });

  it("merges className", () => {
    const { container } = render(
      <Popconfirm title="Sure?" className="custom-class">
        <button>Click</button>
      </Popconfirm>
    );
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });

  it("does not show popover initially", () => {
    render(
      <Popconfirm title="Delete?">
        <button>Delete</button>
      </Popconfirm>
    );
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("shows alertdialog on trigger click", async () => {
    const user = userEvent.setup();
    render(
      <Popconfirm title="Are you sure?">
        <button>Delete</button>
      </Popconfirm>
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("calls onConfirm and closes on confirm click", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <Popconfirm title="Delete?" onConfirm={onConfirm}>
        <button>Delete</button>
      </Popconfirm>
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));
    await user.click(screen.getByRole("button", { name: "Yes" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("calls onCancel and closes on cancel click", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(
      <Popconfirm title="Delete?" onCancel={onCancel}>
        <button>Delete</button>
      </Popconfirm>
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));
    await user.click(screen.getByRole("button", { name: "No" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();
    render(
      <Popconfirm title="Delete?" disabled>
        <button>Delete</button>
      </Popconfirm>
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("renders description text", async () => {
    const user = userEvent.setup();
    render(
      <Popconfirm title="Delete?" description="This cannot be undone">
        <button>Delete</button>
      </Popconfirm>
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByText("This cannot be undone")).toBeInTheDocument();
  });
});

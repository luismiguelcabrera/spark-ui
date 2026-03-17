import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Modal } from "../modal";

describe("Modal", () => {
  it("renders children in inline mode", () => {
    render(<Modal>Content</Modal>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders title and description", () => {
    render(
      <Modal title="Confirm" description="Are you sure?">
        Body
      </Modal>,
    );
    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("renders footer", () => {
    render(
      <Modal footer={<button>Save</button>}>Body</Modal>,
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("is hidden when open=false", () => {
    render(<Modal open={false}>Hidden</Modal>);
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("is visible when open=true", () => {
    render(<Modal open={true}>Visible</Modal>);
    expect(screen.getByText("Visible")).toBeInTheDocument();
  });

  it("calls onOpenChange when Escape is pressed", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal open={true} onOpenChange={onOpenChange}>
        Content
      </Modal>,
    );
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

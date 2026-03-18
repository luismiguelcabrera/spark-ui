import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Drawer } from "../drawer";

describe("Drawer", () => {
  it("does not render when closed", () => {
    render(<Drawer open={false}>Content</Drawer>);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders dialog when open", () => {
    render(
      <Drawer open title="Settings">
        Content
      </Drawer>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("has aria-modal and aria-label", () => {
    render(
      <Drawer open title="Settings">
        Content
      </Drawer>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-label", "Settings");
  });

  it("renders title", () => {
    render(
      <Drawer open title="My Drawer">
        Content
      </Drawer>
    );
    expect(screen.getByText("My Drawer")).toBeInTheDocument();
  });

  it("renders footer", () => {
    render(
      <Drawer open title="Test" footer={<button>Save</button>}>
        Content
      </Drawer>
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("merges className on the panel", () => {
    render(
      <Drawer open title="Test" className="custom-class">
        Content
      </Drawer>
    );
    expect(screen.getByRole("dialog")).toHaveClass("custom-class");
  });

  it("calls onOpenChange(false) when close button is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Drawer open onOpenChange={onOpenChange} title="Test">
        Content
      </Drawer>
    );
    await user.click(screen.getByRole("button", { name: "Close drawer" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onOpenChange(false) when overlay is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Drawer open onOpenChange={onOpenChange} title="Test">
        Content
      </Drawer>
    );
    // The overlay is the aria-hidden div
    const overlay = screen.getByRole("dialog").parentElement!.querySelector('[aria-hidden="true"]')!;
    await user.click(overlay);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

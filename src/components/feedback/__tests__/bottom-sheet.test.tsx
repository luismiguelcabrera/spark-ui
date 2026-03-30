import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { BottomSheet } from "../bottom-sheet";

describe("BottomSheet", () => {
  it("renders when open is true", () => {
    render(
      <BottomSheet open={true} onOpenChange={() => {}}>
        <p>Sheet content</p>
      </BottomSheet>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Sheet content")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    render(
      <BottomSheet open={false} onOpenChange={() => {}}>
        <p>Sheet content</p>
      </BottomSheet>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(
      <BottomSheet open={true} onOpenChange={() => {}} title="Actions">
        <p>Content</p>
      </BottomSheet>,
    );
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("has aria-modal and aria-label attributes", () => {
    render(
      <BottomSheet open={true} onOpenChange={() => {}} title="My Sheet">
        <p>Content</p>
      </BottomSheet>,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-label", "My Sheet");
  });

  it("renders close button when title is provided", () => {
    render(
      <BottomSheet open={true} onOpenChange={() => {}} title="Title">
        <p>Content</p>
      </BottomSheet>,
    );
    expect(screen.getByLabelText("Close bottom sheet")).toBeInTheDocument();
  });

  it("calls onOpenChange(false) when close button clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <BottomSheet open={true} onOpenChange={onOpenChange} title="Title">
        <p>Content</p>
      </BottomSheet>,
    );
    await user.click(screen.getByLabelText("Close bottom sheet"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("closes when Escape key is pressed", () => {
    const onOpenChange = vi.fn();
    render(
      <BottomSheet open={true} onOpenChange={onOpenChange}>
        <p>Content</p>
      </BottomSheet>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("closes when backdrop is clicked (non-persistent)", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { container } = render(
      <BottomSheet open={true} onOpenChange={onOpenChange}>
        <p>Content</p>
      </BottomSheet>,
    );
    const backdrop = container.querySelector('[aria-hidden="true"]')!;
    await user.click(backdrop);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does NOT close when backdrop is clicked in persistent mode", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { container } = render(
      <BottomSheet open={true} onOpenChange={onOpenChange} persistent>
        <p>Content</p>
      </BottomSheet>,
    );
    const backdrop = container.querySelector('[aria-hidden="true"]')!;
    await user.click(backdrop);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("applies fullscreen class when fullscreen is true", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <BottomSheet ref={ref} open={true} onOpenChange={() => {}} fullscreen>
        <p>Content</p>
      </BottomSheet>,
    );
    expect(ref.current).toHaveClass("h-full");
  });

  it("applies max-h class when not fullscreen", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <BottomSheet ref={ref} open={true} onOpenChange={() => {}}>
        <p>Content</p>
      </BottomSheet>,
    );
    expect(ref.current).toHaveClass("max-h-[85vh]");
  });

  it("forwards ref to the panel div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <BottomSheet ref={ref} open={true} onOpenChange={() => {}}>
        <p>Content</p>
      </BottomSheet>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className onto the panel", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <BottomSheet ref={ref} open={true} onOpenChange={() => {}} className="custom-sheet">
        <p>Content</p>
      </BottomSheet>,
    );
    expect(ref.current).toHaveClass("custom-sheet");
  });

  it("renders drag indicator", () => {
    const { container } = render(
      <BottomSheet open={true} onOpenChange={() => {}}>
        <p>Content</p>
      </BottomSheet>,
    );
    const indicator = container.querySelector(".w-10.h-1.rounded-full");
    expect(indicator).toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Sheet } from "../sheet";

// Mock requestAnimationFrame so transition state toggles synchronously in tests
beforeEach(() => {
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
    cb(0);
    return 0;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Sheet", () => {
  it("renders when open", () => {
    render(
      <Sheet open={true} onOpenChange={() => {}} title="Settings">
        Content
      </Sheet>
    );
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(
      <Sheet open={false} onOpenChange={() => {}} title="Settings">
        Content
      </Sheet>
    );
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });

  it("calls onOpenChange when close button clicked", () => {
    const onOpenChange = vi.fn();
    render(
      <Sheet open={true} onOpenChange={onOpenChange} title="Settings">
        Content
      </Sheet>
    );
    fireEvent.click(screen.getByLabelText("Close"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("shows description", () => {
    render(
      <Sheet
        open={true}
        onOpenChange={() => {}}
        title="Settings"
        description="Manage your preferences"
      >
        Content
      </Sheet>
    );
    expect(screen.getByText("Manage your preferences")).toBeInTheDocument();
  });

  it("shows footer", () => {
    render(
      <Sheet open={true} onOpenChange={() => {}} footer={<button>Save</button>}>
        Content
      </Sheet>
    );
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("has dialog role", () => {
    render(
      <Sheet open={true} onOpenChange={() => {}}>
        Content
      </Sheet>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes on Escape key", () => {
    const onOpenChange = vi.fn();
    render(
      <Sheet open={true} onOpenChange={onOpenChange} title="Settings">
        Content
      </Sheet>
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not close on Escape when closeOnEscape is false", () => {
    const onOpenChange = vi.fn();
    render(
      <Sheet open={true} onOpenChange={onOpenChange} closeOnEscape={false}>
        Content
      </Sheet>
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("closes on overlay click", () => {
    const onOpenChange = vi.fn();
    render(
      <Sheet open={true} onOpenChange={onOpenChange}>
        Content
      </Sheet>
    );
    const dialog = screen.getByRole("dialog");
    const overlay = dialog.firstElementChild;
    expect(overlay).not.toBeNull();
    fireEvent.click(overlay!);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not close on overlay click when closeOnOverlayClick is false", () => {
    const onOpenChange = vi.fn();
    render(
      <Sheet open={true} onOpenChange={onOpenChange} closeOnOverlayClick={false}>
        Content
      </Sheet>
    );
    const dialog = screen.getByRole("dialog");
    const overlay = dialog.firstElementChild;
    expect(overlay).not.toBeNull();
    fireEvent.click(overlay!);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("hides close button when showClose is false", () => {
    render(
      <Sheet open={true} onOpenChange={() => {}} showClose={false}>
        Content
      </Sheet>
    );
    expect(screen.queryByLabelText("Close")).not.toBeInTheDocument();
  });

  it("forwards ref to the panel element", () => {
    const ref = vi.fn();
    render(
      <Sheet open={true} onOpenChange={() => {}} ref={ref}>
        Content
      </Sheet>
    );
    expect(ref).toHaveBeenCalled();
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
  });

  it("stays mounted during exit animation, unmounts after transitionEnd", () => {
    const { rerender } = render(
      <Sheet open={true} onOpenChange={() => {}} title="Settings">
        Content
      </Sheet>
    );

    // Close the sheet — it should still be in the DOM (exit animation playing)
    rerender(
      <Sheet open={false} onOpenChange={() => {}} title="Settings">
        Content
      </Sheet>
    );
    expect(screen.getByText("Settings")).toBeInTheDocument();

    // Simulate the transition ending on the panel
    const dialog = screen.getByRole("dialog");
    const panel = dialog.querySelector(".shadow-float");
    expect(panel).not.toBeNull();
    fireEvent.transitionEnd(panel!);

    // After transition ends, the component should unmount
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });

  it("applies correct position class for each side", () => {
    const sides = [
      { side: "left" as const, expected: "left-0" },
      { side: "right" as const, expected: "right-0" },
      { side: "top" as const, expected: "top-0" },
      { side: "bottom" as const, expected: "bottom-0" },
    ];

    sides.forEach(({ side, expected }) => {
      const { unmount } = render(
        <Sheet open={true} onOpenChange={() => {}} side={side}>
          Content
        </Sheet>
      );
      const dialog = screen.getByRole("dialog");
      const panel = dialog.querySelector(".shadow-float");
      expect(panel?.className).toContain(expected);
      unmount();
    });
  });

  it("merges custom className", () => {
    render(
      <Sheet open={true} onOpenChange={() => {}} className="custom-class">
        Content
      </Sheet>
    );
    const dialog = screen.getByRole("dialog");
    const panel = dialog.querySelector(".shadow-float");
    expect(panel?.className).toContain("custom-class");
  });

  it("sets aria-modal and aria-label", () => {
    render(
      <Sheet open={true} onOpenChange={() => {}} title="Settings">
        Content
      </Sheet>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-label", "Settings");
  });
});

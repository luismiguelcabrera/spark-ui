import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { Dialog, useDialog } from "../dialog";

// Helper wrapper for controlled Dialog
function DialogWrapper(props: Partial<React.ComponentProps<typeof Dialog>>) {
  const [open, setOpen] = useState(true);
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="Test Dialog"
      {...props}
    />
  );
}

describe("Dialog", () => {
  it("renders when open is true", () => {
    render(<DialogWrapper />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Test Dialog")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    render(
      <Dialog open={false} onOpenChange={() => {}} title="Hidden" />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders title and description", () => {
    render(<DialogWrapper description="Are you sure?" />);
    expect(screen.getByText("Test Dialog")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(
      <DialogWrapper>
        <p data-testid="custom">Custom content</p>
      </DialogWrapper>,
    );
    expect(screen.getByTestId("custom")).toHaveTextContent("Custom content");
  });

  it("renders confirm and cancel buttons", () => {
    render(<DialogWrapper />);
    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("uses custom button text", () => {
    render(<DialogWrapper confirmText="Yes" cancelText="No" />);
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("hides cancel button when showCancel is false", () => {
    render(<DialogWrapper showCancel={false} />);
    expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  it("calls onConfirm when confirm is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<DialogWrapper onConfirm={onConfirm} />);
    await user.click(screen.getByText("Confirm"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel and closes when cancel is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <Dialog
        open={true}
        onOpenChange={onOpenChange}
        title="Test"
        onCancel={onCancel}
      />,
    );
    await user.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("closes on Escape key", () => {
    const onCancel = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <Dialog
        open={true}
        onOpenChange={onOpenChange}
        title="Test"
        onCancel={onCancel}
      />,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("closes when backdrop is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { container } = render(
      <Dialog open={true} onOpenChange={onOpenChange} title="Test" />,
    );
    // Backdrop is the first child with aria-hidden
    const backdrop = container.querySelector('[aria-hidden="true"]')!;
    await user.click(backdrop);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not close on backdrop when closeOnBackdrop is false", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { container } = render(
      <Dialog
        open={true}
        onOpenChange={onOpenChange}
        title="Test"
        closeOnBackdrop={false}
      />,
    );
    const backdrop = container.querySelector('[aria-hidden="true"]')!;
    await user.click(backdrop);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("closes via the X close button", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Dialog open={true} onOpenChange={onOpenChange} title="Test" />,
    );
    await user.click(screen.getByLabelText("Close dialog"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("shows loading state on confirm button with spinner", () => {
    render(<DialogWrapper loading />);
    // Confirm text is still shown alongside spinner
    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("Confirm").closest("button")).toBeDisabled();
  });

  it("shows custom loading text", () => {
    render(<DialogWrapper loading loadingText="Saving..." />);
    expect(screen.getByText("Saving...")).toBeInTheDocument();
  });

  it("disables buttons when loading", () => {
    render(<DialogWrapper loading showCancel />);
    expect(screen.getByText("Cancel")).toBeDisabled();
  });

  it("has aria-modal and aria-labelledby", () => {
    render(<DialogWrapper />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog.getAttribute("aria-labelledby")).toBeTruthy();
  });

  it("has aria-describedby when description is provided", () => {
    render(<DialogWrapper description="Some info" />);
    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-describedby")).toBeTruthy();
  });

  it("does not have aria-describedby without description", () => {
    render(<DialogWrapper />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).not.toHaveAttribute("aria-describedby");
  });

  it("forwards ref to the panel div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <Dialog ref={ref} open={true} onOpenChange={() => {}} title="Test" />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className on panel", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <Dialog
        ref={ref}
        open={true}
        onOpenChange={() => {}}
        title="Test"
        className="custom-panel"
      />,
    );
    expect(ref.current).toHaveClass("custom-panel");
  });

  it("applies danger variant styling to confirm button", () => {
    render(<DialogWrapper variant="danger" />);
    expect(screen.getByText("Confirm")).toHaveClass("bg-red-600");
  });

  it("focuses cancel button for danger variant", async () => {
    render(<DialogWrapper variant="danger" showCancel />);
    // Wait for rAF focus
    await act(async () => {
      await new Promise((r) => requestAnimationFrame(r));
    });
    expect(document.activeElement).toBe(screen.getByText("Cancel"));
  });
});

describe("useDialog", () => {
  function UseDialogDemo() {
    const { confirm, DialogElement } = useDialog({
      title: "Delete item?",
      description: "This cannot be undone.",
      variant: "danger",
      confirmText: "Delete",
    });
    const [result, setResult] = useState<string>("none");

    return (
      <div>
        <button
          type="button"
          onClick={async () => {
            const confirmed = await confirm();
            setResult(confirmed ? "confirmed" : "cancelled");
          }}
        >
          Open Dialog
        </button>
        <p data-testid="result">{result}</p>
        {DialogElement}
      </div>
    );
  }

  it("opens dialog when confirm() is called", async () => {
    const user = userEvent.setup();
    render(<UseDialogDemo />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByText("Open Dialog"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Delete item?")).toBeInTheDocument();
  });

  it("resolves true when confirmed", async () => {
    const user = userEvent.setup();
    render(<UseDialogDemo />);
    await user.click(screen.getByText("Open Dialog"));
    await user.click(screen.getByText("Delete"));
    expect(screen.getByTestId("result")).toHaveTextContent("confirmed");
  });

  it("resolves false when cancelled", async () => {
    const user = userEvent.setup();
    render(<UseDialogDemo />);
    await user.click(screen.getByText("Open Dialog"));
    await user.click(screen.getByText("Cancel"));
    expect(screen.getByTestId("result")).toHaveTextContent("cancelled");
  });

  it("allows overriding options per call", async () => {
    function OverrideDemo() {
      const { confirm, DialogElement } = useDialog({ title: "Default" });
      return (
        <div>
          <button
            type="button"
            onClick={() => confirm({ title: "Override Title" })}
          >
            Open
          </button>
          {DialogElement}
        </div>
      );
    }

    const user = userEvent.setup();
    render(<OverrideDemo />);
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Override Title")).toBeInTheDocument();
  });
});

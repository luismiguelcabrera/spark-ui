import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { ImperativeFeedbackProvider } from "../imperative-provider";
import {
  toast,
  Modal,
  notification,
  __setImperativeFeedbackStore,
} from "../../../hooks/use-imperative-feedback";

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  __setImperativeFeedbackStore(null);
});

// ---------------------------------------------------------------------------
// Provider registration
// ---------------------------------------------------------------------------

describe("ImperativeFeedbackProvider", () => {
  it("renders children", () => {
    render(
      <ImperativeFeedbackProvider>
        <div>App Content</div>
      </ImperativeFeedbackProvider>
    );
    expect(screen.getByText("App Content")).toBeInTheDocument();
  });

  it("registers store on mount and cleans up on unmount", () => {
    const { unmount } = render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    // Store should be registered — toast should not warn
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    act(() => {
      toast("test");
    });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();

    unmount();

    // After unmount, store is cleared — toast should warn
    const spy2 = vi.spyOn(console, "warn").mockImplementation(() => {});
    toast("after unmount");
    expect(spy2).toHaveBeenCalled();
    spy2.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// Toast rendering
// ---------------------------------------------------------------------------

describe("Toast rendering", () => {
  it("shows a toast with message", () => {
    render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    act(() => {
      toast("Hello World");
    });

    expect(screen.getByText("Hello World")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("shows toast with correct variant styling", () => {
    render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    act(() => {
      toast.success("Saved!");
    });

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("bg-green-50");
  });

  it("shows toast description when provided", () => {
    render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    act(() => {
      toast("Title", { description: "Details here" });
    });

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Details here")).toBeInTheDocument();
  });

  it("auto-dismisses toast after duration", () => {
    render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    act(() => {
      toast("Temporary", { duration: 2000 });
    });

    expect(screen.getByText("Temporary")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.queryByText("Temporary")).not.toBeInTheDocument();
  });

  it("auto-dismisses toast with default duration", () => {
    render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    act(() => {
      toast("Default timer");
    });

    expect(screen.getByText("Default timer")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.queryByText("Default timer")).not.toBeInTheDocument();
  });

  it("dismisses toast on close button click", () => {
    render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    act(() => {
      toast("Dismissible");
    });

    expect(screen.getByText("Dismissible")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));

    expect(screen.queryByText("Dismissible")).not.toBeInTheDocument();
  });

  it("shows multiple toasts", () => {
    render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    act(() => {
      toast("First");
      toast("Second");
    });

    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("toast.dismiss removes a specific toast by id", () => {
    render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    let id = "";
    act(() => {
      id = toast("To remove", { duration: 0 });
      toast("To keep", { duration: 0 });
    });

    expect(screen.getByText("To remove")).toBeInTheDocument();
    expect(screen.getByText("To keep")).toBeInTheDocument();

    act(() => {
      toast.dismiss(id);
    });

    expect(screen.queryByText("To remove")).not.toBeInTheDocument();
    expect(screen.getByText("To keep")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Modal rendering — confirm
// ---------------------------------------------------------------------------

describe("Modal.confirm rendering", () => {
  it("shows confirm dialog with title", () => {
    render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    act(() => {
      Modal.confirm({ title: "Are you sure?" });
    });

    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("shows confirm dialog with description", () => {
    render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    act(() => {
      Modal.confirm({
        title: "Delete?",
        description: "This cannot be undone.",
      });
    });

    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();
  });

  it("calls onConfirm and closes when Confirm is clicked", () => {
    const onConfirm = vi.fn();
    render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    act(() => {
      Modal.confirm({
        title: "Proceed?",
        onConfirm,
      });
    });

    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Proceed?")).not.toBeInTheDocument();
  });

  it("calls onCancel and closes when Cancel is clicked", () => {
    const onCancel = vi.fn();
    render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    act(() => {
      Modal.confirm({
        title: "Cancel test",
        onCancel,
      });
    });

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Cancel test")).not.toBeInTheDocument();
  });

  it("uses custom button labels", () => {
    render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    act(() => {
      Modal.confirm({
        title: "Custom labels",
        confirmLabel: "Yes, delete",
        cancelLabel: "No, keep",
      });
    });

    expect(
      screen.getByRole("button", { name: "Yes, delete" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "No, keep" })
    ).toBeInTheDocument();
  });

  it("closes on Escape key", () => {
    const onCancel = vi.fn();
    render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    act(() => {
      Modal.confirm({
        title: "Escape test",
        onCancel,
      });
    });

    expect(screen.getByText("Escape test")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByText("Escape test")).not.toBeInTheDocument();
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("has aria-modal=true", () => {
    render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    act(() => {
      Modal.confirm({ title: "ARIA test" });
    });

    expect(screen.getByRole("dialog")).toHaveAttribute(
      "aria-modal",
      "true"
    );
  });
});

// ---------------------------------------------------------------------------
// Modal rendering — info
// ---------------------------------------------------------------------------

describe("Modal.info rendering", () => {
  it("shows info dialog with title", () => {
    render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    act(() => {
      Modal.info({ title: "Information" });
    });

    expect(screen.getByText("Information")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("shows info dialog with description", () => {
    render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    act(() => {
      Modal.info({
        title: "Info",
        description: "Some details here.",
      });
    });

    expect(screen.getByText("Some details here.")).toBeInTheDocument();
  });

  it("closes on OK click", () => {
    render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    act(() => {
      Modal.info({ title: "Close me" });
    });

    fireEvent.click(screen.getByRole("button", { name: "OK" }));

    expect(screen.queryByText("Close me")).not.toBeInTheDocument();
  });

  it("uses custom close label", () => {
    render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    act(() => {
      Modal.info({ title: "Custom", closeLabel: "Got it" });
    });

    expect(
      screen.getByRole("button", { name: "Got it" })
    ).toBeInTheDocument();
  });

  it("closes on close button click", () => {
    render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    act(() => {
      Modal.info({ title: "Close X" });
    });

    // The close X button
    const closeButtons = screen.getAllByRole("button");
    // Find the close icon button (not "OK")
    const closeBtn = closeButtons.find(
      (btn) => btn.textContent !== "OK" && btn.textContent !== "Got it"
    );
    if (closeBtn) {
      fireEvent.click(closeBtn);
      expect(screen.queryByText("Close X")).not.toBeInTheDocument();
    }
  });
});

// ---------------------------------------------------------------------------
// Notification rendering
// ---------------------------------------------------------------------------

describe("Notification rendering", () => {
  it("shows a notification with title and message", () => {
    render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    act(() => {
      notification.show({
        title: "New Message",
        message: "You have a new message",
        variant: "info",
      });
    });

    expect(screen.getByText("New Message")).toBeInTheDocument();
    expect(screen.getByText("You have a new message")).toBeInTheDocument();
  });

  it("auto-dismisses notification after default duration", () => {
    render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    act(() => {
      notification.show({ title: "Auto dismiss" });
    });

    expect(screen.getByText("Auto dismiss")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(8000);
    });

    expect(screen.queryByText("Auto dismiss")).not.toBeInTheDocument();
  });

  it("dismisses notification on close button click", () => {
    render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    act(() => {
      notification.show({ title: "Dismiss me", duration: 0 });
    });

    expect(screen.getByText("Dismiss me")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Dismiss notification" })
    );

    expect(screen.queryByText("Dismiss me")).not.toBeInTheDocument();
  });

  it("notification.close removes by id", () => {
    render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    let id = "";
    act(() => {
      id = notification.show({ title: "To close", duration: 0 });
      notification.show({ title: "To keep", duration: 0 });
    });

    expect(screen.getByText("To close")).toBeInTheDocument();
    expect(screen.getByText("To keep")).toBeInTheDocument();

    act(() => {
      notification.close(id);
    });

    expect(screen.queryByText("To close")).not.toBeInTheDocument();
    expect(screen.getByText("To keep")).toBeInTheDocument();
  });

  it("renders notification with variant styles", () => {
    render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    act(() => {
      notification.show({
        title: "Error!",
        variant: "error",
        duration: 0,
      });
    });

    const status = screen.getByRole("status");
    expect(status).toHaveClass("border-red-200");
  });
});

// ---------------------------------------------------------------------------
// Concurrent modals
// ---------------------------------------------------------------------------

describe("Concurrent modals", () => {
  it("stacks multiple modals", () => {
    render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    act(() => {
      Modal.info({ title: "First" });
      Modal.info({ title: "Second" });
    });

    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("Escape closes topmost modal only", () => {
    render(
      <ImperativeFeedbackProvider>
        <div>App</div>
      </ImperativeFeedbackProvider>
    );

    act(() => {
      Modal.info({ title: "Bottom" });
      Modal.confirm({ title: "Top" });
    });

    expect(screen.getByText("Bottom")).toBeInTheDocument();
    expect(screen.getByText("Top")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByText("Top")).not.toBeInTheDocument();
    expect(screen.getByText("Bottom")).toBeInTheDocument();
  });
});

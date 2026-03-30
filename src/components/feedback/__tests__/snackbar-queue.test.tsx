import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useSnackbarQueue } from "../snackbar-queue";

// Test harness component
function TestHarness() {
  const { enqueue, SnackbarQueueElement } = useSnackbarQueue();

  return (
    <div>
      <button
        type="button"
        data-testid="add-default"
        onClick={() => enqueue({ message: "Default message" })}
      >
        Add Default
      </button>
      <button
        type="button"
        data-testid="add-success"
        onClick={() =>
          enqueue({ message: "Success message", variant: "success" })
        }
      >
        Add Success
      </button>
      <button
        type="button"
        data-testid="add-error"
        onClick={() =>
          enqueue({ message: "Error message", variant: "error" })
        }
      >
        Add Error
      </button>
      <button
        type="button"
        data-testid="add-warning"
        onClick={() =>
          enqueue({ message: "Warning message", variant: "warning" })
        }
      >
        Add Warning
      </button>
      <button
        type="button"
        data-testid="add-with-action"
        onClick={() =>
          enqueue({
            message: "Item deleted",
            action: { label: "Undo", onClick: vi.fn() },
          })
        }
      >
        Add With Action
      </button>
      <button
        type="button"
        data-testid="add-long-duration"
        onClick={() =>
          enqueue({ message: "Long duration", duration: 10000 })
        }
      >
        Add Long Duration
      </button>
      <button
        type="button"
        data-testid="add-no-auto-dismiss"
        onClick={() =>
          enqueue({ message: "No auto dismiss", duration: 0 })
        }
      >
        Add No Auto Dismiss
      </button>
      {SnackbarQueueElement}
    </div>
  );
}

describe("useSnackbarQueue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders nothing when queue is empty", () => {
    render(<TestHarness />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows snackbar when item is enqueued", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<TestHarness />);
    await user.click(screen.getByTestId("add-default"));
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Default message")).toBeInTheDocument();
  });

  it("auto-dismisses after default duration (5000ms)", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<TestHarness />);
    await user.click(screen.getByTestId("add-default"));
    expect(screen.getByText("Default message")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.queryByText("Default message")).not.toBeInTheDocument();
  });

  it("does not auto-dismiss when duration is 0", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<TestHarness />);
    await user.click(screen.getByTestId("add-no-auto-dismiss"));
    expect(screen.getByText("No auto dismiss")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(screen.getByText("No auto dismiss")).toBeInTheDocument();
  });

  it("shows one at a time — first in, first out", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<TestHarness />);
    await user.click(screen.getByTestId("add-default"));
    await user.click(screen.getByTestId("add-success"));

    // Only first message should show
    expect(screen.getByText("Default message")).toBeInTheDocument();
    expect(screen.queryByText("Success message")).not.toBeInTheDocument();

    // Dismiss first
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Now second should show
    expect(screen.queryByText("Default message")).not.toBeInTheDocument();
    expect(screen.getByText("Success message")).toBeInTheDocument();
  });

  it("renders dismiss button on each snackbar", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<TestHarness />);
    await user.click(screen.getByTestId("add-default"));
    expect(screen.getByLabelText("Dismiss")).toBeInTheDocument();
  });

  it("dismisses when dismiss button is clicked", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<TestHarness />);
    await user.click(screen.getByTestId("add-default"));
    expect(screen.getByText("Default message")).toBeInTheDocument();

    await user.click(screen.getByLabelText("Dismiss"));
    expect(screen.queryByText("Default message")).not.toBeInTheDocument();
  });

  it("renders action button when provided", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<TestHarness />);
    await user.click(screen.getByTestId("add-with-action"));
    expect(screen.getByText("Undo")).toBeInTheDocument();
  });

  it("has alert role and aria-live", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<TestHarness />);
    await user.click(screen.getByTestId("add-default"));
    const alert = screen.getByRole("alert");
    expect(alert).toHaveAttribute("aria-live", "polite");
  });

  it.each(["success", "error", "warning"] as const)(
    "renders %s variant",
    async (variant) => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<TestHarness />);
      await user.click(screen.getByTestId(`add-${variant}`));
      expect(screen.getByRole("alert")).toBeInTheDocument();
    },
  );
});

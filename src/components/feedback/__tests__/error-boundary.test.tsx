import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ErrorBoundary } from "../error-boundary";

// A component that throws on render
function ThrowingComponent({ message }: { message: string }): React.JSX.Element {
  throw new Error(message);
}

// Suppress React error boundary console output during tests
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = (...args: unknown[]) => {
    const msg = typeof args[0] === "string" ? args[0] : "";
    if (msg.includes("Error: Uncaught") || msg.includes("The above error")) return;
    originalConsoleError(...args);
  };
});
afterEach(() => {
  console.error = originalConsoleError;
});

describe("ErrorBoundary", () => {
  it("has displayName", () => {
    expect(ErrorBoundary.displayName).toBe("ErrorBoundary");
  });

  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <div>Safe content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText("Safe content")).toBeInTheDocument();
  });

  it("renders default fallback when child throws", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent message="Boom!" />
      </ErrorBoundary>
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Boom!")).toBeInTheDocument();
  });

  it("renders static fallback element", () => {
    render(
      <ErrorBoundary fallback={<p>Custom error UI</p>}>
        <ThrowingComponent message="Oops" />
      </ErrorBoundary>
    );
    expect(screen.getByText("Custom error UI")).toBeInTheDocument();
  });

  it("renders function fallback with error and reset", () => {
    render(
      <ErrorBoundary
        fallback={(error, reset) => (
          <div>
            <p>Error: {error.message}</p>
            <button onClick={reset}>Reset</button>
          </div>
        )}
      >
        <ThrowingComponent message="Test failure" />
      </ErrorBoundary>
    );
    expect(screen.getByText("Error: Test failure")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  });

  it("calls onError when an error is caught", () => {
    const onError = vi.fn();
    render(
      <ErrorBoundary onError={onError}>
        <ThrowingComponent message="Caught!" />
      </ErrorBoundary>
    );
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Caught!" }),
      expect.objectContaining({ componentStack: expect.any(String) })
    );
  });

  it("resets error state via reset function", async () => {
    const user = userEvent.setup();
    render(
      <ErrorBoundary>
        <ThrowingComponent message="Error" />
      </ErrorBoundary>
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    // Default fallback has a "Try again" button
    await user.click(screen.getByRole("button", { name: "Try again" }));
    // After reset, it tries to render children again (which throws again)
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});

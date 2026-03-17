import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Snackbar } from "../snackbar";

describe("Snackbar", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders when open", () => {
    render(<Snackbar open={true} onClose={() => {}} message="Saved!" />);
    expect(screen.getByText("Saved!")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<Snackbar open={false} onClose={() => {}} message="Saved!" />);
    expect(screen.queryByText("Saved!")).not.toBeInTheDocument();
  });

  it("auto-closes after duration", () => {
    const onClose = vi.fn();
    render(<Snackbar open={true} onClose={onClose} message="Saved!" duration={3000} />);
    act(() => { vi.advanceTimersByTime(3000); });
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when close button clicked", () => {
    const onClose = vi.fn();
    render(<Snackbar open={true} onClose={onClose} message="Saved!" />);
    fireEvent.click(screen.getByLabelText("Dismiss"));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls action onClick", () => {
    const onClick = vi.fn();
    render(
      <Snackbar
        open={true}
        onClose={() => {}}
        message="Deleted"
        action={{ label: "Undo", onClick }}
      />
    );
    fireEvent.click(screen.getByText("Undo"));
    expect(onClick).toHaveBeenCalled();
  });

  it("shows description", () => {
    render(<Snackbar open={true} onClose={() => {}} message="Error" description="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("has alert role", () => {
    render(<Snackbar open={true} onClose={() => {}} message="Info" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});

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

  // === New feature tests: timeout prop ===

  describe("timeout prop", () => {
    it("auto-dismisses after timeout ms", () => {
      const onClose = vi.fn();
      render(<Snackbar open={true} onClose={onClose} message="Timed" timeout={2000} />);
      act(() => { vi.advanceTimersByTime(2000); });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does not auto-dismiss when timeout is 0", () => {
      const onClose = vi.fn();
      render(<Snackbar open={true} onClose={onClose} message="Persistent" timeout={0} />);
      act(() => { vi.advanceTimersByTime(10000); });
      expect(onClose).not.toHaveBeenCalled();
    });

    it("timeout takes precedence over duration", () => {
      const onClose = vi.fn();
      render(<Snackbar open={true} onClose={onClose} message="Conflict" duration={5000} timeout={1000} />);
      act(() => { vi.advanceTimersByTime(1000); });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("timeout=0 overrides duration to disable auto-dismiss", () => {
      const onClose = vi.fn();
      render(<Snackbar open={true} onClose={onClose} message="Override" duration={3000} timeout={0} />);
      act(() => { vi.advanceTimersByTime(5000); });
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  // === New feature tests: location prop ===

  describe("location prop", () => {
    it.each([
      ["bottom-center", "bottom-4"],
      ["bottom-left", "bottom-4"],
      ["bottom-right", "bottom-4"],
      ["top-center", "top-4"],
      ["top-left", "top-4"],
      ["top-right", "top-4"],
    ] as const)("applies %s location", (location, expectedClass) => {
      render(<Snackbar open={true} onClose={() => {}} message="Positioned" location={location} />);
      expect(screen.getByRole("alert")).toHaveClass(expectedClass);
    });

    it("bottom-left location includes left-4", () => {
      render(<Snackbar open={true} onClose={() => {}} message="Left" location="bottom-left" />);
      expect(screen.getByRole("alert")).toHaveClass("left-4");
    });

    it("bottom-right location includes right-4", () => {
      render(<Snackbar open={true} onClose={() => {}} message="Right" location="bottom-right" />);
      expect(screen.getByRole("alert")).toHaveClass("right-4");
    });

    it("top-center includes centered classes", () => {
      render(<Snackbar open={true} onClose={() => {}} message="Center" location="top-center" />);
      const el = screen.getByRole("alert");
      expect(el).toHaveClass("left-1/2");
      expect(el).toHaveClass("-translate-x-1/2");
    });

    it("location takes precedence over position", () => {
      render(<Snackbar open={true} onClose={() => {}} message="Override" position="top" location="bottom-right" />);
      const el = screen.getByRole("alert");
      expect(el).toHaveClass("bottom-4");
      expect(el).toHaveClass("right-4");
    });
  });

  // === New feature tests: multiLine prop ===

  describe("multiLine prop", () => {
    it("applies column layout when multiLine is true", () => {
      render(<Snackbar open={true} onClose={() => {}} message="Long message" multiLine />);
      expect(screen.getByRole("alert")).toHaveClass("flex-col");
    });

    it("applies row layout by default (not multiLine)", () => {
      render(<Snackbar open={true} onClose={() => {}} message="Short" />);
      expect(screen.getByRole("alert")).not.toHaveClass("flex-col");
    });

    it("renders action button in multiLine layout", () => {
      const onClick = vi.fn();
      render(
        <Snackbar
          open={true}
          onClose={() => {}}
          message="Multi"
          multiLine
          action={{ label: "Retry", onClick }}
        />
      );
      fireEvent.click(screen.getByText("Retry"));
      expect(onClick).toHaveBeenCalled();
    });

    it("renders close button in multiLine layout", () => {
      const onClose = vi.fn();
      render(<Snackbar open={true} onClose={onClose} message="Multi" multiLine />);
      fireEvent.click(screen.getByLabelText("Dismiss"));
      expect(onClose).toHaveBeenCalled();
    });

    it("applies larger padding when multiLine", () => {
      render(<Snackbar open={true} onClose={() => {}} message="Multi" multiLine />);
      expect(screen.getByRole("alert")).toHaveClass("py-4");
    });
  });
});

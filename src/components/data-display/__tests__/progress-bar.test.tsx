import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProgressBar } from "../progress-bar";

describe("ProgressBar", () => {
  it("renders with correct width", () => {
    const { container } = render(<ProgressBar value={50} />);
    const bar = container.querySelector("[style]") as HTMLElement;
    expect(bar.style.width).toBe("50%");
  });

  it("clamps value to 0-100", () => {
    const { container } = render(<ProgressBar value={150} />);
    const bar = container.querySelector("[style]") as HTMLElement;
    expect(bar.style.width).toBe("100%");
  });

  it("clamps negative value to 0", () => {
    const { container } = render(<ProgressBar value={-10} />);
    const bar = container.querySelector("[style]") as HTMLElement;
    expect(bar.style.width).toBe("0%");
  });

  it("has role=progressbar", () => {
    render(<ProgressBar value={50} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("has default aria-label of 'Progress'", () => {
    render(<ProgressBar value={50} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-label", "Progress");
  });

  it("allows custom aria-label", () => {
    render(<ProgressBar value={50} aria-label="Upload progress" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-label", "Upload progress");
  });

  it("sets aria-valuenow to clamped value", () => {
    render(<ProgressBar value={75} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "75");
  });

  it("sets aria-valuemin and aria-valuemax", () => {
    render(<ProgressBar value={50} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<ProgressBar ref={ref} value={50} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("merges className", () => {
    render(<ProgressBar value={50} className="custom-bar" />);
    expect(screen.getByRole("progressbar")).toHaveClass("custom-bar");
  });

  // === New feature tests: indeterminate prop ===

  describe("indeterminate prop", () => {
    it("renders indeterminate bar", () => {
      const { container } = render(<ProgressBar value={50} indeterminate />);
      const indeterminateBar = container.querySelector("[data-testid='progress-indeterminate']");
      expect(indeterminateBar).toBeInTheDocument();
    });

    it("does not set aria-valuenow when indeterminate", () => {
      render(<ProgressBar value={50} indeterminate />);
      expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
    });

    it("applies animation class when indeterminate", () => {
      const { container } = render(<ProgressBar indeterminate />);
      const bar = container.querySelector("[data-testid='progress-indeterminate']") as HTMLElement;
      expect(bar.className).toContain("animate-");
    });

    it("uses 40% width for the indeterminate bar", () => {
      const { container } = render(<ProgressBar indeterminate />);
      const bar = container.querySelector("[data-testid='progress-indeterminate']") as HTMLElement;
      expect(bar.style.width).toBe("40%");
    });
  });

  // === New feature tests: striped prop ===

  describe("striped prop", () => {
    it("applies striped class when striped is true", () => {
      const { container } = render(<ProgressBar value={60} striped />);
      const bars = container.querySelectorAll("[style]");
      const mainBar = bars[0] as HTMLElement;
      expect(mainBar).toHaveClass("spark-progress-striped");
    });

    it("does not apply striped class by default", () => {
      const { container } = render(<ProgressBar value={60} />);
      const bars = container.querySelectorAll("[style]");
      const mainBar = bars[0] as HTMLElement;
      expect(mainBar).not.toHaveClass("spark-progress-striped");
    });

    it("applies striped class to indeterminate bar", () => {
      const { container } = render(<ProgressBar indeterminate striped />);
      const bar = container.querySelector("[data-testid='progress-indeterminate']") as HTMLElement;
      expect(bar).toHaveClass("spark-progress-striped");
    });
  });

  // === New feature tests: bufferValue prop ===

  describe("bufferValue prop", () => {
    it("renders buffer bar when bufferValue is provided", () => {
      const { container } = render(<ProgressBar value={30} bufferValue={60} />);
      const bufferBar = container.querySelector("[data-testid='progress-buffer']") as HTMLElement;
      expect(bufferBar).toBeInTheDocument();
      expect(bufferBar.style.width).toBe("60%");
    });

    it("does not render buffer bar by default", () => {
      const { container } = render(<ProgressBar value={30} />);
      const bufferBar = container.querySelector("[data-testid='progress-buffer']");
      expect(bufferBar).not.toBeInTheDocument();
    });

    it("clamps bufferValue to 0-100", () => {
      const { container } = render(<ProgressBar value={30} bufferValue={150} />);
      const bufferBar = container.querySelector("[data-testid='progress-buffer']") as HTMLElement;
      expect(bufferBar.style.width).toBe("100%");
    });

    it("clamps negative bufferValue to 0", () => {
      const { container } = render(<ProgressBar value={30} bufferValue={-10} />);
      const bufferBar = container.querySelector("[data-testid='progress-buffer']") as HTMLElement;
      expect(bufferBar.style.width).toBe("0%");
    });

    it("buffer bar has reduced opacity", () => {
      const { container } = render(<ProgressBar value={30} bufferValue={60} />);
      const bufferBar = container.querySelector("[data-testid='progress-buffer']") as HTMLElement;
      expect(bufferBar).toHaveClass("opacity-30");
    });

    it("does not render buffer bar when indeterminate", () => {
      const { container } = render(<ProgressBar indeterminate bufferValue={60} />);
      const bufferBar = container.querySelector("[data-testid='progress-buffer']");
      expect(bufferBar).not.toBeInTheDocument();
    });
  });

  // === Combination tests ===

  it("renders striped with bufferValue", () => {
    const { container } = render(<ProgressBar value={40} striped bufferValue={70} />);
    const bufferBar = container.querySelector("[data-testid='progress-buffer']");
    expect(bufferBar).toBeInTheDocument();
    // Main bar should be striped
    const mainBar = container.querySelectorAll("[style]")[1] as HTMLElement;
    expect(mainBar).toHaveClass("spark-progress-striped");
  });
});

import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
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
});

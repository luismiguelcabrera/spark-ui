import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Skeleton, SkeletonText, SkeletonCircle } from "../skeleton";

describe("Skeleton", () => {
  it("renders a skeleton div", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("animate-pulse");
  });
});

describe("SkeletonText", () => {
  it("renders default 3 lines", () => {
    const { container } = render(<SkeletonText />);
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(3);
  });

  it("renders custom number of lines", () => {
    const { container } = render(<SkeletonText lines={5} />);
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(5);
  });
});

describe("SkeletonCircle", () => {
  it("renders with md size by default", () => {
    const { container } = render(<SkeletonCircle />);
    expect(container.firstChild).toHaveClass("rounded-full");
  });
});

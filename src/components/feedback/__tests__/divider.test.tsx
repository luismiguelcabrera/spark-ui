import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Divider } from "../divider";

describe("Divider", () => {
  it("renders an <hr> when no label is provided", () => {
    const { container } = render(<Divider />);
    expect(container.querySelector("hr")).toBeInTheDocument();
  });

  it("forwards ref to <hr>", () => {
    const ref = vi.fn();
    render(<Divider ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLHRElement));
  });

  it("has displayName", () => {
    expect(Divider.displayName).toBe("Divider");
  });

  it("merges className on <hr>", () => {
    const { container } = render(<Divider className="custom-class" />);
    expect(container.querySelector("hr")).toHaveClass("custom-class");
  });

  it("renders with separator role when label is provided", () => {
    render(<Divider label="OR" />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("displays the label text", () => {
    render(<Divider label="Section" />);
    expect(screen.getByText("Section")).toBeInTheDocument();
  });

  it("forwards ref to <div> when label is provided", () => {
    const ref = vi.fn();
    render(<Divider ref={ref} label="Test" />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("merges className when label is provided", () => {
    render(<Divider label="Test" className="custom-class" />);
    expect(screen.getByRole("separator")).toHaveClass("custom-class");
  });
});

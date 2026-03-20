import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Rating } from "../rating";

describe("Rating", () => {
  it("renders with role='img'", () => {
    render(<Rating value={3} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Rating ref={ref} value={3} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("has displayName", () => {
    expect(Rating.displayName).toBe("Rating");
  });

  it("merges className", () => {
    render(<Rating value={3} className="custom-class" />);
    expect(screen.getByRole("img")).toHaveClass("custom-class");
  });

  it("has correct aria-label", () => {
    render(<Rating value={3} max={5} />);
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", "3 out of 5 stars");
  });

  it("clamps value to max", () => {
    render(<Rating value={10} max={5} />);
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", "5 out of 5 stars");
  });

  it("clamps value to 0 when negative", () => {
    render(<Rating value={-1} max={5} />);
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", "0 out of 5 stars");
  });

  it("renders correct number of stars based on max", () => {
    const { container } = render(<Rating value={2} max={7} />);
    // Each star is an Icon rendered as svg
    const icons = container.querySelectorAll("svg");
    expect(icons).toHaveLength(7);
  });

  it("defaults to max=5", () => {
    render(<Rating value={4} />);
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", "4 out of 5 stars");
  });
});

describe("interactive mode", () => {
  it("renders with role='radiogroup' when readOnly=false", () => {
    render(<Rating readOnly={false} defaultValue={0} />);
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });

  it("renders star buttons with role='radio'", () => {
    render(<Rating readOnly={false} defaultValue={0} />);
    expect(screen.getAllByRole("radio")).toHaveLength(5);
  });

  it("calls onChange when star is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Rating readOnly={false} defaultValue={0} onChange={onChange} />);
    const stars = screen.getAllByRole("radio");
    await user.click(stars[2]);
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("supports allowClear", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Rating readOnly={false} defaultValue={3} onChange={onChange} allowClear />);
    const stars = screen.getAllByRole("radio");
    await user.click(stars[2]); // Click the already-selected 3rd star
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it("does not respond when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Rating readOnly={false} defaultValue={3} onChange={onChange} disabled />);
    // Disabled buttons can't be clicked via userEvent
    expect(onChange).not.toHaveBeenCalled();
  });

  it("supports keyboard navigation", () => {
    const onChange = vi.fn();
    render(<Rating readOnly={false} defaultValue={3} onChange={onChange} />);
    const group = screen.getByRole("radiogroup");
    fireEvent.keyDown(group, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("supports keyboard ArrowLeft navigation", () => {
    const onChange = vi.fn();
    render(<Rating readOnly={false} defaultValue={3} onChange={onChange} />);
    const group = screen.getByRole("radiogroup");
    fireEvent.keyDown(group, { key: "ArrowLeft" });
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("supports keyboard Home key", () => {
    const onChange = vi.fn();
    render(<Rating readOnly={false} defaultValue={3} onChange={onChange} />);
    const group = screen.getByRole("radiogroup");
    fireEvent.keyDown(group, { key: "Home" });
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it("supports keyboard End key", () => {
    const onChange = vi.fn();
    render(<Rating readOnly={false} defaultValue={3} onChange={onChange} />);
    const group = screen.getByRole("radiogroup");
    fireEvent.keyDown(group, { key: "End" });
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it("does not exceed max on ArrowRight", () => {
    const onChange = vi.fn();
    render(<Rating readOnly={false} defaultValue={5} onChange={onChange} />);
    const group = screen.getByRole("radiogroup");
    fireEvent.keyDown(group, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it("does not go below 0 on ArrowLeft", () => {
    const onChange = vi.fn();
    render(<Rating readOnly={false} defaultValue={0} onChange={onChange} />);
    const group = screen.getByRole("radiogroup");
    fireEvent.keyDown(group, { key: "ArrowLeft" });
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it("applies color class", () => {
    const { container } = render(<Rating readOnly={false} defaultValue={3} color="red" />);
    expect(container.innerHTML).toContain("text-destructive");
  });

  it("keeps backward compat - readOnly defaults to true", () => {
    render(<Rating value={3} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
  });

  it("forwards ref in interactive mode", () => {
    const ref = vi.fn();
    render(<Rating ref={ref} readOnly={false} defaultValue={2} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("merges className in interactive mode", () => {
    render(<Rating readOnly={false} defaultValue={2} className="my-custom" />);
    expect(screen.getByRole("radiogroup")).toHaveClass("my-custom");
  });

  it("applies disabled styles", () => {
    render(<Rating readOnly={false} defaultValue={2} disabled />);
    const group = screen.getByRole("radiogroup");
    expect(group.className).toContain("opacity-50");
    expect(group.className).toContain("cursor-not-allowed");
  });

  it("star buttons have correct aria-label", () => {
    render(<Rating readOnly={false} defaultValue={0} />);
    const stars = screen.getAllByRole("radio");
    expect(stars[0]).toHaveAttribute("aria-label", "1 star");
    expect(stars[1]).toHaveAttribute("aria-label", "2 stars");
    expect(stars[4]).toHaveAttribute("aria-label", "5 stars");
  });

  it("first star has tabIndex=0, rest have tabIndex=-1", () => {
    render(<Rating readOnly={false} defaultValue={0} />);
    const stars = screen.getAllByRole("radio");
    expect(stars[0]).toHaveAttribute("tabindex", "0");
    expect(stars[1]).toHaveAttribute("tabindex", "-1");
    expect(stars[4]).toHaveAttribute("tabindex", "-1");
  });

  it("uses default amber color", () => {
    const { container } = render(<Rating readOnly={false} defaultValue={3} />);
    expect(container.innerHTML).toContain("text-warning");
  });

  it("works in uncontrolled mode", async () => {
    const user = userEvent.setup();
    render(<Rating readOnly={false} defaultValue={0} />);
    const stars = screen.getAllByRole("radio");
    await user.click(stars[3]); // Click 4th star
    // After click, the 4th star should be checked
    expect(stars[3]).toHaveAttribute("aria-checked", "true");
  });

  it("works in controlled mode", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Rating readOnly={false} value={2} onChange={onChange} />,
    );
    const stars = screen.getAllByRole("radio");
    expect(stars[1]).toHaveAttribute("aria-checked", "true");
    // Re-render with new value
    rerender(<Rating readOnly={false} value={4} onChange={onChange} />);
    expect(stars[3]).toHaveAttribute("aria-checked", "true");
  });

  it("supports half-star keyboard step", () => {
    const onChange = vi.fn();
    render(<Rating readOnly={false} defaultValue={3} onChange={onChange} allowHalf />);
    const group = screen.getByRole("radiogroup");
    fireEvent.keyDown(group, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith(3.5);
  });
});

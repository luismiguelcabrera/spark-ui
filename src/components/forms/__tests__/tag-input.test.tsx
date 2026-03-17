import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe, toHaveNoViolations } from "jest-axe";
import { TagInput } from "../tag-input";

expect.extend(toHaveNoViolations);

describe("TagInput", () => {
  it("renders with initial tags", () => {
    render(<TagInput value={["React", "TypeScript"]} />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("adds a tag on Enter", () => {
    const onChange = vi.fn();
    render(<TagInput defaultValue={[]} onChange={onChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "React" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(["React"]);
  });

  it("removes tag on close button click", () => {
    const onChange = vi.fn();
    render(<TagInput defaultValue={["React"]} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("Remove React"));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("does not add duplicate tags by default", () => {
    const onChange = vi.fn();
    render(<TagInput defaultValue={["React"]} onChange={onChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "React" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("allows duplicates when allowDuplicates is true", () => {
    const onChange = vi.fn();
    render(<TagInput defaultValue={["React"]} allowDuplicates onChange={onChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "React" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(["React", "React"]);
  });

  it("respects maxTags", () => {
    render(<TagInput defaultValue={["a", "b"]} maxTags={2} />);
    expect(screen.getByText("2/2 tags")).toBeInTheDocument();
  });

  it("does not add tag when maxTags reached", () => {
    const onChange = vi.fn();
    render(<TagInput defaultValue={["a", "b"]} maxTags={2} onChange={onChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "c" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("removes last tag on Backspace when input is empty", () => {
    const onChange = vi.fn();
    render(<TagInput defaultValue={["React", "Vue"]} onChange={onChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.keyDown(input, { key: "Backspace" });
    expect(onChange).toHaveBeenCalledWith(["React"]);
  });

  it("does not add empty tags", () => {
    const onChange = vi.fn();
    render(<TagInput defaultValue={[]} onChange={onChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("shows label and error", () => {
    render(<TagInput label="Tags" error="Required" />);
    expect(screen.getByText("Tags")).toBeInTheDocument();
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TagInput label="Tags" aria-label="Tags" defaultValue={["React"]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

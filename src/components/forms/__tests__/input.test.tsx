import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Input } from "../input";

describe("Input", () => {
  it("renders a text input by default", () => {
    render(<Input placeholder="Name" />);
    expect(screen.getByPlaceholderText("Name")).toHaveAttribute("type", "text");
  });

  it("renders with a label", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("shows an error message", () => {
    render(<Input label="Email" error="Required" />);
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("shows hint when no error", () => {
    render(<Input label="Email" hint="We won't share it" />);
    expect(screen.getByText("We won't share it")).toBeInTheDocument();
  });

  it("hides hint when error is present", () => {
    render(<Input label="Email" hint="Helpful" error="Bad" />);
    expect(screen.queryByText("Helpful")).not.toBeInTheDocument();
    expect(screen.getByText("Bad")).toBeInTheDocument();
  });

  it("handles user typing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input placeholder="Type" onChange={onChange} />);
    await user.type(screen.getByPlaceholderText("Type"), "hello");
    expect(onChange).toHaveBeenCalledTimes(5);
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});

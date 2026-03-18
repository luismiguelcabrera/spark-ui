import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { useForm } from "react-hook-form";
import { Form } from "../form";

function TestForm({ onSubmit = vi.fn() }: { onSubmit?: (data: { name: string }) => void }) {
  const form = useForm({ defaultValues: { name: "" } });
  return (
    <Form form={form} onSubmit={onSubmit} aria-label="test form">
      <input {...form.register("name")} placeholder="Name" />
      <button type="submit">Submit</button>
    </Form>
  );
}

describe("Form", () => {
  it("renders a form element", () => {
    render(<TestForm />);
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("has displayName", () => {
    expect(Form.displayName).toBe("Form");
  });

  it("renders children", () => {
    render(<TestForm />);
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("has noValidate attribute", () => {
    render(<TestForm />);
    expect(screen.getByRole("form")).toHaveAttribute("novalidate");
  });

  it("merges className", () => {
    function FormWithClass() {
      const form = useForm({ defaultValues: { name: "" } });
      return (
        <Form form={form} onSubmit={vi.fn()} className="custom" aria-label="test">
          <input {...form.register("name")} />
        </Form>
      );
    }
    render(<FormWithClass />);
    expect(screen.getByRole("form")).toHaveClass("custom");
  });

  it("calls onSubmit on form submission", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);
    await user.type(screen.getByPlaceholderText("Name"), "John");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: "John" }),
      expect.anything(),
    );
  });
});

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Form } from "../form";
import { useForm } from "../../../hooks/use-form";
import { useFormSteps } from "../form-steps-context";
import { Input } from "../input";
import { Button } from "../button";

// ── Helpers ──

function StepActions() {
  const { isFirst, isLast, next, prev, currentStep, totalSteps, goToError, stepErrors } =
    useFormSteps();

  return (
    <div>
      <span data-testid="step-info">
        Step {currentStep + 1} of {totalSteps}
      </span>
      {Object.values(stepErrors).some(Boolean) && (
        <button type="button" onClick={goToError} data-testid="go-to-error">
          Fix errors
        </button>
      )}
      {!isFirst && (
        <button type="button" onClick={prev} data-testid="prev">
          Back
        </button>
      )}
      {isLast ? (
        <Form.Submit data-testid="complete">Complete</Form.Submit>
      ) : (
        <button type="button" onClick={next} data-testid="next">
          Continue
        </button>
      )}
    </div>
  );
}

function MultiStepForm({
  onSubmit = vi.fn(),
}: {
  onSubmit?: (values: { name: string; email: string; card: string }) => void;
}) {
  const form = useForm({
    initialValues: { name: "", email: "", card: "" },
  });

  return (
    <Form form={form} onSubmit={onSubmit} aria-label="wizard form">
      <Form.Steps>
        <Form.Step title="Account" fields={["name", "email"]}>
          <Form.Field name="name" label="Name" rules={{ required: true }}>
            <Input placeholder="Name" />
          </Form.Field>
          <Form.Field name="email" label="Email" rules={{ required: true }}>
            <Input placeholder="Email" />
          </Form.Field>
          <StepActions />
        </Form.Step>
        <Form.Step title="Payment" fields={["card"]}>
          <Form.Field name="card" label="Card" rules={{ required: true }}>
            <Input placeholder="Card number" />
          </Form.Field>
          <StepActions />
        </Form.Step>
      </Form.Steps>
    </Form>
  );
}

// ── Tests ──

describe("Form.Steps (multi-step)", () => {
  it("renders only the first step initially", () => {
    render(<MultiStepForm />);
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Card number")).not.toBeInTheDocument();
    expect(screen.getByTestId("step-info")).toHaveTextContent("Step 1 of 2");
  });

  it("validates current step before advancing", async () => {
    const user = userEvent.setup();
    render(<MultiStepForm />);

    // Try to advance without filling required fields
    await user.click(screen.getByTestId("next"));

    // Should stay on step 1 with errors
    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });
    expect(screen.getByTestId("step-info")).toHaveTextContent("Step 1 of 2");
  });

  it("advances to next step after filling required fields", async () => {
    const user = userEvent.setup();
    render(<MultiStepForm />);

    await user.type(screen.getByPlaceholderText("Name"), "John");
    await user.type(screen.getByPlaceholderText("Email"), "john@test.com");
    await user.click(screen.getByTestId("next"));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Card number")).toBeInTheDocument();
      expect(screen.getByTestId("step-info")).toHaveTextContent("Step 2 of 2");
    });
  });

  it("can go back to previous step", async () => {
    const user = userEvent.setup();
    render(<MultiStepForm />);

    // Fill step 1 and advance
    await user.type(screen.getByPlaceholderText("Name"), "John");
    await user.type(screen.getByPlaceholderText("Email"), "john@test.com");
    await user.click(screen.getByTestId("next"));

    await waitFor(() => {
      expect(screen.getByTestId("step-info")).toHaveTextContent("Step 2 of 2");
    });

    // Go back
    await user.click(screen.getByTestId("prev"));

    await waitFor(() => {
      expect(screen.getByTestId("step-info")).toHaveTextContent("Step 1 of 2");
      expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    });
  });

  it("submits form on last step", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<MultiStepForm onSubmit={onSubmit} />);

    // Fill step 1
    await user.type(screen.getByPlaceholderText("Name"), "John");
    await user.type(screen.getByPlaceholderText("Email"), "john@test.com");
    await user.click(screen.getByTestId("next"));

    // Fill step 2
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Card number")).toBeInTheDocument();
    });
    await user.type(screen.getByPlaceholderText("Card number"), "4242424242424242");
    await user.click(screen.getByTestId("complete"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: "John",
        email: "john@test.com",
        card: "4242424242424242",
      });
    });
  });

  it("shows stepper when showStepper is true", () => {
    function StepperForm() {
      const form = useForm({ initialValues: { a: "" } });
      return (
        <Form form={form} aria-label="form">
          <Form.Steps showStepper>
            <Form.Step title="Step One" fields={["a"]}>
              <Form.Field name="a" label="A">
                <Input />
              </Form.Field>
            </Form.Step>
          </Form.Steps>
        </Form>
      );
    }
    render(<StepperForm />);
    expect(screen.getByRole("list", { name: "Progress" })).toBeInTheDocument();
  });

  it("does not show back button on first step", () => {
    render(<MultiStepForm />);
    expect(screen.queryByTestId("prev")).not.toBeInTheDocument();
  });

  it("shows complete button on last step instead of continue", async () => {
    const user = userEvent.setup();
    render(<MultiStepForm />);

    await user.type(screen.getByPlaceholderText("Name"), "John");
    await user.type(screen.getByPlaceholderText("Email"), "john@test.com");
    await user.click(screen.getByTestId("next"));

    await waitFor(() => {
      expect(screen.queryByTestId("next")).not.toBeInTheDocument();
      expect(screen.getByTestId("complete")).toBeInTheDocument();
    });
  });
});

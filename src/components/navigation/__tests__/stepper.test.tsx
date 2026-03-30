import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Stepper } from "../stepper";

const steps = [
  { label: "Account" },
  { label: "Profile", description: "Set up your profile" },
  { label: "Review" },
];

describe("Stepper", () => {
  it("renders all step labels", () => {
    render(<Stepper steps={steps} activeStep={0} />);
    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Review")).toBeInTheDocument();
  });

  it("renders step descriptions", () => {
    render(<Stepper steps={steps} activeStep={0} />);
    expect(screen.getByText("Set up your profile")).toBeInTheDocument();
  });

  it("shows step numbers for upcoming and active steps", () => {
    render(<Stepper steps={steps} activeStep={1} />);
    // Step 3 (upcoming) shows number 3
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("defaults to horizontal orientation", () => {
    const { container } = render(<Stepper steps={steps} activeStep={0} />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("flex-row");
  });

  it("supports vertical orientation", () => {
    const { container } = render(<Stepper steps={steps} activeStep={0} orientation="vertical" />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("flex-col");
  });

  it("marks completed steps with check icon", () => {
    render(<Stepper steps={steps} activeStep={2} />);
    // Steps 0 and 1 are complete, so their numbers should not show
    expect(screen.queryByText("1")).not.toBeInTheDocument();
    expect(screen.queryByText("2")).not.toBeInTheDocument();
    // Step 3 is active
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});

describe("Stepper — editable prop", () => {
  it("calls onStepClick when clicking a completed step", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Stepper steps={steps} activeStep={2} editable onStepClick={onClick} />);
    // Click the first step button (completed)
    const stepButtons = screen.getAllByRole("button");
    await user.click(stepButtons[0]); // "Step 1: Account"
    expect(onClick).toHaveBeenCalledWith(0);
  });

  it("does not fire onStepClick for non-completed steps", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Stepper steps={steps} activeStep={1} editable onStepClick={onClick} />);
    const stepButtons = screen.getAllByRole("button");
    // Step 2 (index 1) is active, Step 3 (index 2) is upcoming — neither should fire
    await user.click(stepButtons[1]); // active
    await user.click(stepButtons[2]); // upcoming
    expect(onClick).not.toHaveBeenCalled();
  });

  it("completed steps have cursor-pointer when editable", () => {
    render(<Stepper steps={steps} activeStep={2} editable onStepClick={vi.fn()} />);
    const stepButtons = screen.getAllByRole("button");
    expect(stepButtons[0]).toHaveClass("cursor-pointer");
    expect(stepButtons[1]).toHaveClass("cursor-pointer");
    // Active step should not be cursor-pointer
    expect(stepButtons[2]).toHaveClass("cursor-default");
  });

  it("non-editable steps are disabled buttons", () => {
    render(<Stepper steps={steps} activeStep={1} />);
    const stepButtons = screen.getAllByRole("button");
    // All buttons should be disabled since editable is false
    stepButtons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });
});

describe("Stepper — error state", () => {
  const stepsWithError = [
    { label: "Account" },
    { label: "Payment", error: true },
    { label: "Confirm" },
  ];

  it("shows error styling for steps with error", () => {
    render(<Stepper steps={stepsWithError} activeStep={1} />);
    // The error step label should have red text
    const paymentLabel = screen.getByText("Payment");
    expect(paymentLabel).toHaveClass("text-red-600");
  });

  it("renders error icon instead of step number for error steps", () => {
    render(<Stepper steps={stepsWithError} activeStep={1} />);
    // Step 2 (Payment) has error, so number "2" should not appear
    expect(screen.queryByText("2")).not.toBeInTheDocument();
  });

  it("error step circle has red border", () => {
    render(<Stepper steps={stepsWithError} activeStep={1} />);
    const stepButtons = screen.getAllByRole("button");
    // Payment is step index 1
    expect(stepButtons[1]).toHaveClass("border-red-500");
    expect(stepButtons[1]).toHaveClass("bg-red-100");
  });
});

describe("Stepper — altLabels prop", () => {
  it("renders labels below the connector row in horizontal mode", () => {
    render(<Stepper steps={steps} activeStep={1} altLabels />);
    // All labels should still be present
    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Review")).toBeInTheDocument();
  });

  it("still renders step buttons with aria-label", () => {
    render(<Stepper steps={steps} activeStep={0} altLabels />);
    expect(screen.getByLabelText("Step 1: Account")).toBeInTheDocument();
    expect(screen.getByLabelText("Step 2: Profile")).toBeInTheDocument();
    expect(screen.getByLabelText("Step 3: Review")).toBeInTheDocument();
  });

  it("does not use altLabels layout in vertical mode", () => {
    const { container } = render(
      <Stepper steps={steps} activeStep={0} altLabels orientation="vertical" />,
    );
    const root = container.firstChild as HTMLElement;
    // Should use the normal vertical layout (flex-col on root)
    expect(root).toHaveClass("flex-col");
  });

  it("editable works with altLabels", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Stepper steps={steps} activeStep={2} altLabels editable onStepClick={onClick} />,
    );
    const stepButtons = screen.getAllByRole("button");
    await user.click(stepButtons[0]); // completed step
    expect(onClick).toHaveBeenCalledWith(0);
  });
});

describe("Stepper — aria attributes", () => {
  it("sets aria-current=step on active step", () => {
    render(<Stepper steps={steps} activeStep={1} />);
    const stepButtons = screen.getAllByRole("button");
    expect(stepButtons[1]).toHaveAttribute("aria-current", "step");
  });

  it("does not set aria-current on non-active steps", () => {
    render(<Stepper steps={steps} activeStep={1} />);
    const stepButtons = screen.getAllByRole("button");
    expect(stepButtons[0]).not.toHaveAttribute("aria-current");
    expect(stepButtons[2]).not.toHaveAttribute("aria-current");
  });

  it("each step button has an aria-label", () => {
    render(<Stepper steps={steps} activeStep={0} />);
    expect(screen.getByLabelText("Step 1: Account")).toBeInTheDocument();
    expect(screen.getByLabelText("Step 2: Profile")).toBeInTheDocument();
    expect(screen.getByLabelText("Step 3: Review")).toBeInTheDocument();
  });
});

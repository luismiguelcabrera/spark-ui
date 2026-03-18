import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
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

  it("marks completed steps with check icon (number not shown)", () => {
    render(<Stepper steps={steps} activeStep={2} />);
    // Steps 0 and 1 are complete, so their numbers should not show
    expect(screen.queryByText("1")).not.toBeInTheDocument();
    expect(screen.queryByText("2")).not.toBeInTheDocument();
    // Step 3 is active
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("uses role='list' on root element", () => {
    render(<Stepper steps={steps} activeStep={0} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("has aria-label='Progress' on root", () => {
    render(<Stepper steps={steps} activeStep={0} />);
    expect(screen.getByLabelText("Progress")).toBeInTheDocument();
  });

  it("uses role='listitem' on each step", () => {
    render(<Stepper steps={steps} activeStep={0} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
  });

  it("sets aria-current='step' on active step", () => {
    render(<Stepper steps={steps} activeStep={1} />);
    const items = screen.getAllByRole("listitem");
    expect(items[1]).toHaveAttribute("aria-current", "step");
  });

  it("does not set aria-current on non-active steps", () => {
    render(<Stepper steps={steps} activeStep={1} />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).not.toHaveAttribute("aria-current");
    expect(items[2]).not.toHaveAttribute("aria-current");
  });

  it("renders sr-only state annotations", () => {
    render(<Stepper steps={steps} activeStep={1} />);
    expect(screen.getByText("(completed)")).toBeInTheDocument();
    expect(screen.getByText("(current)")).toBeInTheDocument();
    expect(screen.getByText("(upcoming)")).toBeInTheDocument();
  });

  it("active step label has text-primary class", () => {
    render(<Stepper steps={steps} activeStep={1} />);
    const profileLabel = screen.getByText("Profile");
    expect(profileLabel).toHaveClass("text-primary");
  });

  it("upcoming step label has text-slate-400 class", () => {
    render(<Stepper steps={steps} activeStep={0} />);
    const reviewLabel = screen.getByText("Review");
    expect(reviewLabel).toHaveClass("text-slate-400");
  });

  it("completed step label has text-secondary class", () => {
    render(<Stepper steps={steps} activeStep={2} />);
    const accountLabel = screen.getByText("Account");
    expect(accountLabel).toHaveClass("text-secondary");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Stepper ref={ref} steps={steps} activeStep={0} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Stepper ref={ref} steps={steps} activeStep={0} className="custom" />);
    expect(ref.current).toHaveClass("custom");
  });

  it("has displayName", () => {
    expect(Stepper.displayName).toBe("Stepper");
  });
});

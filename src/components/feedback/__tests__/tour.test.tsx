import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Tour, type TourStep } from "../tour";

const basicSteps: TourStep[] = [
  { title: "Step 1", description: "First step description" },
  { title: "Step 2", description: "Second step description" },
  { title: "Step 3", description: "Third step description" },
];

const stepsWithTargets: TourStep[] = [
  {
    target: "#target-1",
    title: "Target Step 1",
    description: "Highlight the first element",
    placement: "bottom",
  },
  {
    target: "#target-2",
    title: "Target Step 2",
    description: "Highlight the second element",
    placement: "right",
  },
];

describe("Tour", () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = "";
  });

  it("renders nothing when closed", () => {
    const { container } = render(
      <Tour steps={basicSteps} open={false} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders when open", () => {
    render(<Tour steps={basicSteps} open />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("shows the first step title and description", () => {
    render(<Tour steps={basicSteps} open />);
    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByText("First step description")).toBeInTheDocument();
  });

  it("shows step counter", () => {
    render(<Tour steps={basicSteps} open />);
    expect(screen.getByText("1 of 3")).toBeInTheDocument();
  });

  it("shows Next button on first step", () => {
    render(<Tour steps={basicSteps} open />);
    expect(
      screen.getByRole("button", { name: "Next" })
    ).toBeInTheDocument();
  });

  it("does not show Previous button on first step", () => {
    render(<Tour steps={basicSteps} open />);
    expect(
      screen.queryByRole("button", { name: "Previous" })
    ).not.toBeInTheDocument();
  });

  it("navigates to next step on Next click", async () => {
    const user = userEvent.setup();
    render(<Tour steps={basicSteps} open />);

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Step 2")).toBeInTheDocument();
    expect(screen.getByText("2 of 3")).toBeInTheDocument();
  });

  it("shows Previous button on non-first step", async () => {
    const user = userEvent.setup();
    render(<Tour steps={basicSteps} open />);

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(
      screen.getByRole("button", { name: "Previous" })
    ).toBeInTheDocument();
  });

  it("navigates back on Previous click", async () => {
    const user = userEvent.setup();
    render(<Tour steps={basicSteps} open />);

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Step 2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous" }));
    expect(screen.getByText("Step 1")).toBeInTheDocument();
  });

  it("shows Finish button on last step", async () => {
    const user = userEvent.setup();
    render(<Tour steps={basicSteps} open />);

    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(
      screen.getByRole("button", { name: "Finish" })
    ).toBeInTheDocument();
  });

  it("calls onFinish when Finish is clicked", async () => {
    const user = userEvent.setup();
    const onFinish = vi.fn();
    render(<Tour steps={basicSteps} open onFinish={onFinish} />);

    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Finish" }));
    expect(onFinish).toHaveBeenCalledOnce();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Tour steps={basicSteps} open onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Close tour" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("has close button by default", () => {
    render(<Tour steps={basicSteps} open />);
    expect(
      screen.getByRole("button", { name: "Close tour" })
    ).toBeInTheDocument();
  });

  it("hides close button when closable is false", () => {
    render(<Tour steps={basicSteps} open closable={false} />);
    expect(
      screen.queryByRole("button", { name: "Close tour" })
    ).not.toBeInTheDocument();
  });

  it("closes on Escape key", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <Tour
        steps={basicSteps}
        open
        onClose={onClose}
        onOpenChange={onOpenChange}
      />
    );

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onCurrentChange when navigating steps", async () => {
    const user = userEvent.setup();
    const onCurrentChange = vi.fn();
    render(
      <Tour steps={basicSteps} open onCurrentChange={onCurrentChange} />
    );

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(onCurrentChange).toHaveBeenCalledWith(1);
  });

  it("supports controlled current step", () => {
    render(<Tour steps={basicSteps} open current={1} />);
    expect(screen.getByText("Step 2")).toBeInTheDocument();
    expect(screen.getByText("2 of 3")).toBeInTheDocument();
  });

  it("uses defaultOpen for initial state", () => {
    render(<Tour steps={basicSteps} defaultOpen />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("uses defaultCurrent for initial step", () => {
    render(<Tour steps={basicSteps} open defaultCurrent={2} />);
    expect(screen.getByText("Step 3")).toBeInTheDocument();
  });

  it("renders cover image when provided", () => {
    const stepsWithCover: TourStep[] = [
      {
        title: "Welcome",
        cover: <img src="/welcome.png" alt="Welcome" data-testid="cover" />,
      },
    ];
    render(<Tour steps={stepsWithCover} open />);
    expect(screen.getByTestId("cover")).toBeInTheDocument();
  });

  it("has aria-label on dialog", () => {
    render(<Tour steps={basicSteps} open />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute(
      "aria-label",
      "Tour step 1 of 3: Step 1"
    );
  });

  it("has aria-modal on dialog", () => {
    render(<Tour steps={basicSteps} open />);
    expect(screen.getByRole("dialog")).toHaveAttribute(
      "aria-modal",
      "true"
    );
  });

  it("merges className", () => {
    render(<Tour steps={basicSteps} open className="my-custom-tour" />);
    expect(screen.getByRole("dialog")).toHaveClass("my-custom-tour");
  });

  it("renders mask overlay when mask=true and no target", () => {
    const { container } = render(<Tour steps={basicSteps} open mask />);
    const overlay = container.querySelector(".bg-black\\/50");
    expect(overlay).toBeInTheDocument();
  });

  it("does not render mask overlay when mask=false", () => {
    const { container } = render(
      <Tour steps={basicSteps} open mask={false} />
    );
    const overlay = container.querySelector(".bg-black\\/50");
    expect(overlay).not.toBeInTheDocument();
  });

  it("renders in centered mode when step has no target", () => {
    render(<Tour steps={basicSteps} open />);
    const dialog = screen.getByRole("dialog");
    expect(dialog.style.position).toBe("fixed");
  });

  it("handles steps with target selectors", () => {
    // Create target element
    const targetEl = document.createElement("div");
    targetEl.id = "target-1";
    document.body.appendChild(targetEl);

    render(<Tour steps={stepsWithTargets} open />);
    expect(screen.getByText("Target Step 1")).toBeInTheDocument();

    document.body.removeChild(targetEl);
  });

  it("renders with single step (no Previous, shows Finish)", () => {
    const singleStep: TourStep[] = [{ title: "Only Step" }];
    render(<Tour steps={singleStep} open />);

    expect(
      screen.queryByRole("button", { name: "Previous" })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Finish" })
    ).toBeInTheDocument();
  });

  it("focus ring classes on buttons", () => {
    render(<Tour steps={basicSteps} open />);
    const nextBtn = screen.getByRole("button", { name: "Next" });
    expect(nextBtn.className).toContain("focus-visible:ring-2");
  });
});

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";

const stepperVariants = cva("flex", {
  variants: {
    orientation: {
      horizontal: "flex-row items-start",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

type StepItem = {
  label: string;
  description?: string;
  /** Show error state for this step (red icon + color). */
  error?: boolean;
};

type StepState = "complete" | "active" | "upcoming" | "error";

type StepperProps = {
  steps: StepItem[];
  activeStep: number;
  /** Allow clicking completed steps to navigate back. */
  editable?: boolean;
  /** Callback when a step is clicked (only fires for completed steps when editable). */
  onStepClick?: (index: number) => void;
  /** Show labels below circles instead of beside them. */
  altLabels?: boolean;
  className?: string;
} & VariantProps<typeof stepperVariants>;

function Stepper({
  steps,
  activeStep,
  orientation = "horizontal",
  editable = false,
  onStepClick,
  altLabels = false,
  className,
}: StepperProps) {
  const getState = (index: number, step: StepItem): StepState => {
    if (step.error) return "error";
    if (index < activeStep) return "complete";
    if (index === activeStep) return "active";
    return "upcoming";
  };

  const isHorizontal = orientation === "horizontal";

  const handleStepClick = (index: number, state: StepState) => {
    if (editable && state === "complete" && onStepClick) {
      onStepClick(index);
    }
  };

  // Alt labels layout: labels below the entire connector row
  if (altLabels && isHorizontal) {
    return (
      <div className={cn("flex flex-col", className)}>
        {/* Row of circles + connectors */}
        <div className="flex items-center">
          {steps.map((step, i) => {
            const state = getState(i, step);
            const isLast = i === steps.length - 1;
            const isClickable = editable && state === "complete";

            return (
              <div key={step.label} className="flex flex-1 items-center">
                <div className="flex flex-1 flex-col items-center">
                  {/* Step circle */}
                  <button
                    type="button"
                    aria-label={`Step ${i + 1}: ${step.label}`}
                    aria-current={state === "active" ? "step" : undefined}
                    disabled={!isClickable}
                    onClick={() => handleStepClick(i, state)}
                    className={cn(
                      s.stepperCircle,
                      state === "complete" && s.stepperCircleComplete,
                      state === "active" && s.stepperCircleActive,
                      state === "upcoming" && s.stepperCircleUpcoming,
                      state === "error" && "bg-red-100 text-red-600 border-2 border-red-500",
                      isClickable && "cursor-pointer hover:ring-2 hover:ring-primary/30",
                      !isClickable && "cursor-default",
                    )}
                  >
                    {state === "complete" ? (
                      <Icon name="check" size="sm" />
                    ) : state === "error" ? (
                      <Icon name="alert-circle" size="sm" />
                    ) : (
                      <span>{i + 1}</span>
                    )}
                  </button>
                </div>
                {/* Connector */}
                {!isLast && (
                  <div
                    className={cn(
                      s.stepperConnector,
                      "mx-2",
                      state === "complete"
                        ? s.stepperConnectorComplete
                        : state === "error"
                          ? "bg-red-300"
                          : s.stepperConnectorIncomplete,
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
        {/* Row of labels below */}
        <div className="flex mt-2">
          {steps.map((step, i) => {
            const state = getState(i, step);
            return (
              <div key={step.label} className="flex-1 text-center">
                <p
                  className={cn(
                    s.stepperLabel,
                    state === "active"
                      ? "text-primary"
                      : state === "complete"
                        ? "text-secondary"
                        : state === "error"
                          ? "text-red-600"
                          : "text-slate-400",
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {step.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(stepperVariants({ orientation, className }))}>
      {steps.map((step, i) => {
        const state = getState(i, step);
        const isLast = i === steps.length - 1;
        const isClickable = editable && state === "complete";

        return (
          <div
            key={step.label}
            className={cn(
              "flex",
              isHorizontal ? "flex-1 flex-col items-center" : "flex-row gap-3"
            )}
          >
            <div
              className={cn(
                "flex items-center",
                isHorizontal ? "w-full" : "flex-col"
              )}
            >
              {/* Step circle */}
              <button
                type="button"
                aria-label={`Step ${i + 1}: ${step.label}`}
                aria-current={state === "active" ? "step" : undefined}
                disabled={!isClickable}
                onClick={() => handleStepClick(i, state)}
                className={cn(
                  s.stepperCircle,
                  state === "complete" && s.stepperCircleComplete,
                  state === "active" && s.stepperCircleActive,
                  state === "upcoming" && s.stepperCircleUpcoming,
                  state === "error" && "bg-red-100 text-red-600 border-2 border-red-500",
                  isClickable && "cursor-pointer hover:ring-2 hover:ring-primary/30",
                  !isClickable && "cursor-default",
                )}
              >
                {state === "complete" ? (
                  <Icon name="check" size="sm" />
                ) : state === "error" ? (
                  <Icon name="alert-circle" size="sm" />
                ) : (
                  <span>{i + 1}</span>
                )}
              </button>

              {/* Connector */}
              {!isLast && (
                <div
                  className={cn(
                    s.stepperConnector,
                    isHorizontal ? "mx-2" : "w-0.5 h-8 mx-auto my-1",
                    state === "complete"
                      ? s.stepperConnectorComplete
                      : state === "error"
                        ? "bg-red-300"
                        : s.stepperConnectorIncomplete,
                  )}
                />
              )}
            </div>

            {/* Label */}
            <div className={cn(isHorizontal ? "text-center" : "pb-8")}>
              <p
                className={cn(
                  s.stepperLabel,
                  state === "active"
                    ? "text-primary"
                    : state === "complete"
                      ? "text-secondary"
                      : state === "error"
                        ? "text-red-600"
                        : "text-slate-400",
                )}
              >
                {step.label}
              </p>
              {step.description && (
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { Stepper, stepperVariants };
export type { StepperProps, StepItem, StepState };

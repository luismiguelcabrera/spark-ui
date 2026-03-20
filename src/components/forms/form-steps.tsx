"use client";

/* eslint-disable @typescript-eslint/no-explicit-any -- generic form steps requires any */

import {
  useState,
  useCallback,
  useMemo,
  Children,
  isValidElement,
  type ReactNode,
} from "react";
import { useFormContext } from "./form-context";
import { FormStepsContext } from "./form-steps-context";
import { Stepper } from "../navigation/stepper";

type FormStepsProps = {
  navigation?: "linear" | "free" | "completed";
  showStepper?: boolean;
  children: ReactNode;
  className?: string;
};

function FormSteps({
  navigation = "linear",
  showStepper = false,
  children,
  className,
}: FormStepsProps) {
  const { form } = useFormContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<Record<number, boolean>>({});

  // Extract step metadata from children
  const steps = useMemo(() => {
    const result: { title: string; fields: string[] }[] = [];
    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.props) {
        const props = child.props as { title?: string; fields?: string[] };
        result.push({
          title: props.title ?? `Step ${result.length + 1}`,
          fields: props.fields ?? [],
        });
      }
    });
    return result;
  }, [children]);

  const totalSteps = steps.length;
  const titles = useMemo(() => steps.map((s) => s.title), [steps]);

  // Check which steps have validation errors
  const stepErrors = useMemo(() => {
    const result: Record<number, boolean> = {};
    steps.forEach((step, index) => {
      result[index] = step.fields.some((field) => {
        const state = form.getFieldState(field as any);
        return state.error !== null;
      });
    });
    return result;
  }, [steps, form]);

  // Validate current step fields (async — runs resolver + async validators)
  const validateStep = useCallback(
    async (stepIndex: number): Promise<boolean> => {
      const stepFields = steps[stepIndex]?.fields ?? [];

      for (const field of stepFields) {
        form.setFieldTouched(field as any, true);
      }

      // Use async validation to include resolver + async validators
      const errors = await form.validateAsync();

      const hasError = stepFields.some(
        (field) => !!errors[field as any],
      );

      return !hasError;
    },
    [steps, form],
  );

  const next = useCallback(async (): Promise<boolean> => {
    const isValid = await validateStep(currentStep);
    if (!isValid) return false;

    setCompleted((prev) => ({ ...prev, [currentStep]: true }));
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
    return true;
  }, [currentStep, totalSteps, validateStep]);

  const prev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const canGoTo = useCallback(
    (index: number): boolean => {
      if (index < 0 || index >= totalSteps) return false;
      if (navigation === "free") return true;
      if (navigation === "completed") return index <= currentStep || !!completed[index];
      // linear: can only go to visited/completed steps or current+1
      return index <= currentStep;
    },
    [navigation, currentStep, totalSteps, completed],
  );

  const goTo = useCallback(
    (index: number) => {
      if (canGoTo(index)) {
        setCurrentStep(index);
      }
    },
    [canGoTo],
  );

  const goToError = useCallback(() => {
    for (let i = 0; i < totalSteps; i++) {
      if (stepErrors[i]) {
        setCurrentStep(i);
        return;
      }
    }
  }, [totalSteps, stepErrors]);

  const stepCompleted = completed;

  const contextValue = useMemo(
    () => ({
      currentStep,
      totalSteps,
      titles,
      isFirst: currentStep === 0,
      isLast: currentStep === totalSteps - 1,
      next,
      prev,
      goTo,
      goToError,
      stepErrors,
      stepCompleted,
      canGoTo,
      navigation,
    }),
    [
      currentStep,
      totalSteps,
      titles,
      next,
      prev,
      goTo,
      goToError,
      stepErrors,
      stepCompleted,
      canGoTo,
      navigation,
    ],
  );

  // Render only the active step's children
  const activeChild = Children.toArray(children)[currentStep];

  return (
    <FormStepsContext.Provider value={contextValue}>
      <div className={className}>
        {showStepper && (
          <Stepper
            steps={steps.map((s) => ({ label: s.title }))}
            activeStep={currentStep}
            className="mb-6"
          />
        )}
        {activeChild}
      </div>
    </FormStepsContext.Provider>
  );
}
FormSteps.displayName = "FormSteps";

export { FormSteps };
export type { FormStepsProps };

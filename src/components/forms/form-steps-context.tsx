"use client";

import { createContext, useContext } from "react";

type FormStepsContextValue = {
  currentStep: number;
  totalSteps: number;
  titles: string[];
  isFirst: boolean;
  isLast: boolean;
  next: () => Promise<boolean>;
  prev: () => void;
  goTo: (index: number) => void;
  goToError: () => void;
  stepErrors: Record<number, boolean>;
  stepCompleted: Record<number, boolean>;
  canGoTo: (index: number) => boolean;
  navigation: "linear" | "free" | "completed";
};

const FormStepsContext = createContext<FormStepsContextValue | null>(null);

function useFormSteps(): FormStepsContextValue {
  const ctx = useContext(FormStepsContext);
  if (!ctx) {
    throw new Error("useFormSteps must be used within a <Form.Steps> provider");
  }
  return ctx;
}

export { FormStepsContext, useFormSteps };
export type { FormStepsContextValue };

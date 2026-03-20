"use client";

import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type FormStepProps = {
  title: string;
  fields?: string[];
  children: ReactNode;
  className?: string;
};

function FormStep({ children, className }: FormStepProps) {
  return <div className={cn(className)}>{children}</div>;
}
FormStep.displayName = "FormStep";

export { FormStep };
export type { FormStepProps };

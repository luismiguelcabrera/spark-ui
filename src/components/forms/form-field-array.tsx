"use client";

/* eslint-disable @typescript-eslint/no-explicit-any -- field array requires any for arbitrary values */

import type { ReactNode } from "react";
import { useFormContext } from "./form-context";
import { useFieldArray } from "../../hooks/use-field-array";
import type { UseFieldArrayReturn } from "../../hooks/use-field-array";
import { cn } from "../../lib/utils";

type FormFieldArrayProps = {
  name: string;
  children: (fieldArray: UseFieldArrayReturn) => ReactNode;
  className?: string;
};

function FormFieldArray({ name, children, className }: FormFieldArrayProps) {
  const { form } = useFormContext();
  const fieldArray = useFieldArray(form, name as any);

  return className ? (
    <div className={cn(className)}>{children(fieldArray)}</div>
  ) : (
    <>{children(fieldArray)}</>
  );
}
FormFieldArray.displayName = "FormFieldArray";

export { FormFieldArray };
export type { FormFieldArrayProps };

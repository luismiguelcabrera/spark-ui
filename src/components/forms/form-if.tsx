"use client";

import type { ReactNode } from "react";
import { useFormContext } from "./form-context";

/* eslint-disable @typescript-eslint/no-explicit-any -- field values are arbitrary */

type FormIfProps = {
  /** Field name to observe. */
  name: string;
  /** Show children when value exactly matches this. */
  is?: any;
  /** Show children when value is included in this array. */
  oneOf?: any[];
  /** Show children when this predicate returns true. */
  when?: (value: any) => boolean;
  children: ReactNode;
};

function FormIf({ name, is, oneOf, when, children }: FormIfProps) {
  const { form } = useFormContext();
  const value = form.values[name];

  let show = false;

  if (when) {
    // Priority 1: custom predicate
    show = when(value);
  } else if (oneOf !== undefined) {
    // Priority 2: value in array
    show = oneOf.includes(value);
  } else if (is !== undefined) {
    // Priority 3: exact match
    show = value === is;
  } else {
    // Default: truthy check
    show = Boolean(value);
  }

  if (!show) return null;

  return <>{children}</>;
}

FormIf.displayName = "FormIf";

export { FormIf };
export type { FormIfProps };

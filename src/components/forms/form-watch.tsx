"use client";

import type { ReactNode } from "react";
import { useFormContext } from "./form-context";

/* eslint-disable @typescript-eslint/no-explicit-any -- render prop returns arbitrary field values */

type FormWatchProps = {
  /** Field name(s) to watch. If omitted, watches all values. */
  name?: string | string[];
  /** Render prop receiving the watched value(s). */
  children: (value: any) => ReactNode;
};

function FormWatch({ name, children }: FormWatchProps) {
  const { form } = useFormContext();

  if (name === undefined) {
    return <>{children(form.values)}</>;
  }

  if (typeof name === "string") {
    return <>{children(form.values[name])}</>;
  }

  // Array of names — build object with requested values
  const watched: Record<string, any> = {};
  for (const key of name) {
    watched[key] = form.values[key];
  }
  return <>{children(watched)}</>;
}

FormWatch.displayName = "FormWatch";

export { FormWatch };
export type { FormWatchProps };

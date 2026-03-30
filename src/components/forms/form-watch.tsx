"use client";

import { useRef, type ReactNode } from "react";
import { useFormContext } from "./form-context";

/* eslint-disable @typescript-eslint/no-explicit-any -- render prop returns arbitrary field values */

type FormWatchProps = {
  /** Field name(s) to watch. If omitted, watches all values. */
  name?: string | string[];
  /** Render prop receiving the watched value(s). */
  children: (value: any) => ReactNode;
};

/**
 * Compares two values shallowly. For objects, checks top-level keys.
 * Returns true if they're equivalent — meaning children don't need to re-render.
 */
function shallowEqual(a: any, b: any): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null)
    return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!Object.is(a[key], b[key])) return false;
  }
  return true;
}

function FormWatch({ name, children }: FormWatchProps) {
  const { form } = useFormContext();
  const prevRef = useRef<any>(undefined);
  const prevResultRef = useRef<ReactNode>(null);

  let watched: any;

  if (name === undefined) {
    watched = form.values;
  } else if (typeof name === "string") {
    watched = form.values[name];
  } else {
    // Array of names — build object with requested values
    const obj: Record<string, any> = {};
    for (const key of name) {
      obj[key] = form.values[key];
    }
    watched = obj;
  }

  // Only re-invoke the render prop if the watched value actually changed
  if (!shallowEqual(watched, prevRef.current)) {
    prevRef.current = watched;
    prevResultRef.current = children(watched);
  }

  return <>{prevResultRef.current}</>;
}

FormWatch.displayName = "FormWatch";

export { FormWatch };
export type { FormWatchProps };

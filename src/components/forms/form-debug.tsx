"use client";

import { cn } from "../../lib/utils";
import { useFormContext } from "./form-context";

type FormDebugProps = {
  className?: string;
  /** Start collapsed. Default false. */
  collapsed?: boolean;
};

function FormDebug({ className, collapsed = false }: FormDebugProps) {
  if (process.env.NODE_ENV === "production") return null;

  /* eslint-disable react-hooks/rules-of-hooks -- production guard is compile-time constant */
  const { form, formError } = useFormContext();

  const hasErrors = Object.keys(form.errors).length > 0;
  const hasTouched = Object.keys(form.touched).length > 0;

  return (
    <details
      open={!collapsed}
      className={cn(
        "rounded-xl bg-gray-900 p-4 font-mono text-sm text-green-400",
        className,
      )}
    >
      <summary className="cursor-pointer select-none font-semibold text-green-300">
        Form Debug
      </summary>
      <div className="mt-3 space-y-2">
        <Section label="values" value={form.values} />
        {hasErrors && <Section label="errors" value={form.errors} />}
        {hasTouched && <Section label="touched" value={form.touched} />}
        <Row label="dirty" value={String(form.dirty)} />
        <Row label="isSubmitting" value={String(form.isSubmitting)} />
        {formError && <Row label="formError" value={formError} />}
      </div>
    </details>
  );
  /* eslint-enable react-hooks/rules-of-hooks */
}

function Section({ label, value }: { label: string; value: unknown }) {
  return (
    <div>
      <span className="text-green-300">{label}:</span>
      <pre className="mt-1 overflow-auto whitespace-pre-wrap break-all text-green-400/80">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-green-300">{label}:</span>{" "}
      <span className="text-green-400/80">{value}</span>
    </div>
  );
}

FormDebug.displayName = "FormDebug";

export { FormDebug };
export type { FormDebugProps };

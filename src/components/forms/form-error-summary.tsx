"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { useFormContext } from "./form-context";
import { Icon } from "../data-display/icon";

type FormErrorSummaryProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Custom title. Default: "Please fix the following errors:" */
  title?: string;
  /** Custom render for each error. Receives field name and error message. */
  renderError?: (name: string, error: string) => ReactNode;
  className?: string;
};

const FormErrorSummary = forwardRef<HTMLDivElement, FormErrorSummaryProps>(
  ({ title = "Please fix the following errors:", renderError, className, ...props }, ref) => {
    const { form } = useFormContext();

    const errorEntries = Object.entries(form.errors).filter(
      ([, msg]) => !!msg,
    ) as [string, string][];

    if (errorEntries.length === 0) return null;

    return (
      <div
        ref={ref}
        role="alert"
        aria-live="assertive"
        className={cn(
          "rounded-xl border border-destructive/30 bg-destructive/10 p-4",
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-2 mb-2">
          <Icon name="alert-circle" size="md" className="text-destructive shrink-0" />
          <p className="text-sm font-semibold text-destructive">{title}</p>
        </div>
        <ul className="list-none space-y-1 ml-7">
          {errorEntries.map(([fieldName, errorMsg]) =>
            renderError ? (
              <li key={fieldName}>{renderError(fieldName, errorMsg)}</li>
            ) : (
              <li key={fieldName}>
                <a
                  href={`#${fieldName}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el =
                      document.querySelector<HTMLElement>(`[name="${fieldName}"]`) ??
                      document.getElementById(fieldName);
                    el?.scrollIntoView?.({ behavior: "smooth", block: "center" });
                    el?.focus();
                  }}
                  className="text-sm text-destructive underline underline-offset-2 hover:text-destructive"
                >
                  {errorMsg}
                </a>
              </li>
            ),
          )}
        </ul>
      </div>
    );
  },
);
FormErrorSummary.displayName = "FormErrorSummary";

export { FormErrorSummary };
export type { FormErrorSummaryProps };

import { forwardRef, useEffect, useRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";

type CheckboxColor = "primary" | "secondary" | "success" | "warning" | "destructive";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "color"> & {
  label?: string;
  error?: string;
  /** Show indeterminate state (dash icon instead of check) */
  indeterminate?: boolean;
  /** Color theme */
  color?: CheckboxColor;
};

const colorStyles: Record<CheckboxColor, string> = {
  primary: "text-primary focus:ring-primary",
  secondary: "text-secondary focus:ring-secondary",
  success: "text-green-600 focus:ring-green-600",
  warning: "text-amber-500 focus:ring-amber-500",
  destructive: "text-red-600 focus:ring-red-600",
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, indeterminate = false, color = "primary", ref: _ref, ...props }, ref) => {
    const internalRef = useRef<HTMLInputElement>(null);

    // Sync indeterminate state to the DOM element
    useEffect(() => {
      const el = (ref && typeof ref === "object" && "current" in ref ? ref.current : null) || internalRef.current;
      if (el) {
        el.indeterminate = indeterminate;
      }
    }, [indeterminate, ref]);

    // Combine refs
    const setRef = (node: HTMLInputElement | null) => {
      internalRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref && typeof ref === "object") {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      }
    };

    const checkboxClasses = cn(
      "rounded border-slate-300 cursor-pointer",
      colorStyles[color],
      error && "border-red-300",
      className
    );

    if (label) {
      return (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={id} className="flex items-center gap-2 cursor-pointer">
            <input
              id={id}
              type="checkbox"
              className={cn(checkboxClasses, "size-4")}
              ref={setRef}
              aria-checked={indeterminate ? "mixed" : undefined}
              {...props}
            />
            <span className={s.textBody}>{label}</span>
          </label>
          {error && (
            <p className="text-xs text-red-500 font-medium">{error}</p>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-1.5">
        <input
          id={id}
          type="checkbox"
          className={cn(checkboxClasses, "size-3.5")}
          ref={setRef}
          aria-checked={indeterminate ? "mixed" : undefined}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
export type { CheckboxProps, CheckboxColor };

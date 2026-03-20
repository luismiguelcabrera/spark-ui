import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  error?: string;
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id: idProp, ...props }, ref) => {
    const autoId = useId();
    const id = idProp ?? autoId;
    const errorId = error ? `${id}-error` : undefined;

    if (label) {
      return (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={id} className="flex items-center gap-2 cursor-pointer">
            <input
              id={id}
              type="checkbox"
              className={cn(
                "rounded border-muted text-primary focus:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary size-4 cursor-pointer transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
                error && "border-destructive",
                className
              )}
              ref={ref}
              aria-invalid={error ? true : undefined}
              aria-describedby={errorId}
              {...props}
            />
            <span className={s.textBody}>{label}</span>
          </label>
          {error && (
            <p id={errorId} className="text-xs text-destructive font-medium" role="alert">{error}</p>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-1.5">
        <input
          id={id}
          type="checkbox"
          aria-label="Checkbox"
          className={cn(
            "rounded border-muted text-primary focus:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary size-4 cursor-pointer transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-destructive",
            className
          )}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs text-destructive font-medium" role="alert">{error}</p>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
export type { CheckboxProps };

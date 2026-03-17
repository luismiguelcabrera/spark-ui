import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  error?: string;
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    if (label) {
      return (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={id} className="flex items-center gap-2 cursor-pointer">
            <input
              id={id}
              type="checkbox"
              className={cn(
                "rounded border-slate-300 text-primary focus:ring-primary size-4 cursor-pointer",
                error && "border-red-300",
                className
              )}
              ref={ref}
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
          className={cn(
            "rounded border-slate-300 text-primary focus:ring-primary size-3.5 cursor-pointer",
            error && "border-red-300",
            className
          )}
          ref={ref}
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
export type { CheckboxProps };

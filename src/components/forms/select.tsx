import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string;
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error, ...props }, ref) => {
    const hasAccessibleName =
      !!props["aria-label"] ||
      !!props["aria-labelledby"] ||
      !!props.id;
    return (
      <div className="flex flex-col gap-1.5">
        <div className="relative">
          <select
            className={cn(
              s.inputBase,
              "appearance-none pl-4 pr-10 text-gray-900",
              s.inputFocus,
              s.inputDisabled,
              error && "border-red-300 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            ref={ref}
            aria-invalid={error ? true : undefined}
            aria-label={!hasAccessibleName ? "Select" : undefined}
            {...props}
          >
            {children}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            <Icon name="expand_more" size="sm" />
          </span>
        </div>
        {error && (
          <p className="text-xs text-red-600 font-medium" role="alert">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
export type { SelectProps };

import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string;
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error, ...props }, ref) => {
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
            {...props}
          >
            {children}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px] pointer-events-none">
            expand_more
          </span>
        </div>
        {error && (
          <p className="text-xs text-red-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
export type { SelectProps };

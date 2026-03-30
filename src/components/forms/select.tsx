import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Spinner } from "../feedback/spinner";
import { Icon } from "../data-display/icon";

type SelectVariant = "outlined" | "filled" | "underlined";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string;
  /** Visual variant */
  variant?: SelectVariant;
  /** Show clear button when a value is selected */
  clearable?: boolean;
  /** Show loading spinner */
  loading?: boolean;
  /** Callback for clear action */
  onClear?: () => void;
};

const variantStyles: Record<SelectVariant, string> = {
  outlined: cn(s.inputBase, "appearance-none pl-4 pr-10 text-gray-900", s.inputFocus, s.inputDisabled),
  filled: "w-full px-4 h-12 bg-slate-100 border-0 rounded-xl text-sm placeholder:text-slate-400 transition-colors appearance-none pl-4 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed",
  underlined: "w-full px-4 h-12 bg-transparent border-0 border-b-2 border-slate-200 rounded-none text-sm placeholder:text-slate-400 transition-colors appearance-none pl-4 pr-10 text-gray-900 focus:outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed",
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error, variant = "outlined", clearable = false, loading = false, onClear, value, onChange, ...props }, ref) => {
    const hasValue = value !== undefined && value !== "";

    const handleClear = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (onClear) {
        onClear();
      } else if (onChange) {
        // Create a synthetic change event with empty value
        const syntheticEvent = {
          ...e,
          target: { ...((ref as React.RefObject<HTMLSelectElement>)?.current || {}), value: "" },
          currentTarget: { ...((ref as React.RefObject<HTMLSelectElement>)?.current || {}), value: "" },
        } as unknown as React.ChangeEvent<HTMLSelectElement>;
        onChange(syntheticEvent);
      }
    };

    return (
      <div className="flex flex-col gap-1.5">
        <div className="relative">
          <select
            className={cn(
              variantStyles[variant],
              error && "border-red-300 focus:border-red-500 focus:ring-red-500/20",
              (clearable && hasValue) && "pr-16",
              loading && "pr-16",
              className
            )}
            ref={ref}
            value={value}
            onChange={onChange}
            aria-busy={loading || undefined}
            aria-invalid={error ? true : undefined}
            disabled={loading || props.disabled}
            {...props}
          >
            {children}
          </select>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {loading ? (
              <Spinner size="xs" color="muted" aria-label="Loading" />
            ) : (
              <>
                {clearable && hasValue && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-full hover:bg-slate-100"
                    aria-label="Clear selection"
                    tabIndex={-1}
                  >
                    <Icon name="close" size="xs" />
                  </button>
                )}
                <span className="material-symbols-outlined text-gray-400 text-[20px] pointer-events-none">
                  expand_more
                </span>
              </>
            )}
          </div>
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
export type { SelectProps, SelectVariant };

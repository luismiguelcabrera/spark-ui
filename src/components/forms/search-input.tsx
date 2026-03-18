import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  icon?: string;
  onClear?: () => void;
};

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, icon = "search", onClear, value, ...props }, ref) => {
    const showClear = onClear && typeof value === "string" && value.length > 0;

    return (
      <div role="search" className={cn("relative group", className)}>
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Icon
            name={icon}
            size="md"
            className="text-slate-400 group-focus-within:text-primary transition-colors"
          />
        </div>
        <input
          type="search"
          className={cn(s.searchInputField, showClear && "pr-9")}
          ref={ref}
          value={value}
          {...props}
        />
        {showClear && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <Icon name="close" size="sm" />
          </button>
        )}
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

export { SearchInput };
export type { SearchInputProps };

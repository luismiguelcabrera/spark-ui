import { forwardRef, useState, useId, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  error?: string;
};

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error, id: idProp, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const autoId = useId();
    const id = idProp ?? autoId;
    const errorId = error ? `${id}-error` : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        <div className="relative">
          <input
            id={id}
            type={visible ? "text" : "password"}
            className={cn(
              s.inputBase,
              "pr-12",
              s.inputFocus,
              s.inputDisabled,
              error && "border-red-300 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            ref={ref}
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId}
            {...props}
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:outline-none rounded"
            type="button"
            tabIndex={-1}
            aria-label={visible ? "Hide password" : "Show password"}
            onClick={() => setVisible((v) => !v)}
          >
            <Icon name={visible ? "visibility_off" : "visibility"} size="md" />
          </button>
        </div>
        {error && (
          <p id={errorId} className="text-xs text-red-500 font-medium" role="alert">{error}</p>
        )}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
export type { PasswordInputProps };

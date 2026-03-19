import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    const hasAccessibleName =
      !!props["aria-label"] ||
      !!props["aria-labelledby"] ||
      !!props.placeholder ||
      !!props.id;
    return (
      <div className="flex flex-col gap-1.5">
        <textarea
          className={cn(
            s.inputBase,
            "p-4 h-auto min-h-[120px] resize-none",
            s.inputFocus,
            s.inputDisabled,
            error && "border-red-300 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          ref={ref}
          aria-label={!hasAccessibleName ? "Text area" : undefined}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-600 font-medium" role="alert">{error}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
export type { TextareaProps };

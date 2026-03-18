import { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";

type DividerProps = {
  className?: string;
  label?: string;
};

const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ className, label }, ref) => {
    if (label) {
      return (
        <div
          ref={ref}
          role="separator"
          className={cn("flex items-center gap-3", className)}
        >
          <div className={cn("flex-1", s.dividerLine)} aria-hidden="true" />
          <span className={cn(s.textMuted, "font-medium")}>{label}</span>
          <div className={cn("flex-1", s.dividerLine)} aria-hidden="true" />
        </div>
      );
    }
    return (
      <hr
        ref={ref as React.Ref<HTMLHRElement>}
        className={cn(s.dividerLine, className)}
      />
    );
  }
);
Divider.displayName = "Divider";

export { Divider };
export type { DividerProps };

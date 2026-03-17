import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type CenterProps = HTMLAttributes<HTMLDivElement> & {
  /** Use inline-flex instead of flex */
  inline?: boolean;
};

const Center = forwardRef<HTMLDivElement, CenterProps>(
  ({ className, inline, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        inline ? "inline-flex" : "flex",
        "items-center justify-center",
        className
      )}
      {...props}
    />
  )
);
Center.displayName = "Center";

export { Center };
export type { CenterProps };

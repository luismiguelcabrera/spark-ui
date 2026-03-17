import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type VisuallyHiddenProps = HTMLAttributes<HTMLSpanElement>;

const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0",
        "[clip:rect(0,0,0,0)]",
        className
      )}
      {...props}
    />
  )
);
VisuallyHidden.displayName = "VisuallyHidden";

export { VisuallyHidden };
export type { VisuallyHiddenProps };

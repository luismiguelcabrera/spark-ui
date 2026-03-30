import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type SpacerProps = HTMLAttributes<HTMLDivElement>;

/**
 * Flex spacer that fills available space between siblings.
 * Use inside a flex container to push items apart.
 */
const Spacer = forwardRef<HTMLDivElement, SpacerProps>(
  ({ className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(className)}
      style={{ flex: "1 1 auto", ...style }}
      aria-hidden="true"
      {...props}
    />
  )
);
Spacer.displayName = "Spacer";

export { Spacer };
export type { SpacerProps };

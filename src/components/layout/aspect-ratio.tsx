import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type AspectRatioProps = HTMLAttributes<HTMLDivElement> & {
  /** Aspect ratio as width/height (default: 16/9) */
  ratio?: number;
};

const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ className, ratio = 16 / 9, style, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative w-full overflow-hidden", className)}
      style={{ ...style, aspectRatio: String(ratio) }}
      {...props}
    >
      <div className="absolute inset-0">{children}</div>
    </div>
  )
);
AspectRatio.displayName = "AspectRatio";

export { AspectRatio };
export type { AspectRatioProps };

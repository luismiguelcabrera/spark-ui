import { forwardRef, type SVGProps } from "react";
import { cn } from "../lib/utils";

export type SvgIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

/**
 * Factory to create a named SVG icon component.
 * Each icon only defines the <path> content — this wrapper handles
 * sizing, className, color (currentColor), viewBox, and ref forwarding.
 */
export function createIcon(
  displayName: string,
  path: React.ReactNode,
  viewBox = "0 0 24 24",
) {
  const Icon = forwardRef<SVGSVGElement, SvgIconProps>(
    ({ size = 24, className, ...props }, ref) => {
      return (
        <svg
          ref={ref}
          xmlns="http://www.w3.org/2000/svg"
          viewBox={viewBox}
          width={size}
          height={size}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={cn("shrink-0", className)}
          {...props}
        >
          {path}
        </svg>
      );
    },
  );
  Icon.displayName = displayName;
  return Icon;
}

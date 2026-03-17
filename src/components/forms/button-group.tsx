import { type ReactNode } from "react";
import { cn } from "../../lib/utils";

type ButtonGroupProps = {
  children: ReactNode;
  /** Attach buttons with no gap */
  attached?: boolean;
  /** Direction */
  direction?: "horizontal" | "vertical";
  className?: string;
};

function ButtonGroup({
  children,
  attached = false,
  direction = "horizontal",
  className,
}: ButtonGroupProps) {
  return (
    <div
      role="group"
      className={cn(
        "inline-flex",
        direction === "vertical" ? "flex-col" : "flex-row",
        attached
          ? cn(
              "[&>*]:rounded-none [&>*]:shadow-none",
              direction === "horizontal" &&
                "[&>*:first-child]:rounded-l-xl [&>*:last-child]:rounded-r-xl [&>*:not(:first-child)]:-ml-px",
              direction === "vertical" &&
                "[&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl [&>*:not(:first-child)]:-mt-px",
            )
          : "gap-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

export { ButtonGroup };
export type { ButtonGroupProps };

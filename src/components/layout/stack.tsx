import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type StackProps = HTMLAttributes<HTMLDivElement> & {
  /** Direction of the stack */
  direction?: "vertical" | "horizontal";
  /** Shorthand for direction="horizontal" */
  row?: boolean;
  /** Gap between items (Tailwind spacing scale) */
  gap?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12";
  /** Alignment */
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  /** Justification */
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  /** Whether to wrap items */
  wrap?: boolean;
};

const alignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const justifyMap = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      className,
      direction = "vertical",
      row,
      gap = "4",
      align,
      justify,
      wrap,
      ...props
    },
    ref
  ) => {
    const isHorizontal = row || direction === "horizontal";
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          isHorizontal ? "flex-row" : "flex-col",
          `gap-${gap}`,
          align && alignMap[align],
          justify && justifyMap[justify],
          wrap && "flex-wrap",
          className
        )}
        {...props}
      />
    );
  }
);
Stack.displayName = "Stack";

/** Shorthand for <Stack direction="horizontal"> */
const HStack = forwardRef<HTMLDivElement, Omit<StackProps, "direction" | "row">>(
  (props, ref) => <Stack ref={ref} direction="horizontal" {...props} />
);
HStack.displayName = "HStack";

/** Shorthand for <Stack direction="vertical"> */
const VStack = forwardRef<HTMLDivElement, Omit<StackProps, "direction" | "row">>(
  (props, ref) => <Stack ref={ref} direction="vertical" {...props} />
);
VStack.displayName = "VStack";

export { Stack, HStack, VStack };
export type { StackProps };

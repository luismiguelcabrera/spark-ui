import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type ScrollAreaProps = HTMLAttributes<HTMLDivElement> & {
  /** Max height before scrolling */
  maxHeight?: number | string;
  /** Scrollbar visibility */
  scrollbar?: "auto" | "always" | "hover" | "hidden";
  /** Scroll direction */
  orientation?: "vertical" | "horizontal" | "both";
};

const scrollbarMap = {
  auto: "overflow-auto",
  always: "overflow-scroll",
  hover: "overflow-auto [&::-webkit-scrollbar]:opacity-0 [&:hover::-webkit-scrollbar]:opacity-100",
  hidden: "overflow-auto scrollbar-none [&::-webkit-scrollbar]:hidden",
};

const orientationMap = {
  vertical: "overflow-x-hidden",
  horizontal: "overflow-y-hidden",
  both: "",
};

const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      className,
      maxHeight,
      scrollbar = "auto",
      orientation = "vertical",
      style,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      tabIndex={0}
      className={cn(
        "relative",
        scrollbarMap[scrollbar],
        orientationMap[orientation],
        "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40",
        className
      )}
      style={{
        ...style,
        maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
      }}
      {...props}
    />
  )
);
ScrollArea.displayName = "ScrollArea";

export { ScrollArea };
export type { ScrollAreaProps };

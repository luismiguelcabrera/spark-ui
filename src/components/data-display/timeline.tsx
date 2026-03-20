"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Icon } from "./icon";

type TimelineItemData = {
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
  /** Timestamp or date label */
  date?: string;
  /** Icon name for the dot */
  icon?: string;
  /** Custom icon element */
  iconElement?: ReactNode;
  /** Color of the dot/icon */
  color?: "primary" | "secondary" | "success" | "warning" | "destructive" | "default";
  /** Whether this item is active/current */
  active?: boolean;
  /** Custom content below the description */
  content?: ReactNode;
};

type TimelineProps = HTMLAttributes<HTMLDivElement> & {
  /** Timeline items */
  items: TimelineItemData[];
  /** Layout variant */
  variant?: "left" | "right" | "alternating";
  /** Size of the timeline dots */
  size?: "sm" | "md" | "lg";
  /** Line style */
  lineStyle?: "solid" | "dashed" | "dotted";
};

const dotSizeMap = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
};

const iconSizeMap = {
  sm: "sm" as const,
  md: "sm" as const,
  lg: "md" as const,
};

const dotColorMap: Record<string, string> = {
  primary: "bg-primary text-white",
  secondary: "bg-secondary text-white",
  success: "bg-success text-white",
  warning: "bg-warning text-black",
  destructive: "bg-destructive text-white",
  default: "bg-muted text-muted-foreground",
};

const lineStyleMap = {
  solid: "border-solid",
  dashed: "border-dashed",
  dotted: "border-dotted",
};

const Timeline = forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, items, variant = "left", size = "md", lineStyle = "solid", ...props }, ref) => (
    <div ref={ref} className={cn("relative", className)} {...props}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isRight = variant === "right" || (variant === "alternating" && index % 2 === 1);
        const color = item.color ?? (item.active ? "primary" : "default");

        return (
          <div
            key={index}
            className={cn(
              "relative flex gap-4",
              variant === "alternating" && "justify-center",
              !isLast && "pb-8"
            )}
          >
            {/* Line */}
            {!isLast && (
              <div
                className={cn(
                  "absolute border-l-2 border-muted",
                  lineStyleMap[lineStyle],
                  variant === "left" && "left-[calc(theme(spacing.4)-1px)]",
                  variant === "right" && "right-[calc(theme(spacing.4)-1px)]",
                  variant === "alternating" && "left-1/2 -translate-x-px",
                  size === "sm" && "top-6",
                  size === "md" && "top-8",
                  size === "lg" && "top-10",
                  "bottom-0"
                )}
              />
            )}

            {/* Content - left side for alternating */}
            {variant === "alternating" && (
              <div className={cn("w-[calc(50%-1.5rem)] text-right", !isRight && "order-first", isRight && "order-last opacity-0")}>
                {!isRight && (
                  <>
                    {item.date && <p className="text-xs font-medium text-muted-foreground mb-1">{item.date}</p>}
                    <h3 className={cn("text-sm font-semibold text-secondary", item.active && "text-primary")}>{item.title}</h3>
                    {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
                    {item.content && <div className="mt-2">{item.content}</div>}
                  </>
                )}
              </div>
            )}

            {/* Dot */}
            <div
              className={cn(
                "relative z-10 flex items-center justify-center rounded-full shrink-0",
                dotSizeMap[size],
                dotColorMap[color],
                item.active && "ring-4 ring-primary/20"
              )}
            >
              {item.iconElement ?? (item.icon ? (
                <Icon name={item.icon} size={iconSizeMap[size]} />
              ) : (
                <div className={cn("rounded-full bg-current opacity-60", size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5")} />
              ))}
            </div>

            {/* Content - right side or main */}
            <div className={cn(
              variant === "alternating" ? "w-[calc(50%-1.5rem)]" : "flex-1",
              variant === "right" && "order-first text-right"
            )}>
              {(variant !== "alternating" || isRight) && (
                <>
                  {item.date && <p className="text-xs font-medium text-muted-foreground mb-1">{item.date}</p>}
                  <h3 className={cn("text-sm font-semibold text-secondary", item.active && "text-primary")}>{item.title}</h3>
                  {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
                  {item.content && <div className="mt-2">{item.content}</div>}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  )
);
Timeline.displayName = "Timeline";

export { Timeline };
export type { TimelineProps, TimelineItemData };

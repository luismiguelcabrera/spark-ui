import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const textVariants = cva("", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    color: {
      default: "text-navy-text",
      muted: "text-muted-foreground",
      subtle: "text-muted-foreground",
      primary: "text-primary",
      secondary: "text-secondary",
      success: "text-success",
      warning: "text-warning",
      destructive: "text-destructive",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
    truncate: {
      true: "truncate",
    },
    leading: {
      none: "leading-none",
      tight: "leading-tight",
      snug: "leading-snug",
      normal: "leading-normal",
      relaxed: "leading-relaxed",
      loose: "leading-loose",
    },
  },
  defaultVariants: {
    size: "md",
    weight: "normal",
    color: "default",
  },
});

type TextElement = "p" | "span" | "div" | "label" | "strong" | "em" | "small" | "del" | "ins" | "mark";

type TextProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof textVariants> & {
    /** HTML element to render as (default: p) */
    as?: TextElement;
  };

const Text = forwardRef<HTMLElement, TextProps>(
  ({ className, as: Component = "p", size, weight, color, align, truncate, leading, ...props }, ref) => (
    <Component
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={cn(textVariants({ size, weight, color, align, truncate, leading }), className)}
      {...props}
    />
  )
);
Text.displayName = "Text";

export { Text, textVariants };
export type { TextProps, TextElement };

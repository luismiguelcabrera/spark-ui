import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const headingVariants = cva("font-bold tracking-tight text-secondary", {
  variants: {
    size: {
      xs: "text-sm",
      sm: "text-base",
      md: "text-lg",
      lg: "text-xl",
      xl: "text-2xl",
      "2xl": "text-3xl",
      "3xl": "text-4xl",
      "4xl": "text-5xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
      black: "font-black",
    },
  },
  defaultVariants: {
    size: "xl",
    weight: "bold",
  },
});

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type HeadingProps = HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof headingVariants> & {
    /** Heading level (default: h2) */
    as?: HeadingLevel;
  };

const sizeToLevel: Record<string, HeadingLevel> = {
  "4xl": "h1",
  "3xl": "h1",
  "2xl": "h2",
  xl: "h2",
  lg: "h3",
  md: "h4",
  sm: "h5",
  xs: "h6",
};

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, as, size = "xl", weight, ...props }, ref) => {
    const Component = as ?? sizeToLevel[size ?? "xl"] ?? "h2";
    return (
      <Component
        ref={ref}
        className={cn(headingVariants({ size, weight }), className)}
        {...props}
      />
    );
  }
);
Heading.displayName = "Heading";

export { Heading, headingVariants };
export type { HeadingProps, HeadingLevel };

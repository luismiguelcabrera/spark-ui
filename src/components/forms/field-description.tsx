"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

type FieldDescriptionProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode;
  className?: string;
};

const FieldDescription = forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-xs text-gray-500 mt-1", className)}
        {...props}
      >
        {children}
      </p>
    );
  },
);
FieldDescription.displayName = "FieldDescription";

export { FieldDescription };
export type { FieldDescriptionProps };

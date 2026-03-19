import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  InputGroup                                                                */
/* -------------------------------------------------------------------------- */

type InputGroupSize = "sm" | "md" | "lg";

type InputGroupProps = HTMLAttributes<HTMLDivElement> & {
  /** Size that addons and elements inherit */
  size?: InputGroupSize;
  className?: string;
};

const sizeHeights: Record<InputGroupSize, string> = {
  sm: "h-9",
  md: "h-12",
  lg: "h-14",
};

const sizeFontMap: Record<InputGroupSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

/**
 * Wrapper that joins addons and elements flush against an `<Input />`.
 *
 * ```tsx
 * <InputGroup>
 *   <InputLeftAddon>https://</InputLeftAddon>
 *   <Input placeholder="example.com" />
 *   <InputRightAddon>.com</InputRightAddon>
 * </InputGroup>
 * ```
 */
const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  ({ children, size = "md", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-stretch",
          // Reset child border radii — first and last get rounded ends
          "[&>*]:rounded-none",
          "[&>*:first-child]:rounded-l-xl",
          "[&>*:last-child]:rounded-r-xl",
          // Collapse duplicate borders between children
          "[&>*:not(:first-child)]:-ml-px",
          // Focus child should sit on top so its ring isn't clipped
          "[&>*:focus-within]:z-10 [&>*:focus]:z-10",
          sizeHeights[size],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
InputGroup.displayName = "InputGroup";

/* -------------------------------------------------------------------------- */
/*  InputAddon (left / right)                                                  */
/* -------------------------------------------------------------------------- */

type InputAddonProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  size?: InputGroupSize;
  className?: string;
};

const addonBase =
  "flex items-center shrink-0 px-3.5 border border-slate-200 bg-slate-50 text-slate-600 font-medium select-none";

const InputLeftAddon = forwardRef<HTMLDivElement, InputAddonProps>(
  ({ children, size = "md", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(addonBase, sizeFontMap[size], className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
InputLeftAddon.displayName = "InputLeftAddon";

const InputRightAddon = forwardRef<HTMLDivElement, InputAddonProps>(
  ({ children, size = "md", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(addonBase, sizeFontMap[size], className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
InputRightAddon.displayName = "InputRightAddon";

/* -------------------------------------------------------------------------- */
/*  InputElement (left / right overlay inside the input)                       */
/* -------------------------------------------------------------------------- */

type InputElementProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Whether the element should be interactive (pointer-events) */
  clickable?: boolean;
  className?: string;
};

const elementBase =
  "absolute inset-y-0 flex items-center z-10";

const InputLeftElement = forwardRef<HTMLDivElement, InputElementProps>(
  ({ children, clickable = false, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          elementBase,
          "left-0 pl-3.5",
          !clickable && "pointer-events-none",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
InputLeftElement.displayName = "InputLeftElement";

const InputRightElement = forwardRef<HTMLDivElement, InputElementProps>(
  ({ children, clickable = false, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          elementBase,
          "right-0 pr-3.5",
          !clickable && "pointer-events-none",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
InputRightElement.displayName = "InputRightElement";

/* -------------------------------------------------------------------------- */
/*  Exports                                                                    */
/* -------------------------------------------------------------------------- */

export {
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  InputLeftElement,
  InputRightElement,
};
export type {
  InputGroupProps,
  InputGroupSize,
  InputAddonProps,
  InputElementProps,
};

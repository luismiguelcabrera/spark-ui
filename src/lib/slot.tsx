import {
  forwardRef,
  cloneElement,
  isValidElement,
  Children,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { cn } from "./utils";

type SlotProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
};

const Slot = forwardRef<HTMLElement, SlotProps>(
  ({ children: slotChildren, ...props }, ref) => {
    // Find the single valid element child
    const childArray = Children.toArray(slotChildren);
    const child = childArray.find(isValidElement);

    if (!child) {
      return null;
    }

    const childProps = child.props as Record<string, unknown>;

    // Gather non-element children (text, icons, etc.) to pass as content
    const otherChildren = childArray.filter((c) => c !== child);
    const mergedChildren =
      otherChildren.length > 0
        ? [...otherChildren, childProps.children as ReactNode]
        : (childProps.children as ReactNode);

    return cloneElement(child, {
      ...props,
      ...childProps,
      ref,
      className: cn(props.className, childProps.className as string),
      children: mergedChildren,
    } as Record<string, unknown>);
  }
);
Slot.displayName = "Slot";

export { Slot };

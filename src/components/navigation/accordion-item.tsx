"use client";

import { useId, forwardRef, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";
import { useAccordionContext, AccordionPanel } from "./accordion-context";

export type AccordionItemProps = {
  value: string;
  title: string;
  children: ReactNode;
  className?: string;
};

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, title, children, className }, ref) => {
    const ctx = useAccordionContext();
    const isOpen = ctx.openSet.has(value);
    const baseId = useId();
    const triggerId = `${baseId}-trigger`;
    const panelId = `${baseId}-panel`;

    return (
      <div ref={ref} className={cn(s.accordionItem, className)}>
        <button
          type="button"
          id={triggerId}
          data-accordion-trigger="true"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => ctx.toggle(value)}
          className={cn(
            s.accordionTrigger,
            "list-none [&::-webkit-details-marker]:hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none rounded-sm",
          )}
        >
          <span>{title}</span>
          <Icon
            name="expand_more"
            size="sm"
            className={cn(
              "text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </button>
        <AccordionPanel open={isOpen} id={panelId} labelledBy={triggerId}>
          <div className={s.accordionContent}>{children}</div>
        </AccordionPanel>
      </div>
    );
  },
);

AccordionItem.displayName = "AccordionItem";

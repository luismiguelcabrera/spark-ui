"use client";

import { useId, useCallback, forwardRef, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";
import { useControllable } from "../../hooks/use-controllable";
import {
  AccordionContext,
  AccordionPanel,
  handleAccordionKeyDown,
} from "./accordion-context";
import { AccordionItem } from "./accordion-item";

// ── Legacy types ─────────────────────────────────────────

type AccordionItemData = {
  title: string;
  content: string;
  defaultOpen?: boolean;
};

// ── Main component ───────────────────────────────────────

type AccordionProps = {
  items?: AccordionItemData[];
  type?: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  variant?: "default" | "bordered";
  className?: string;
  children?: ReactNode;
};

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      items,
      type = "multiple",
      value,
      defaultValue,
      onValueChange,
      variant = "default",
      className,
      children,
    },
    ref,
  ) => {
    const isLegacy = !!items;
    const baseId = useId();

    // Derive defaults from legacy `defaultOpen` fields
    const legacyDefaults = isLegacy
      ? items!.filter((item) => item.defaultOpen).map((item) => item.title)
      : [];
    const initialDefault =
      defaultValue ?? (legacyDefaults.length > 0 ? legacyDefaults : []);

    const [openItems, setOpenItems] = useControllable<string | string[]>({
      value,
      defaultValue: initialDefault,
      onChange: onValueChange,
    });

    const openSet = new Set(
      Array.isArray(openItems) ? openItems : [openItems].filter(Boolean),
    );

    const toggle = useCallback(
      (itemValue: string) => {
        if (type === "single") {
          setOpenItems(openSet.has(itemValue) ? "" : itemValue);
        } else {
          const arr = Array.isArray(openItems)
            ? openItems
            : [openItems].filter(Boolean);
          if (openSet.has(itemValue)) {
            setOpenItems(arr.filter((v) => v !== itemValue));
          } else {
            setOpenItems([...arr, itemValue]);
          }
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [type, openItems],
    );

    // Legacy mode: render from items array
    if (isLegacy) {
      return (
        <div
          ref={ref}
          className={cn(
            variant === "bordered" && s.accordionBordered,
            className,
          )}
          onKeyDown={handleAccordionKeyDown}
        >
          {items!.map((item, i) => {
            const isOpen = openSet.has(item.title);
            const triggerId = `${baseId}-trigger-${i}`;
            const panelId = `${baseId}-panel-${i}`;

            return (
              <div
                key={item.title}
                className={cn(
                  s.accordionItem,
                  variant === "bordered" && "px-4",
                )}
              >
                <button
                  type="button"
                  id={triggerId}
                  data-accordion-trigger="true"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(item.title)}
                  className={cn(
                    s.accordionTrigger,
                    "list-none [&::-webkit-details-marker]:hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none rounded-sm",
                  )}
                >
                  <span>{item.title}</span>
                  <Icon
                    name="expand_more"
                    size="sm"
                    className={cn(
                      "text-slate-600 transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <AccordionPanel
                  open={isOpen}
                  id={panelId}
                  labelledBy={triggerId}
                >
                  <div className={s.accordionContent}>{item.content}</div>
                </AccordionPanel>
              </div>
            );
          })}
        </div>
      );
    }

    // Compound mode
    return (
      <AccordionContext.Provider value={{ type, openSet, toggle }}>
        <div
          ref={ref}
          className={cn(
            variant === "bordered" && s.accordionBordered,
            className,
          )}
          onKeyDown={handleAccordionKeyDown}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  },
);

Accordion.displayName = "Accordion";

// ── Attach compound sub-components for dot-notation API ──

const AccordionCompound = Accordion as typeof Accordion & {
  Item: typeof AccordionItem;
};
AccordionCompound.Item = AccordionItem;

export { AccordionCompound as Accordion, AccordionItem };
export type { AccordionProps, AccordionItemData };

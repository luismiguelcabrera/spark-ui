"use client";

import {
  createContext,
  useContext,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";
import { useControllable } from "../../hooks/use-controllable";

// ── Context ──────────────────────────────────────────────

type AccordionContextValue = {
  type: "single" | "multiple";
  openSet: Set<string>;
  toggle: (value: string) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion.Item must be used within <Accordion>");
  return ctx;
}

// ── Animated panel ───────────────────────────────────────

function AccordionPanel({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) {
      el.style.height = `${innerRef.current?.scrollHeight ?? 0}px`;
      const onEnd = () => {
        el.style.height = "auto";
      };
      el.addEventListener("transitionend", onEnd, { once: true });
      return () => el.removeEventListener("transitionend", onEnd);
    } else {
      el.style.height = `${el.scrollHeight}px`;
      el.offsetHeight; // eslint-disable-line @typescript-eslint/no-unused-expressions
      el.style.height = "0px";
    }
  }, [open]);

  return (
    <div
      ref={ref}
      className="overflow-hidden transition-[height] duration-200 ease-in-out"
      style={{ height: open ? undefined : 0 }}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
}

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

function Accordion({
  items,
  type = "multiple",
  value,
  defaultValue,
  onValueChange,
  variant = "default",
  className,
  children,
}: AccordionProps) {
  const isLegacy = !!items;

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
    Array.isArray(openItems) ? openItems : [openItems].filter(Boolean)
  );

  const toggle = (itemValue: string) => {
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
  };

  // Legacy mode: render from items array
  if (isLegacy) {
    return (
      <div
        className={cn(
          variant === "bordered" && s.accordionBordered,
          className
        )}
      >
        {items!.map((item) => {
          const isOpen = openSet.has(item.title);
          return (
            <div
              key={item.title}
              className={cn(
                s.accordionItem,
                variant === "bordered" && "px-4"
              )}
            >
              <button
                type="button"
                onClick={() => toggle(item.title)}
                className={cn(
                  s.accordionTrigger,
                  "list-none [&::-webkit-details-marker]:hidden"
                )}
              >
                <span>{item.title}</span>
                <Icon
                  name="expand_more"
                  size="sm"
                  className={cn(
                    "text-slate-400 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
              <AccordionPanel open={isOpen}>
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
        className={cn(
          variant === "bordered" && s.accordionBordered,
          className
        )}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// ── Compound sub-component ───────────────────────────────

function AccordionItem({
  value,
  title,
  children,
  className,
}: {
  value: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const ctx = useAccordionContext();
  const isOpen = ctx.openSet.has(value);

  return (
    <div className={cn(s.accordionItem, className)}>
      <button
        type="button"
        onClick={() => ctx.toggle(value)}
        className={cn(
          s.accordionTrigger,
          "list-none [&::-webkit-details-marker]:hidden"
        )}
      >
        <span>{title}</span>
        <Icon
          name="expand_more"
          size="sm"
          className={cn(
            "text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <AccordionPanel open={isOpen}>
        <div className={s.accordionContent}>{children}</div>
      </AccordionPanel>
    </div>
  );
}

Accordion.Item = AccordionItem;

export { Accordion };
export type { AccordionProps, AccordionItemData as AccordionItem };

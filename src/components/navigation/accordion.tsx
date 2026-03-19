"use client";

import {
  createContext,
  useContext,
  useRef,
  useEffect,
  useCallback,
  useId,
  forwardRef,
  type ReactNode,
  type KeyboardEvent,
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
  id,
  labelledBy,
  children,
}: {
  open: boolean;
  id: string;
  labelledBy: string;
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
      id={id}
      role="region"
      aria-labelledby={labelledBy}
      hidden={!open}
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

// ── Keyboard handler for arrow navigation ────────────────

function handleAccordionKeyDown(e: KeyboardEvent<HTMLDivElement>) {
  const target = e.target as HTMLElement;
  if (target.tagName !== "BUTTON") return;

  const container = e.currentTarget;
  const triggers = Array.from(
    container.querySelectorAll<HTMLButtonElement>(
      '[data-accordion-trigger="true"]',
    ),
  );

  const index = triggers.indexOf(target as HTMLButtonElement);
  if (index === -1) return;

  let nextIndex: number | null = null;

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      nextIndex = (index + 1) % triggers.length;
      break;
    case "ArrowUp":
      e.preventDefault();
      nextIndex = (index - 1 + triggers.length) % triggers.length;
      break;
    case "Home":
      e.preventDefault();
      nextIndex = 0;
      break;
    case "End":
      e.preventDefault();
      nextIndex = triggers.length - 1;
      break;
  }

  if (nextIndex !== null) {
    triggers[nextIndex].focus();
  }
}

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

// ── Compound sub-component ───────────────────────────────

const AccordionItem = forwardRef<
  HTMLDivElement,
  {
    value: string;
    title: string;
    children: ReactNode;
    className?: string;
  }
>(({ value, title, children, className }, ref) => {
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
            "text-slate-600 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>
      <AccordionPanel open={isOpen} id={panelId} labelledBy={triggerId}>
        <div className={s.accordionContent}>{children}</div>
      </AccordionPanel>
    </div>
  );
});

AccordionItem.displayName = "AccordionItem";

const AccordionCompound = Accordion as typeof Accordion & {
  Item: typeof AccordionItem;
};
AccordionCompound.Item = AccordionItem;

export { AccordionCompound as Accordion };
export type { AccordionProps, AccordionItemData as AccordionItem };

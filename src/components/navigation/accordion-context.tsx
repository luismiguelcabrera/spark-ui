"use client";

import {
  createContext,
  useContext,
  useRef,
  useEffect,
  type ReactNode,
  type KeyboardEvent,
} from "react";

// ── Context ──────────────────────────────────────────────

export type AccordionContextValue = {
  type: "single" | "multiple";
  openSet: Set<string>;
  toggle: (value: string) => void;
};

export const AccordionContext = createContext<AccordionContextValue | null>(null);

export function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion.Item must be used within <Accordion>");
  return ctx;
}

// ── Animated panel ───────────────────────────────────────

export function AccordionPanel({
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

// ── Keyboard handler for arrow navigation ────────────────

export function handleAccordionKeyDown(e: KeyboardEvent<HTMLDivElement>) {
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

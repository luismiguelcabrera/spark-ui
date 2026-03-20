"use client";

import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";

// ── Types ───────────────────────────────────────────────

type MegaMenuItem = {
  label: string;
  href?: string;
  icon?: string;
  description?: string;
};

type MegaMenuColumn = {
  title?: string;
  items: MegaMenuItem[];
};

type MegaMenuSection = {
  label: string;
  columns: MegaMenuColumn[];
  footer?: ReactNode;
};

type MegaMenuProps = {
  sections: MegaMenuSection[];
  className?: string;
  /** Accessible label for the navigation landmark */
  "aria-label"?: string;
};

// ── Component ───────────────────────────────────────────

const MegaMenu = forwardRef<HTMLElement, MegaMenuProps>(
  ({ sections, className, "aria-label": ariaLabel }, ref) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const navRef = useRef<HTMLElement | null>(null);
    const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Track whether the open was triggered by keyboard to focus into panel after render
    const pendingFocusPanelRef = useRef<number | null>(null);
    // Track which index was opened by hover so click doesn't re-toggle
    const hoverOpenedRef = useRef<number | null>(null);

    // Merge forwarded ref with internal ref
    const setNavRef = useCallback(
      (el: HTMLElement | null) => {
        navRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = el;
      },
      [ref]
    );

    const cancelClose = useCallback(() => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    }, []);

    const open = useCallback((index: number) => {
      cancelClose();
      setOpenIndex(index);
    }, [cancelClose]);

    const close = useCallback(() => {
      cancelClose();
      hoverOpenedRef.current = null;
      setOpenIndex(null);
    }, [cancelClose]);

    const scheduleClose = useCallback(() => {
      closeTimeoutRef.current = setTimeout(() => {
        hoverOpenedRef.current = null;
        setOpenIndex(null);
      }, 150);
    }, []);

    // After render, focus into panel if pending
    useEffect(() => {
      if (pendingFocusPanelRef.current !== null) {
        const idx = pendingFocusPanelRef.current;
        pendingFocusPanelRef.current = null;
        const panel = panelRefs.current[idx];
        if (panel) {
          const firstLink = panel.querySelector<HTMLElement>("a, button");
          firstLink?.focus();
        }
      }
    }, [openIndex]);

    // Click outside handler
    useEffect(() => {
      if (openIndex === null) return;
      function handleClick(e: MouseEvent) {
        if (navRef.current && !navRef.current.contains(e.target as Node)) {
          hoverOpenedRef.current = null;
          setOpenIndex(null);
        }
      }
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, [openIndex]);

    // Keyboard handler
    const handleTriggerKeyDown = useCallback(
      (e: React.KeyboardEvent, index: number) => {
        switch (e.key) {
          case "Enter":
          case " ": {
            e.preventDefault();
            hoverOpenedRef.current = null;
            if (openIndex === index) {
              close();
            } else {
              open(index);
            }
            break;
          }
          case "ArrowRight": {
            e.preventDefault();
            const next = (index + 1) % sections.length;
            triggerRefs.current[next]?.focus();
            open(next);
            break;
          }
          case "ArrowLeft": {
            e.preventDefault();
            const prev = (index - 1 + sections.length) % sections.length;
            triggerRefs.current[prev]?.focus();
            open(prev);
            break;
          }
          case "ArrowDown": {
            e.preventDefault();
            if (openIndex === index) {
              // Panel already open, focus first item immediately
              const panel = panelRefs.current[index];
              if (panel) {
                const firstLink = panel.querySelector<HTMLElement>("a, button");
                firstLink?.focus();
              }
            } else {
              // Open panel and schedule focus for after render
              pendingFocusPanelRef.current = index;
              open(index);
            }
            break;
          }
          case "Escape": {
            e.preventDefault();
            close();
            triggerRefs.current[index]?.focus();
            break;
          }
        }
      },
      [openIndex, sections.length, open, close]
    );

    const handlePanelKeyDown = useCallback(
      (e: React.KeyboardEvent, sectionIndex: number) => {
        const panel = panelRefs.current[sectionIndex];
        if (!panel) return;

        const focusables = Array.from(
          panel.querySelectorAll<HTMLElement>("a, button")
        );
        const currentIdx = focusables.indexOf(
          document.activeElement as HTMLElement
        );

        switch (e.key) {
          case "ArrowDown": {
            e.preventDefault();
            const next =
              currentIdx < focusables.length - 1 ? currentIdx + 1 : 0;
            focusables[next]?.focus();
            break;
          }
          case "ArrowUp": {
            e.preventDefault();
            if (currentIdx <= 0) {
              triggerRefs.current[sectionIndex]?.focus();
            } else {
              focusables[currentIdx - 1]?.focus();
            }
            break;
          }
          case "Escape": {
            e.preventDefault();
            close();
            triggerRefs.current[sectionIndex]?.focus();
            break;
          }
          case "Tab": {
            // Allow natural tab but close menu when leaving
            close();
            break;
          }
        }
      },
      [close]
    );

    return (
      <nav
        ref={setNavRef}
        aria-label={ariaLabel ?? "Main navigation"}
        className={cn("relative", className)}
      >
        <ul className="flex items-center gap-1" role="menubar">
          {sections.map((section, index) => (
            <li key={section.label} role="none" className="relative">
              <button
                ref={(el) => {
                  triggerRefs.current[index] = el;
                }}
                type="button"
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={openIndex === index}
                className={cn(
                  "inline-flex items-center gap-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  "text-navy-text hover:text-primary hover:bg-primary/5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  openIndex === index && "text-primary bg-primary/5"
                )}
                onClick={() => {
                  cancelClose();
                  // If hover just opened this section, don't re-toggle on click
                  if (hoverOpenedRef.current === index) {
                    hoverOpenedRef.current = null;
                    return;
                  }
                  hoverOpenedRef.current = null;
                  if (openIndex === index) {
                    close();
                  } else {
                    open(index);
                  }
                }}
                onMouseEnter={() => {
                  hoverOpenedRef.current = index;
                  open(index);
                }}
                onMouseLeave={scheduleClose}
                onKeyDown={(e) => handleTriggerKeyDown(e, index)}
              >
                {section.label}
                <Icon
                  name="expand_more"
                  size="sm"
                  className={cn(
                    "transition-transform duration-200",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>

              {openIndex === index && (
                <div
                  ref={(el) => {
                    panelRefs.current[index] = el;
                  }}
                  role="menu"
                  aria-label={`${section.label} submenu`}
                  className={cn(
                    "absolute left-0 top-full z-50 mt-1 min-w-[480px]",
                    "bg-surface border border-muted rounded-xl shadow-lg",
                    "animate-in fade-in slide-in-from-top-1 duration-150"
                  )}
                  onMouseEnter={cancelClose}
                  onMouseLeave={scheduleClose}
                  onKeyDown={(e) => handlePanelKeyDown(e, index)}
                >
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2 p-4">
                    {section.columns.map((column, colIdx) => (
                      <div key={column.title ?? colIdx}>
                        {column.title && (
                          <h3 className="px-3 py-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                            {column.title}
                          </h3>
                        )}
                        <ul role="none" className="space-y-0.5">
                          {column.items.map((item) => {
                            const Tag = item.href ? "a" : "button";
                            return (
                              <li key={item.label} role="none">
                                <Tag
                                  {...(item.href
                                    ? { href: item.href }
                                    : { type: "button" as const })}
                                  role="menuitem"
                                  className={cn(
                                    "flex items-start gap-3 w-full px-3 py-2 rounded-lg text-left",
                                    "text-sm text-navy-text hover:bg-muted/50 transition-colors",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                                  )}
                                  onClick={() => close()}
                                >
                                  {item.icon && (
                                    <Icon
                                      name={item.icon}
                                      size="sm"
                                      className="text-muted-foreground mt-0.5 shrink-0"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium">
                                      {item.label}
                                    </div>
                                    {item.description && (
                                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                        {item.description}
                                      </div>
                                    )}
                                  </div>
                                </Tag>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {section.footer && (
                    <div className="border-t border-muted/50 px-4 py-3 bg-muted/50/50 rounded-b-xl">
                      {section.footer}
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    );
  }
);

MegaMenu.displayName = "MegaMenu";

export { MegaMenu };
export type { MegaMenuProps, MegaMenuSection, MegaMenuColumn, MegaMenuItem };

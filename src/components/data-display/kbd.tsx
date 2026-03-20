import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  Platform detection                                                         */
/* -------------------------------------------------------------------------- */

const isMac =
  typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform ?? "");

/**
 * Map of key names to platform-aware symbols.
 * When `platformAware` is true, these are used automatically.
 */
const keySymbols: Record<string, { mac: string; other: string }> = {
  mod:     { mac: "⌘", other: "Ctrl" },
  ctrl:    { mac: "⌃", other: "Ctrl" },
  alt:     { mac: "⌥", other: "Alt" },
  shift:   { mac: "⇧", other: "Shift" },
  meta:    { mac: "⌘", other: "Win" },
  enter:   { mac: "↩", other: "Enter" },
  return:  { mac: "↩", other: "Enter" },
  tab:     { mac: "⇥", other: "Tab" },
  delete:  { mac: "⌫", other: "Del" },
  backspace: { mac: "⌫", other: "Bksp" },
  escape:  { mac: "⎋", other: "Esc" },
  esc:     { mac: "⎋", other: "Esc" },
  space:   { mac: "␣", other: "Space" },
  up:      { mac: "↑", other: "↑" },
  down:    { mac: "↓", other: "↓" },
  left:    { mac: "←", other: "←" },
  right:   { mac: "→", other: "→" },
};

function resolveKey(key: string, platformAware: boolean): string {
  if (!platformAware) return key;
  const entry = keySymbols[key.toLowerCase()];
  if (entry) return isMac ? entry.mac : entry.other;
  // Capitalize single letters
  if (key.length === 1) return key.toUpperCase();
  return key;
}

/* -------------------------------------------------------------------------- */
/*  KbdKey — single key cap                                                    */
/* -------------------------------------------------------------------------- */

const KbdKey = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <kbd
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5",
        "rounded-md border border-muted bg-muted/50 shadow-[0_1px_0_1px_rgba(0,0,0,0.05)]",
        "font-mono text-xs font-medium text-navy-text",
        "select-none",
        className,
      )}
      {...props}
    />
  ),
);
KbdKey.displayName = "KbdKey";

/* -------------------------------------------------------------------------- */
/*  Kbd — combo-aware keyboard shortcut display                                */
/* -------------------------------------------------------------------------- */

type KbdProps = HTMLAttributes<HTMLElement> & {
  /** Array of keys to display as a combo (e.g., ["Ctrl", "K"]) */
  keys?: string[];
  /**
   * Shortcut string using `+` as separator (e.g., "Mod+K", "Ctrl+Shift+P").
   * Ignored if `keys` is provided.
   */
  combo?: string;
  /**
   * Replace key names with platform symbols (⌘, ⌥, ⇧ on Mac; Ctrl, Alt, Shift elsewhere).
   * The special key "Mod" maps to ⌘ on Mac, Ctrl on Windows/Linux.
   * @default true
   */
  platformAware?: boolean;
  /**
   * Separator rendered between keys in a combo.
   * @default "+" for text, none for symbols
   */
  separator?: string;
};

const Kbd = forwardRef<HTMLElement, KbdProps>(
  (
    {
      className,
      keys: keysProp,
      combo,
      platformAware = true,
      separator,
      children,
      ...props
    },
    ref,
  ) => {
    // Determine key list from props
    const keyList = keysProp ?? (combo ? combo.split("+").map((k) => k.trim()) : null);

    if (keyList && keyList.length > 0) {
      const resolved = keyList.map((k) => resolveKey(k, platformAware));
      // Determine separator: if platform-aware and on Mac, use no separator (symbols are compact)
      const sep =
        separator !== undefined
          ? separator
          : platformAware && isMac
            ? ""
            : "+";

      return (
        <span
          ref={ref as React.Ref<HTMLSpanElement>}
          className={cn("inline-flex items-center gap-0.5", className)}
          {...props}
        >
          {resolved.map((key, i) => (
            <span key={`${key}-${i}`} className="inline-flex items-center gap-0.5">
              {i > 0 && sep && (
                <span className="text-[10px] text-muted-foreground font-mono select-none">
                  {sep}
                </span>
              )}
              <KbdKey>{key}</KbdKey>
            </span>
          ))}
        </span>
      );
    }

    // Single key fallback
    return (
      <KbdKey ref={ref} className={className} {...props}>
        {children}
      </KbdKey>
    );
  },
);
Kbd.displayName = "Kbd";

export { Kbd, KbdKey };
export type { KbdProps };

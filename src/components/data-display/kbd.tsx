import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type KbdProps = HTMLAttributes<HTMLElement> & {
  /** Keyboard key(s) to display */
  keys?: string[];
};

const KbdKey = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <kbd
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5",
        "rounded-md border border-slate-300 bg-slate-50 shadow-[0_1px_0_1px_rgba(0,0,0,0.05)]",
        "font-mono text-xs font-medium text-slate-700",
        "select-none",
        className
      )}
      {...props}
    />
  )
);
KbdKey.displayName = "KbdKey";

const Kbd = forwardRef<HTMLElement, KbdProps>(
  ({ className, keys, children, ...props }, ref) => {
    if (keys && keys.length > 0) {
      return (
        <span ref={ref as React.Ref<HTMLSpanElement>} className={cn("inline-flex items-center gap-1", className)} {...props}>
          {keys.map((key, i) => (
            <KbdKey key={`${key}-${i}`}>{key}</KbdKey>
          ))}
        </span>
      );
    }

    return <KbdKey ref={ref} className={className} {...props}>{children}</KbdKey>;
  }
);
Kbd.displayName = "Kbd";

export { Kbd, KbdKey };
export type { KbdProps };

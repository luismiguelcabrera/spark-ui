import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";

type DividerProps = {
  className?: string;
  label?: string;
};

function Divider({ className, label }: DividerProps) {
  if (label) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className={cn("flex-1", s.dividerLine)} />
        <span className={cn(s.textMuted, "font-medium")}>{label}</span>
        <div className={cn("flex-1", s.dividerLine)} />
      </div>
    );
  }
  return <hr className={cn(s.dividerLine, className)} />;
}

export { Divider };
export type { DividerProps };

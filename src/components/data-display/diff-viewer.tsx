import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type DiffLine = {
  type: "added" | "removed" | "unchanged";
  content: string;
  lineNumber?: number;
};

type DiffViewerProps = HTMLAttributes<HTMLDivElement> & {
  lines: DiffLine[];
  showLineNumbers?: boolean;
  title?: string;
  language?: string;
};

const lineColors: Record<string, string> = {
  added: "bg-green-50 text-green-800 border-l-2 border-green-400",
  removed: "bg-red-50 text-red-800 border-l-2 border-red-400",
  unchanged: "text-slate-600",
};

const lineSymbol: Record<string, string> = {
  added: "+",
  removed: "-",
  unchanged: " ",
};

const DiffViewer = forwardRef<HTMLDivElement, DiffViewerProps>(
  ({ className, lines, showLineNumbers = true, title, language, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-xl border border-slate-200 overflow-hidden", className)}
      {...props}
    >
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
          <span className="text-sm font-semibold text-secondary">{title}</span>
          {language && (
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{language}</span>
          )}
        </div>
      )}
      <div className="overflow-x-auto">
        <pre className="text-sm font-mono">
          {lines.map((line, i) => (
            <div
              key={i}
              className={cn("flex px-4 py-0.5 min-w-0", lineColors[line.type])}
            >
              {showLineNumbers && (
                <span className="w-8 shrink-0 text-right pr-3 text-slate-400 select-none text-xs leading-5">
                  {line.lineNumber ?? i + 1}
                </span>
              )}
              <span className="w-4 shrink-0 text-center select-none opacity-50">{lineSymbol[line.type]}</span>
              <span className="flex-1 whitespace-pre">{line.content}</span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  )
);
DiffViewer.displayName = "DiffViewer";

export { DiffViewer };
export type { DiffViewerProps, DiffLine };

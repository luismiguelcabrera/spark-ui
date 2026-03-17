import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type InlineCodeProps = HTMLAttributes<HTMLElement>;

const InlineCode = forwardRef<HTMLElement, InlineCodeProps>(
  ({ className, ...props }, ref) => (
    <code
      ref={ref}
      className={cn(
        "relative rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-slate-800",
        "border border-slate-200",
        className
      )}
      {...props}
    />
  )
);
InlineCode.displayName = "InlineCode";

type CodeBlockProps = HTMLAttributes<HTMLPreElement> & {
  /** Language label to display */
  language?: string;
  /** Show line numbers */
  showLineNumbers?: boolean;
};

const CodeBlock = forwardRef<HTMLPreElement, CodeBlockProps>(
  ({ className, language, showLineNumbers, children, ...props }, ref) => (
    <div className="relative group">
      {language && (
        <div className="absolute top-0 right-0 px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider select-none">
          {language}
        </div>
      )}
      <pre
        ref={ref}
        className={cn(
          "overflow-x-auto rounded-xl bg-slate-950 p-4 font-mono text-sm text-slate-100",
          "border border-slate-800",
          showLineNumbers && "[counter-reset:line] [&>code>span]:before:content-[counter(line)] [&>code>span]:before:mr-6 [&>code>span]:before:inline-block [&>code>span]:before:w-4 [&>code>span]:before:text-right [&>code>span]:before:text-slate-600 [&>code>span]:[counter-increment:line]",
          className
        )}
        {...props}
      >
        <code>{children}</code>
      </pre>
    </div>
  )
);
CodeBlock.displayName = "CodeBlock";

export { InlineCode, CodeBlock };
export type { InlineCodeProps, CodeBlockProps };

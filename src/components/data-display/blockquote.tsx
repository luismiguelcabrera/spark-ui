import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type BlockquoteColor = "default" | "primary" | "success" | "warning" | "destructive";

type BlockquoteProps = HTMLAttributes<HTMLQuoteElement> & {
  /** Citation source */
  cite?: string;
  /** Author name */
  author?: string;
  /** Color theme */
  color?: BlockquoteColor;
};

const colorMap: Record<BlockquoteColor, string> = {
  default: "border-slate-300 bg-slate-50",
  primary: "border-primary/40 bg-primary/5",
  success: "border-green-400 bg-green-50",
  warning: "border-amber-400 bg-amber-50",
  destructive: "border-red-400 bg-red-50",
};

const Blockquote = forwardRef<HTMLQuoteElement, BlockquoteProps>(
  ({ className, cite, author, color = "default", children, ...props }, ref) => (
    <figure className="my-4">
      <blockquote
        ref={ref}
        cite={cite}
        className={cn(
          "border-l-4 rounded-r-xl pl-4 pr-4 py-3 text-slate-600 italic",
          colorMap[color],
          className
        )}
        {...props}
      >
        {children}
      </blockquote>
      {author && (
        <figcaption className="mt-2 pl-4 text-sm font-medium text-slate-600">
          — {author}
        </figcaption>
      )}
    </figure>
  )
);
Blockquote.displayName = "Blockquote";

export { Blockquote };
export type { BlockquoteProps, BlockquoteColor };

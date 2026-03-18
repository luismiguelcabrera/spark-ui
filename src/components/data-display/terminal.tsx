import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import { cn } from "../../lib/utils";

type TerminalLine = {
  type: "input" | "output" | "error" | "info";
  content: string;
  prompt?: string;
};

type TerminalProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  lines?: TerminalLine[];
  prompt?: string;
  onCommand?: (command: string) => void;
  interactive?: boolean;
  title?: string;
  className?: string;
};

const lineTypeClasses: Record<TerminalLine["type"], string> = {
  input: "text-green-400",
  output: "text-slate-200",
  error: "text-red-400",
  info: "text-blue-400",
};

const Terminal = forwardRef<HTMLDivElement, TerminalProps>(
  (
    {
      lines = [],
      prompt = "$ ",
      onCommand,
      interactive = false,
      title = "Terminal",
      className,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState("");
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const outputRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom when lines change
    useEffect(() => {
      const el = outputRef.current;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, [lines]);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim()) {
          onCommand?.(inputValue.trim());
          setHistory((prev) => [...prev, inputValue.trim()]);
          setHistoryIndex(-1);
          setInputValue("");
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setHistoryIndex((prev) => {
            const newIndex =
              prev === -1 ? history.length - 1 : Math.max(0, prev - 1);
            if (newIndex >= 0 && newIndex < history.length) {
              setInputValue(history[newIndex]);
            }
            return newIndex;
          });
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          setHistoryIndex((prev) => {
            const newIndex = prev + 1;
            if (newIndex >= history.length) {
              setInputValue("");
              return -1;
            }
            setInputValue(history[newIndex]);
            return newIndex;
          });
        }
      },
      [inputValue, history, onCommand]
    );

    const handleContainerClick = useCallback(() => {
      if (interactive && inputRef.current) {
        inputRef.current.focus();
      }
    }, [interactive]);

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg overflow-hidden border border-slate-700 shadow-xl",
          className
        )}
        {...props}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border-b border-slate-700 select-none">
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full bg-red-500"
              aria-hidden="true"
            />
            <span
              className="w-3 h-3 rounded-full bg-yellow-500"
              aria-hidden="true"
            />
            <span
              className="w-3 h-3 rounded-full bg-green-500"
              aria-hidden="true"
            />
          </div>
          <span className="flex-1 text-center text-xs text-slate-400 font-medium truncate">
            {title}
          </span>
        </div>

        {/* Output area */}
        <div
          ref={outputRef}
          role="log"
          aria-label="Terminal output"
          aria-live="polite"
          className="bg-slate-900 p-4 font-mono text-sm overflow-y-auto max-h-96 min-h-[8rem]"
          onClick={handleContainerClick}
        >
          {lines.map((line, index) => (
            <div
              key={index}
              className={cn(
                "whitespace-pre-wrap break-all leading-relaxed",
                lineTypeClasses[line.type]
              )}
            >
              {line.type === "input" && (
                <span className="text-green-500 select-none">
                  {line.prompt ?? prompt}
                </span>
              )}
              {line.content}
            </div>
          ))}

          {/* Interactive input line */}
          {interactive && (
            <div className="flex items-center mt-0.5">
              <span
                className="text-green-500 select-none font-mono text-sm shrink-0"
                aria-hidden="true"
              >
                {prompt}
              </span>
              <input
                ref={inputRef}
                role="textbox"
                aria-label="Terminal input"
                type="text"
                className={cn(
                  "flex-1 bg-transparent text-green-400 font-mono text-sm",
                  "outline-none border-none caret-green-400",
                  "placeholder:text-slate-600"
                )}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setHistoryIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);
Terminal.displayName = "Terminal";

export { Terminal };
export type { TerminalProps, TerminalLine };

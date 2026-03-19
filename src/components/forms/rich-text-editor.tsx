"use client";

import {
  forwardRef,
  useRef,
  useCallback,
  useEffect,
  useState,
  useMemo,
  type KeyboardEvent,
} from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";
import { useLocale } from "../../lib/locale";

export type ToolbarAction =
  | "bold"
  | "italic"
  | "underline"
  | "strikethrough"
  | "heading"
  | "bulletList"
  | "orderedList"
  | "blockquote"
  | "code"
  | "link"
  | "undo"
  | "redo"
  | "separator";

export type RichTextEditorProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  toolbar?: ToolbarAction[];
  minHeight?: number;
  maxHeight?: number;
  className?: string;
};

const DEFAULT_TOOLBAR: ToolbarAction[] = [
  "bold",
  "italic",
  "underline",
  "separator",
  "heading",
  "bulletList",
  "orderedList",
  "separator",
  "blockquote",
  "code",
  "link",
  "separator",
  "undo",
  "redo",
];

type ToolbarButtonConfig = {
  command: string;
  commandArg?: string;
  icon: string;
  label: string;
  shortcut?: string;
};

const toolbarConfig: Record<string, ToolbarButtonConfig> = {
  bold: { command: "bold", icon: "format_bold", label: "Bold", shortcut: "Ctrl+B" },
  italic: { command: "italic", icon: "format_italic", label: "Italic", shortcut: "Ctrl+I" },
  underline: { command: "underline", icon: "format_underlined", label: "Underline", shortcut: "Ctrl+U" },
  strikethrough: { command: "strikeThrough", icon: "strikethrough_s", label: "Strikethrough" },
  heading: { command: "formatBlock", commandArg: "H2", icon: "title", label: "Heading" },
  bulletList: { command: "insertUnorderedList", icon: "format_list_bulleted", label: "Bullet list" },
  orderedList: { command: "insertOrderedList", icon: "format_list_numbered", label: "Ordered list" },
  blockquote: { command: "formatBlock", commandArg: "BLOCKQUOTE", icon: "format_quote", label: "Blockquote" },
  code: { command: "formatBlock", commandArg: "PRE", icon: "code", label: "Code block" },
  link: { command: "createLink", icon: "link", label: "Insert link" },
  undo: { command: "undo", icon: "undo", label: "Undo" },
  redo: { command: "redo", icon: "redo", label: "Redo" },
};

function execCmd(command: string, arg?: string): boolean {
  if (typeof document !== "undefined" && typeof document.execCommand === "function") {
    return document.execCommand(command, false, arg);
  }
  return false;
}

function queryCmd(command: string): boolean {
  if (typeof document !== "undefined" && typeof document.queryCommandState === "function") {
    try {
      return document.queryCommandState(command);
    } catch {
      return false;
    }
  }
  return false;
}

function queryCommandValue(command: string): string {
  if (typeof document !== "undefined" && typeof document.queryCommandValue === "function") {
    try {
      return document.queryCommandValue(command);
    } catch {
      return "";
    }
  }
  return "";
}

const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  (
    {
      value,
      defaultValue = "",
      onChange,
      placeholder,
      disabled = false,
      readOnly = false,
      toolbar = DEFAULT_TOOLBAR,
      minHeight = 200,
      maxHeight,
      className,
    },
    ref
  ) => {
    const { t } = useLocale();
    const editorRef = useRef<HTMLDivElement>(null);
    const isInternalChange = useRef(false);
    const [activeFormats, setActiveFormats] = useState<Set<string>>(
      new Set()
    );

    const toolbarLabels = useMemo(() => ({
      bold: t("rte.bold", "Bold"),
      italic: t("rte.italic", "Italic"),
      underline: t("rte.underline", "Underline"),
      strikethrough: t("rte.strikethrough", "Strikethrough"),
      heading: t("rte.heading", "Heading"),
      bulletList: t("rte.bulletList", "Bullet list"),
      orderedList: t("rte.orderedList", "Ordered list"),
      blockquote: t("rte.blockquote", "Blockquote"),
      code: t("rte.code", "Code block"),
      link: t("rte.link", "Insert link"),
      undo: t("rte.undo", "Undo"),
      redo: t("rte.redo", "Redo"),
    }), [t]);

    // Set initial content
    useEffect(() => {
      if (editorRef.current && defaultValue && !editorRef.current.innerHTML) {
        editorRef.current.innerHTML = defaultValue;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync controlled value
    useEffect(() => {
      if (value !== undefined && editorRef.current && !isInternalChange.current) {
        if (editorRef.current.innerHTML !== value) {
          editorRef.current.innerHTML = value;
        }
      }
      isInternalChange.current = false;
    }, [value]);

    const updateActiveFormats = useCallback(() => {
      const formats = new Set<string>();
      if (queryCmd("bold")) formats.add("bold");
      if (queryCmd("italic")) formats.add("italic");
      if (queryCmd("underline")) formats.add("underline");
      if (queryCmd("strikeThrough")) formats.add("strikethrough");
      if (queryCmd("insertUnorderedList")) formats.add("bulletList");
      if (queryCmd("insertOrderedList")) formats.add("orderedList");

      const blockValue = queryCommandValue("formatBlock");
      if (blockValue === "h2" || blockValue === "H2") formats.add("heading");
      if (blockValue === "blockquote" || blockValue === "BLOCKQUOTE")
        formats.add("blockquote");
      if (blockValue === "pre" || blockValue === "PRE") formats.add("code");

      setActiveFormats(formats);
    }, []);

    const handleInput = useCallback(() => {
      if (editorRef.current) {
        isInternalChange.current = true;
        onChange?.(editorRef.current.innerHTML);
        updateActiveFormats();
      }
    }, [onChange, updateActiveFormats]);

    const handleSelectionChange = useCallback(() => {
      updateActiveFormats();
    }, [updateActiveFormats]);

    useEffect(() => {
      document.addEventListener("selectionchange", handleSelectionChange);
      return () =>
        document.removeEventListener("selectionchange", handleSelectionChange);
    }, [handleSelectionChange]);

    const handleToolbarAction = useCallback(
      (action: string) => {
        if (disabled || readOnly) return;

        const config = toolbarConfig[action];
        if (!config) return;

        // Focus the editor first to ensure selection is in editor context
        editorRef.current?.focus();

        if (action === "link") {
          const url = typeof window !== "undefined" ? window.prompt(t("rte.enterUrl", "Enter URL:")) : null;
          if (url) {
            execCmd("createLink", url);
          }
        } else if (action === "heading") {
          // Toggle heading: if already H2, switch back to paragraph
          const blockValue = queryCommandValue("formatBlock");
          if (blockValue === "h2" || blockValue === "H2") {
            execCmd("formatBlock", "P");
          } else {
            execCmd("formatBlock", "H2");
          }
        } else if (action === "blockquote") {
          const blockValue = queryCommandValue("formatBlock");
          if (blockValue === "blockquote" || blockValue === "BLOCKQUOTE") {
            execCmd("formatBlock", "P");
          } else {
            execCmd("formatBlock", "BLOCKQUOTE");
          }
        } else if (action === "code") {
          const blockValue = queryCommandValue("formatBlock");
          if (blockValue === "pre" || blockValue === "PRE") {
            execCmd("formatBlock", "P");
          } else {
            execCmd("formatBlock", "PRE");
          }
        } else if (config.commandArg) {
          execCmd(config.command, config.commandArg);
        } else {
          execCmd(config.command);
        }

        // Update active formats and trigger onChange
        requestAnimationFrame(() => {
          updateActiveFormats();
          if (editorRef.current) {
            isInternalChange.current = true;
            onChange?.(editorRef.current.innerHTML);
          }
        });
      },
      [disabled, readOnly, onChange, updateActiveFormats, t]
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        const mod = e.metaKey || e.ctrlKey;
        if (!mod) return;

        if (e.key === "b") {
          e.preventDefault();
          handleToolbarAction("bold");
        } else if (e.key === "i") {
          e.preventDefault();
          handleToolbarAction("italic");
        } else if (e.key === "u") {
          e.preventDefault();
          handleToolbarAction("underline");
        }
      },
      [handleToolbarAction]
    );

    const setEditorRef = useCallback(
      (el: HTMLDivElement | null) => {
        (editorRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        if (typeof ref === "function") {
          ref(el);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }
      },
      [ref]
    );

    const isEmpty =
      !editorRef.current?.textContent?.trim() &&
      !editorRef.current?.querySelector("img");

    return (
      <div
        className={cn(
          "border border-slate-200 rounded-xl overflow-hidden bg-white",
          "focus-within:ring-2 focus-within:ring-primary focus-within:border-primary",
          disabled && "cursor-not-allowed",
          className
        )}
      >
        {/* Toolbar */}
        <div
          role="toolbar"
          aria-label={t("rte.formattingOptions", "Formatting options")}
          className={cn(
            "flex items-center flex-wrap gap-0.5 px-2 py-1.5 border-b border-slate-100 bg-slate-50/50",
            disabled && "pointer-events-none"
          )}
        >
          {toolbar.map((action, index) => {
            if (action === "separator") {
              return (
                <div
                  key={`sep-${index}`}
                  className="w-px h-5 bg-slate-200 mx-1"
                  role="separator"
                />
              );
            }

            const config = toolbarConfig[action];
            if (!config) return null;

            const isActive = activeFormats.has(action);
            const translatedLabel = toolbarLabels[action as keyof typeof toolbarLabels] ?? config.label;

            return (
              <button
                key={action}
                type="button"
                aria-label={translatedLabel}
                aria-pressed={isActive}
                title={
                  config.shortcut
                    ? `${translatedLabel} (${config.shortcut})`
                    : translatedLabel
                }
                disabled={disabled || readOnly}
                className={cn(
                  "inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
                  "hover:bg-slate-200/70 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  isActive && "bg-primary/10 text-primary"
                )}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleToolbarAction(action);
                }}
              >
                <Icon name={config.icon} size="sm" />
              </button>
            );
          })}
        </div>

        {/* Editor area */}
        <div className="relative">
          <div
            ref={setEditorRef}
            contentEditable={!disabled && !readOnly}
            suppressContentEditableWarning
            role="textbox"
            aria-multiline="true"
            aria-label={t("rte.editor", "Rich text editor")}
            aria-placeholder={placeholder}
            aria-disabled={disabled}
            aria-readonly={readOnly}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            className={cn(
              "outline-none px-4 py-3 text-sm text-slate-900",
              "overflow-y-auto",
              // Typography styles for content
              "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-2 [&_h1]:mt-4",
              "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:mt-3",
              "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-1 [&_h3]:mt-2",
              "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2",
              "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2",
              "[&_li]:my-0.5",
              "[&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:my-2 [&_blockquote]:text-slate-600 [&_blockquote]:italic",
              "[&_pre]:bg-slate-100 [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:my-2 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:overflow-x-auto",
              "[&_code]:bg-slate-100 [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm",
              "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
              disabled && "cursor-not-allowed",
              readOnly && "cursor-default"
            )}
            style={{
              minHeight: `${minHeight}px`,
              maxHeight: maxHeight ? `${maxHeight}px` : undefined,
            }}
          />

          {/* Placeholder */}
          {placeholder && isEmpty && (
            <div
              className="absolute top-3 left-4 text-sm text-slate-600 pointer-events-none select-none"
              aria-hidden="true"
            >
              {placeholder}
            </div>
          )}
        </div>
      </div>
    );
  }
);
RichTextEditor.displayName = "RichTextEditor";

export { RichTextEditor };

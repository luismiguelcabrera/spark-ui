import { render, screen, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RichTextEditor, type ToolbarAction } from "../rich-text-editor";

describe("RichTextEditor", () => {
  // ── Basic rendering ───────────────────────────────────────────────────

  it("renders editor with toolbar", () => {
    render(<RichTextEditor />);
    expect(screen.getByRole("toolbar")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders default toolbar buttons", () => {
    render(<RichTextEditor />);
    const toolbar = screen.getByRole("toolbar");

    // Check for some default toolbar buttons
    expect(within(toolbar).getByLabelText("Bold")).toBeInTheDocument();
    expect(within(toolbar).getByLabelText("Italic")).toBeInTheDocument();
    expect(within(toolbar).getByLabelText("Underline")).toBeInTheDocument();
    expect(within(toolbar).getByLabelText("Heading")).toBeInTheDocument();
    expect(within(toolbar).getByLabelText("Bullet list")).toBeInTheDocument();
    expect(within(toolbar).getByLabelText("Ordered list")).toBeInTheDocument();
    expect(within(toolbar).getByLabelText("Blockquote")).toBeInTheDocument();
    expect(within(toolbar).getByLabelText("Code block")).toBeInTheDocument();
    expect(within(toolbar).getByLabelText("Insert link")).toBeInTheDocument();
    expect(within(toolbar).getByLabelText("Undo")).toBeInTheDocument();
    expect(within(toolbar).getByLabelText("Redo")).toBeInTheDocument();
  });

  // ── Custom toolbar ────────────────────────────────────────────────────

  it("renders only specified toolbar buttons", () => {
    const toolbar: ToolbarAction[] = ["bold", "italic"];
    render(<RichTextEditor toolbar={toolbar} />);

    const toolbarEl = screen.getByRole("toolbar");
    expect(within(toolbarEl).getByLabelText("Bold")).toBeInTheDocument();
    expect(within(toolbarEl).getByLabelText("Italic")).toBeInTheDocument();
    expect(
      within(toolbarEl).queryByLabelText("Underline")
    ).not.toBeInTheDocument();
    expect(
      within(toolbarEl).queryByLabelText("Heading")
    ).not.toBeInTheDocument();
  });

  it("renders separators in toolbar", () => {
    const toolbar: ToolbarAction[] = ["bold", "separator", "italic"];
    render(<RichTextEditor toolbar={toolbar} />);

    const toolbarEl = screen.getByRole("toolbar");
    expect(within(toolbarEl).getByRole("separator")).toBeInTheDocument();
  });

  it("renders with minimal toolbar (bold only)", () => {
    render(<RichTextEditor toolbar={["bold"]} />);
    const toolbarEl = screen.getByRole("toolbar");
    const buttons = within(toolbarEl).getAllByRole("button");
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveAttribute("aria-label", "Bold");
  });

  // ── Placeholder ───────────────────────────────────────────────────────

  it("shows placeholder when empty", () => {
    render(<RichTextEditor placeholder="Write something..." />);
    expect(screen.getByText("Write something...")).toBeInTheDocument();
  });

  it("has aria-placeholder on the editor", () => {
    render(<RichTextEditor placeholder="Start typing" />);
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-placeholder",
      "Start typing"
    );
  });

  // ── Disabled state ────────────────────────────────────────────────────

  it("disables editing when disabled", () => {
    render(<RichTextEditor disabled />);
    const editor = screen.getByRole("textbox");
    expect(editor).toHaveAttribute("contenteditable", "false");
    expect(editor).toHaveAttribute("aria-disabled", "true");
  });

  it("disables toolbar buttons when disabled", () => {
    render(<RichTextEditor disabled toolbar={["bold", "italic"]} />);
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  // ── Readonly state ────────────────────────────────────────────────────

  it("makes editor readonly", () => {
    render(<RichTextEditor readOnly />);
    const editor = screen.getByRole("textbox");
    expect(editor).toHaveAttribute("contenteditable", "false");
    expect(editor).toHaveAttribute("aria-readonly", "true");
  });

  it("disables toolbar buttons when readOnly", () => {
    render(<RichTextEditor readOnly toolbar={["bold"]} />);
    expect(screen.getByLabelText("Bold")).toBeDisabled();
  });

  // ── className merging ─────────────────────────────────────────────────

  it("merges className prop onto wrapper", () => {
    const { container } = render(
      <RichTextEditor className="custom-editor" />
    );
    expect(container.firstChild).toHaveClass("custom-editor");
  });

  // ── Ref forwarding ────────────────────────────────────────────────────

  it("forwards ref to the editor div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<RichTextEditor ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.getAttribute("contenteditable")).toBe("true");
  });

  // ── ARIA attributes ───────────────────────────────────────────────────

  it("has correct ARIA attributes on editor", () => {
    render(<RichTextEditor />);
    const editor = screen.getByRole("textbox");
    expect(editor).toHaveAttribute("aria-multiline", "true");
    expect(editor).toHaveAttribute("aria-label", "Rich text editor");
  });

  it("toolbar has correct ARIA label", () => {
    render(<RichTextEditor />);
    expect(screen.getByRole("toolbar")).toHaveAttribute(
      "aria-label",
      "Formatting options"
    );
  });

  it("toolbar buttons have aria-pressed", () => {
    render(<RichTextEditor toolbar={["bold"]} />);
    const boldBtn = screen.getByLabelText("Bold");
    expect(boldBtn).toHaveAttribute("aria-pressed");
  });

  // ── minHeight / maxHeight ─────────────────────────────────────────────

  it("applies minHeight to editor", () => {
    render(<RichTextEditor minHeight={300} />);
    const editor = screen.getByRole("textbox");
    expect(editor.style.minHeight).toBe("300px");
  });

  it("applies maxHeight to editor", () => {
    render(<RichTextEditor maxHeight={500} />);
    const editor = screen.getByRole("textbox");
    expect(editor.style.maxHeight).toBe("500px");
  });

  it("uses default minHeight of 200px", () => {
    render(<RichTextEditor />);
    const editor = screen.getByRole("textbox");
    expect(editor.style.minHeight).toBe("200px");
  });

  // ── Content rendering ─────────────────────────────────────────────────

  it("renders with defaultValue", () => {
    render(<RichTextEditor defaultValue="<p>Hello world</p>" />);
    const editor = screen.getByRole("textbox");
    expect(editor.innerHTML).toBe("<p>Hello world</p>");
  });

  it("renders with controlled value", () => {
    render(<RichTextEditor value="<p>Controlled</p>" />);
    const editor = screen.getByRole("textbox");
    expect(editor.innerHTML).toBe("<p>Controlled</p>");
  });

  // ── Button type safety ────────────────────────────────────────────────

  it("all toolbar buttons have type=button", () => {
    render(<RichTextEditor />);
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute("type", "button");
    });
  });

  // ── Toolbar button titles ─────────────────────────────────────────────

  it("shows shortcut in title for bold/italic/underline", () => {
    render(<RichTextEditor toolbar={["bold", "italic", "underline"]} />);
    expect(screen.getByLabelText("Bold")).toHaveAttribute("title", "Bold (Ctrl+B)");
    expect(screen.getByLabelText("Italic")).toHaveAttribute("title", "Italic (Ctrl+I)");
    expect(screen.getByLabelText("Underline")).toHaveAttribute("title", "Underline (Ctrl+U)");
  });

  it("shows only label in title when no shortcut", () => {
    render(<RichTextEditor toolbar={["heading"]} />);
    expect(screen.getByLabelText("Heading")).toHaveAttribute("title", "Heading");
  });

  // ── displayName ───────────────────────────────────────────────────────

  it("has displayName set", () => {
    expect(RichTextEditor.displayName).toBe("RichTextEditor");
  });
});

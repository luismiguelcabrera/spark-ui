import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Mention, type MentionOption } from "../mention";

const sampleOptions: MentionOption[] = [
  { value: "alice", label: "Alice Johnson", description: "Engineering" },
  { value: "bob", label: "Bob Smith", description: "Design" },
  { value: "carol", label: "Carol Williams", description: "Product" },
  { value: "dave", label: "Dave Brown", disabled: true },
];

const optionsWithAvatars: MentionOption[] = [
  { value: "alice", label: "Alice", avatar: "/alice.png" },
  { value: "bob", label: "Bob", avatar: "/bob.png" },
];

describe("Mention", () => {
  // ── Basic rendering ───────────────────────────────────────────────────

  it("renders an input element", () => {
    render(<Mention options={sampleOptions} placeholder="Type here" />);
    expect(screen.getByPlaceholderText("Type here")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders a textarea without combobox role (a11y)", () => {
    render(<Mention options={sampleOptions} multiline placeholder="Multi" />);
    const textarea = screen.getByPlaceholderText("Multi");
    expect(textarea).not.toHaveAttribute("role", "combobox");
  });

  it("renders a textarea when multiline", () => {
    render(
      <Mention options={sampleOptions} multiline placeholder="Multi" />
    );
    const textarea = screen.getByPlaceholderText("Multi");
    expect(textarea.tagName).toBe("TEXTAREA");
  });

  it("renders textarea with custom rows", () => {
    render(
      <Mention options={sampleOptions} multiline rows={5} placeholder="Multi" />
    );
    expect(screen.getByPlaceholderText("Multi")).toHaveAttribute("rows", "5");
  });

  // ── Trigger detection and suggestions ─────────────────────────────────

  it("shows suggestions on trigger character", async () => {
    const user = userEvent.setup();
    render(<Mention options={sampleOptions} placeholder="Type" />);

    const input = screen.getByPlaceholderText("Type");
    await user.type(input, "@");

    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("filters suggestions by query", async () => {
    const user = userEvent.setup();
    render(<Mention options={sampleOptions} placeholder="Type" />);

    const input = screen.getByPlaceholderText("Type");
    await user.type(input, "@ali");

    const listbox = screen.getByRole("listbox");
    const options = within(listbox).getAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent("Alice Johnson");
  });

  it("shows all options when only trigger is typed", async () => {
    const user = userEvent.setup();
    const nonDisabledOptions = sampleOptions.filter((o) => !o.disabled);
    render(<Mention options={sampleOptions} placeholder="Type" />);

    const input = screen.getByPlaceholderText("Type");
    await user.type(input, "@");

    const listbox = screen.getByRole("listbox");
    const options = within(listbox).getAllByRole("option");
    expect(options).toHaveLength(nonDisabledOptions.length);
  });

  it("hides dropdown when no trigger is present", async () => {
    const user = userEvent.setup();
    render(<Mention options={sampleOptions} placeholder="Type" />);

    const input = screen.getByPlaceholderText("Type");
    await user.type(input, "hello");

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  // ── Selection ─────────────────────────────────────────────────────────

  it("selects suggestion with click", async () => {
    const user = userEvent.setup();
    const onMention = vi.fn();
    render(
      <Mention
        options={sampleOptions}
        placeholder="Type"
        onMention={onMention}
      />
    );

    const input = screen.getByPlaceholderText("Type");
    await user.type(input, "@ali");

    const option = screen.getByRole("option");
    await user.click(option);

    expect(input).toHaveValue("@Alice Johnson ");
    expect(onMention).toHaveBeenCalledWith(
      expect.objectContaining({ value: "alice", label: "Alice Johnson" })
    );
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("inserts mention text at correct position mid-text", async () => {
    const user = userEvent.setup();
    render(
      <Mention
        options={sampleOptions}
        placeholder="Type"
        defaultValue="Hello "
      />
    );

    const input = screen.getByPlaceholderText("Type");
    // Type trigger after existing text
    await user.type(input, "@bob");

    const option = screen.getByRole("option");
    await user.click(option);

    expect(input).toHaveValue("Hello @Bob Smith ");
  });

  // ── Keyboard navigation ───────────────────────────────────────────────

  it("navigates suggestions with ArrowDown and ArrowUp", async () => {
    const user = userEvent.setup();
    render(<Mention options={sampleOptions} placeholder="Type" />);

    const input = screen.getByPlaceholderText("Type");
    await user.type(input, "@");

    // First option should be active by default
    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveAttribute("aria-selected", "true");

    // Arrow down
    await user.keyboard("{ArrowDown}");
    expect(options[1]).toHaveAttribute("aria-selected", "true");
    expect(options[0]).toHaveAttribute("aria-selected", "false");

    // Arrow up goes back
    await user.keyboard("{ArrowUp}");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
  });

  it("selects suggestion with Enter key", async () => {
    const user = userEvent.setup();
    const onMention = vi.fn();
    render(
      <Mention
        options={sampleOptions}
        placeholder="Type"
        onMention={onMention}
      />
    );

    const input = screen.getByPlaceholderText("Type");
    await user.type(input, "@ali");
    await user.keyboard("{Enter}");

    expect(input).toHaveValue("@Alice Johnson ");
    expect(onMention).toHaveBeenCalled();
  });

  it("selects suggestion with Tab key", async () => {
    const user = userEvent.setup();
    render(<Mention options={sampleOptions} placeholder="Type" />);

    const input = screen.getByPlaceholderText("Type");
    await user.type(input, "@ali");
    await user.keyboard("{Tab}");

    expect(input).toHaveValue("@Alice Johnson ");
  });

  it("closes dropdown with Escape key", async () => {
    const user = userEvent.setup();
    render(<Mention options={sampleOptions} placeholder="Type" />);

    const input = screen.getByPlaceholderText("Type");
    await user.type(input, "@");
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  // ── Controlled / Uncontrolled ─────────────────────────────────────────

  it("works as controlled component", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <Mention
        options={sampleOptions}
        value="hello"
        onChange={onChange}
        placeholder="Type"
      />
    );

    const input = screen.getByPlaceholderText("Type");
    expect(input).toHaveValue("hello");

    await user.type(input, "!");
    expect(onChange).toHaveBeenCalled();

    // Rerender with new value to simulate controlled behavior
    rerender(
      <Mention
        options={sampleOptions}
        value="hello!"
        onChange={onChange}
        placeholder="Type"
      />
    );
    expect(input).toHaveValue("hello!");
  });

  it("works as uncontrolled component with defaultValue", async () => {
    const user = userEvent.setup();
    render(
      <Mention
        options={sampleOptions}
        defaultValue="hi "
        placeholder="Type"
      />
    );

    const input = screen.getByPlaceholderText("Type");
    expect(input).toHaveValue("hi ");

    await user.type(input, "there");
    expect(input).toHaveValue("hi there");
  });

  // ── Disabled state ────────────────────────────────────────────────────

  it("disables the input when disabled prop is set", () => {
    render(
      <Mention options={sampleOptions} disabled placeholder="Type" />
    );
    expect(screen.getByPlaceholderText("Type")).toBeDisabled();
  });

  // ── Loading state ─────────────────────────────────────────────────────

  it("shows spinner in dropdown when loading", async () => {
    const user = userEvent.setup();
    render(
      <Mention options={sampleOptions} loading placeholder="Type" />
    );

    const input = screen.getByPlaceholderText("Type");
    await user.type(input, "@");

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument(); // Spinner has role="status"
  });

  // ── Custom trigger ────────────────────────────────────────────────────

  it("uses custom trigger character", async () => {
    const user = userEvent.setup();
    render(
      <Mention
        options={sampleOptions}
        trigger="#"
        placeholder="Type"
      />
    );

    const input = screen.getByPlaceholderText("Type");

    // Regular @ should not trigger
    await user.type(input, "@");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    await user.clear(input);
    await user.type(input, "#");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  // ── Avatar rendering ──────────────────────────────────────────────────

  it("renders avatars in suggestions when provided", async () => {
    const user = userEvent.setup();
    render(
      <Mention options={optionsWithAvatars} placeholder="Type" />
    );

    const input = screen.getByPlaceholderText("Type");
    await user.type(input, "@");

    // Images with alt="" get role="presentation", query by that
    const images = screen.getAllByRole("presentation");
    expect(images.length).toBeGreaterThanOrEqual(2);
  });

  // ── Description rendering ─────────────────────────────────────────────

  it("renders descriptions in suggestions", async () => {
    const user = userEvent.setup();
    render(<Mention options={sampleOptions} placeholder="Type" />);

    const input = screen.getByPlaceholderText("Type");
    await user.type(input, "@ali");

    expect(screen.getByText("Engineering")).toBeInTheDocument();
  });

  // ── Not found content ─────────────────────────────────────────────────

  it("shows not found content when no options match", async () => {
    const user = userEvent.setup();
    render(
      <Mention
        options={sampleOptions}
        notFoundContent="Nobody here"
        placeholder="Type"
      />
    );

    const input = screen.getByPlaceholderText("Type");
    await user.type(input, "@zzz");

    expect(screen.getByText("Nobody here")).toBeInTheDocument();
  });

  it("shows default not found text", async () => {
    const user = userEvent.setup();
    render(<Mention options={sampleOptions} placeholder="Type" />);

    const input = screen.getByPlaceholderText("Type");
    await user.type(input, "@zzz");

    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  // ── ARIA attributes ───────────────────────────────────────────────────

  it("has correct ARIA attributes on input", () => {
    render(<Mention options={sampleOptions} placeholder="Type" />);
    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("aria-autocomplete", "list");
    expect(input).toHaveAttribute("aria-haspopup", "listbox");
    expect(input).toHaveAttribute("aria-expanded", "false");
  });

  it("sets aria-expanded true when dropdown is open", async () => {
    const user = userEvent.setup();
    render(<Mention options={sampleOptions} placeholder="Type" />);

    const input = screen.getByPlaceholderText("Type");
    await user.type(input, "@");

    expect(input).toHaveAttribute("aria-expanded", "true");
  });

  it("textarea does not have invalid ARIA attributes", () => {
    render(<Mention options={sampleOptions} multiline placeholder="Multi" />);
    const textarea = screen.getByPlaceholderText("Multi");
    expect(textarea).not.toHaveAttribute("aria-expanded");
    expect(textarea).not.toHaveAttribute("aria-haspopup");
    expect(textarea).not.toHaveAttribute("aria-autocomplete");
  });

  // ── Size variants ─────────────────────────────────────────────────────

  it.each(["sm", "md", "lg"] as const)(
    "renders with size=%s without error",
    (size) => {
      render(
        <Mention options={sampleOptions} size={size} placeholder="Type" />
      );
      expect(screen.getByPlaceholderText("Type")).toBeInTheDocument();
    }
  );

  // ── className merging ─────────────────────────────────────────────────

  it("merges className prop", () => {
    render(
      <Mention
        options={sampleOptions}
        className="custom-class"
        placeholder="Type"
      />
    );
    expect(screen.getByPlaceholderText("Type").className).toContain(
      "custom-class"
    );
  });

  // ── Wraps around at boundaries ────────────────────────────────────────

  it("wraps active index around at boundaries", async () => {
    const user = userEvent.setup();
    const opts = [
      { value: "a", label: "Alpha" },
      { value: "b", label: "Beta" },
    ];
    render(<Mention options={opts} placeholder="Type" />);

    const input = screen.getByPlaceholderText("Type");
    await user.type(input, "@");

    // Go up from first item -> wraps to last
    await user.keyboard("{ArrowUp}");
    const options = screen.getAllByRole("option");
    expect(options[1]).toHaveAttribute("aria-selected", "true");

    // Go down from last -> wraps to first
    await user.keyboard("{ArrowDown}");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
  });
});

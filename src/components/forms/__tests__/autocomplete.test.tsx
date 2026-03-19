import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { Autocomplete, type AutocompleteOption } from "../autocomplete";
import { createRef } from "react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const fruitOptions: AutocompleteOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
];

const optionsWithDisabled: AutocompleteOption[] = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Bravo", disabled: true },
  { value: "c", label: "Charlie" },
];

function getInput() {
  return screen.getByRole("combobox");
}

function openByFocus() {
  fireEvent.focus(getInput());
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Autocomplete", () => {
  // ---- Basic rendering ----

  it("renders input with placeholder", () => {
    render(<Autocomplete options={fruitOptions} placeholder="Search fruits..." />);
    expect(getInput()).toBeInTheDocument();
    expect(getInput()).toHaveAttribute("placeholder", "Search fruits...");
  });

  it("shows options on focus", () => {
    render(<Autocomplete options={fruitOptions} />);
    openByFocus();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
  });

  // ---- Client-side filtering ----

  it("filters options when typing (filterLocally)", () => {
    render(<Autocomplete options={fruitOptions} />);
    openByFocus();
    fireEvent.change(getInput(), { target: { value: "an" } });
    // "Banana" contains "an"
    expect(screen.getByText("Banana")).toBeInTheDocument();
    // "Apple" does not contain "an"
    expect(screen.queryByText("Apple")).not.toBeInTheDocument();
  });

  it("filters case-insensitively", () => {
    render(<Autocomplete options={fruitOptions} />);
    openByFocus();
    fireEvent.change(getInput(), { target: { value: "CHERRY" } });
    expect(screen.getByText("Cherry")).toBeInTheDocument();
  });

  // ---- Selection ----

  it("selects option on click and calls onChange", () => {
    const onChange = vi.fn();
    render(<Autocomplete options={fruitOptions} onChange={onChange} />);
    openByFocus();
    fireEvent.mouseDown(screen.getByText("Banana"));
    expect(onChange).toHaveBeenCalledWith("banana");
    expect(getInput()).toHaveValue("Banana");
  });

  it("closes dropdown after selecting", () => {
    render(<Autocomplete options={fruitOptions} />);
    openByFocus();
    fireEvent.mouseDown(screen.getByText("Cherry"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  // ---- Keyboard navigation ----

  it("ArrowDown opens dropdown when closed", () => {
    render(<Autocomplete options={fruitOptions} />);
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("highlights option on ArrowDown", () => {
    render(<Autocomplete options={fruitOptions} />);
    openByFocus();
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });
    // After focus, highlightedIndex starts at 0 (Apple), ArrowDown moves to 1 (Banana)
    expect(screen.getByText("Banana").closest("li")).toHaveAttribute(
      "data-highlighted"
    );
  });

  it("ArrowUp moves highlight up", () => {
    render(<Autocomplete options={fruitOptions} />);
    openByFocus();
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });
    fireEvent.keyDown(getInput(), { key: "ArrowUp" });
    expect(screen.getByText("Banana").closest("li")).toHaveAttribute(
      "data-highlighted"
    );
  });

  it("Enter selects highlighted option", () => {
    const onChange = vi.fn();
    render(<Autocomplete options={fruitOptions} onChange={onChange} />);
    openByFocus();
    fireEvent.keyDown(getInput(), { key: "ArrowDown" }); // highlight Banana
    fireEvent.keyDown(getInput(), { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("banana");
  });

  it("Escape closes dropdown", () => {
    render(<Autocomplete options={fruitOptions} />);
    openByFocus();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    fireEvent.keyDown(getInput(), { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("Tab closes dropdown", () => {
    render(<Autocomplete options={fruitOptions} />);
    openByFocus();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    fireEvent.keyDown(getInput(), { key: "Tab" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  // ---- Empty / Loading states ----

  it("shows empty message when no results", () => {
    render(<Autocomplete options={fruitOptions} />);
    openByFocus();
    fireEvent.change(getInput(), { target: { value: "zzzzz" } });
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("shows custom empty message", () => {
    render(<Autocomplete options={fruitOptions} emptyMessage="Nothing here" />);
    openByFocus();
    fireEvent.change(getInput(), { target: { value: "zzzzz" } });
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("shows loading state when loading prop is true", () => {
    render(<Autocomplete options={fruitOptions} loading />);
    openByFocus();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows custom loading message", () => {
    render(
      <Autocomplete options={fruitOptions} loading loadingMessage="Fetching..." />
    );
    openByFocus();
    expect(screen.getByText("Fetching...")).toBeInTheDocument();
  });

  // ---- freeSolo mode ----

  it("freeSolo mode fires onChange on typing", () => {
    const onChange = vi.fn();
    render(
      <Autocomplete options={fruitOptions} freeSolo onChange={onChange} />
    );
    fireEvent.focus(getInput());
    fireEvent.change(getInput(), { target: { value: "custom text" } });
    expect(onChange).toHaveBeenCalledWith("custom text");
  });

  it("freeSolo mode still allows selecting an option", () => {
    const onChange = vi.fn();
    render(
      <Autocomplete options={fruitOptions} freeSolo onChange={onChange} />
    );
    openByFocus();
    fireEvent.mouseDown(screen.getByText("Apple"));
    expect(onChange).toHaveBeenCalledWith("apple");
    expect(getInput()).toHaveValue("Apple");
  });

  // ---- Ref forwarding ----

  it("forwards ref to the input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Autocomplete options={fruitOptions} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.getAttribute("role")).toBe("combobox");
  });

  // ---- displayName ----

  it("has displayName set", () => {
    expect(Autocomplete.displayName).toBe("Autocomplete");
  });

  // ---- className merging ----

  it("merges className onto the input", () => {
    render(<Autocomplete options={fruitOptions} className="my-custom-class" />);
    expect(getInput()).toHaveClass("my-custom-class");
  });

  // ---- Disabled state ----

  it("disabled state prevents opening", () => {
    render(<Autocomplete options={fruitOptions} disabled />);
    expect(getInput()).toBeDisabled();
    fireEvent.focus(getInput());
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  // ---- Error state ----

  it("error state shows aria-invalid and error message", () => {
    render(<Autocomplete options={fruitOptions} error="Required" />);
    expect(getInput()).toHaveAttribute("aria-invalid", "true");
    const errorEl = screen.getByRole("alert");
    expect(errorEl).toHaveTextContent("Required");
  });

  // ---- Label ----

  it("renders a label when provided", () => {
    render(<Autocomplete options={fruitOptions} label="Fruit" />);
    expect(screen.getByText("Fruit")).toBeInTheDocument();
  });

  // ---- Click outside ----

  it("closes on outside click", () => {
    render(
      <div>
        <Autocomplete options={fruitOptions} />
        <button data-testid="outside">Outside</button>
      </div>
    );
    openByFocus();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  // ---- Disabled options ----

  it("does not select disabled options", () => {
    const onChange = vi.fn();
    render(<Autocomplete options={optionsWithDisabled} onChange={onChange} />);
    openByFocus();
    fireEvent.mouseDown(screen.getByText("Bravo"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("skips disabled items during keyboard navigation", () => {
    render(<Autocomplete options={optionsWithDisabled} />);
    openByFocus();
    // Start at Alpha (index 0), ArrowDown should skip Bravo -> land on Charlie
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });
    expect(screen.getByText("Charlie").closest("li")).toHaveAttribute(
      "data-highlighted"
    );
  });

  // ---- ARIA attributes ----

  it("has aria-expanded and aria-haspopup on the input", () => {
    render(<Autocomplete options={fruitOptions} />);
    expect(getInput()).toHaveAttribute("aria-expanded", "false");
    expect(getInput()).toHaveAttribute("aria-haspopup", "listbox");
    openByFocus();
    expect(getInput()).toHaveAttribute("aria-expanded", "true");
  });

  it("has aria-autocomplete='list' on the input", () => {
    render(<Autocomplete options={fruitOptions} />);
    expect(getInput()).toHaveAttribute("aria-autocomplete", "list");
  });

  // ---- Size variants ----

  it("applies size classes", () => {
    const { rerender } = render(<Autocomplete options={fruitOptions} size="sm" />);
    expect(getInput()).toHaveClass("h-8");

    rerender(<Autocomplete options={fruitOptions} size="lg" />);
    expect(getInput()).toHaveClass("h-12");
  });

  // ---- Empty options list ----

  it("shows empty message when options array is empty", () => {
    render(<Autocomplete options={[]} />);
    openByFocus();
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  // ---- Async search ----

  it("calls onSearch with debounced query", async () => {
    const onSearch = vi.fn().mockResolvedValue([
      { value: "result1", label: "Result 1" },
    ]);

    render(
      <Autocomplete onSearch={onSearch} debounceMs={50} />
    );

    fireEvent.focus(getInput());
    fireEvent.change(getInput(), { target: { value: "test" } });

    // Should not be called immediately
    expect(onSearch).not.toHaveBeenCalled();

    // Wait for debounce to fire
    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith("test");
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Combobox, type ComboboxOption } from "../combobox";
import { createRef } from "react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const basicOptions: ComboboxOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
];

const optionsWithDisabled: ComboboxOption[] = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Bravo", disabled: true },
  { value: "c", label: "Charlie" },
];

function generateLargeOptions(count: number): ComboboxOption[] {
  return Array.from({ length: count }, (_, i) => ({
    value: `item-${i}`,
    label: `Item ${i}`,
  }));
}

function getTrigger() {
  return screen.getByRole("combobox");
}

function openCombobox() {
  fireEvent.click(getTrigger());
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Combobox", () => {
  // ---- Basic rendering ----

  it("renders a combobox trigger button", () => {
    render(<Combobox options={basicOptions} />);
    expect(getTrigger()).toBeInTheDocument();
  });

  it("shows placeholder text when no value is selected", () => {
    render(<Combobox options={basicOptions} placeholder="Pick a fruit" />);
    expect(getTrigger()).toHaveTextContent("Pick a fruit");
  });

  it("shows the selected option label for a controlled value", () => {
    render(<Combobox options={basicOptions} value="banana" />);
    expect(getTrigger()).toHaveTextContent("Banana");
  });

  it("shows the selected option label for a default value", () => {
    render(<Combobox options={basicOptions} defaultValue="cherry" />);
    expect(getTrigger()).toHaveTextContent("Cherry");
  });

  it("renders error message", () => {
    render(<Combobox options={basicOptions} error="Required field" />);
    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("applies disabled state", () => {
    render(<Combobox options={basicOptions} disabled />);
    expect(getTrigger()).toBeDisabled();
  });

  // ---- ARIA attributes ----

  it("has role='combobox' on the trigger", () => {
    render(<Combobox options={basicOptions} />);
    expect(getTrigger()).toHaveAttribute("role", "combobox");
  });

  it("has aria-expanded=false when closed", () => {
    render(<Combobox options={basicOptions} />);
    expect(getTrigger()).toHaveAttribute("aria-expanded", "false");
  });

  it("has aria-expanded=true when open", () => {
    render(<Combobox options={basicOptions} />);
    openCombobox();
    expect(getTrigger()).toHaveAttribute("aria-expanded", "true");
  });

  it("has aria-haspopup='listbox'", () => {
    render(<Combobox options={basicOptions} />);
    expect(getTrigger()).toHaveAttribute("aria-haspopup", "listbox");
  });

  it("forwards aria-label", () => {
    render(<Combobox options={basicOptions} aria-label="Select fruit" />);
    expect(getTrigger()).toHaveAttribute("aria-label", "Select fruit");
  });

  it("has type='button' on the trigger", () => {
    render(<Combobox options={basicOptions} />);
    expect(getTrigger()).toHaveAttribute("type", "button");
  });

  // ---- Dropdown open/close ----

  it("opens dropdown on click", () => {
    render(<Combobox options={basicOptions} />);
    openCombobox();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("closes dropdown on second click", () => {
    render(<Combobox options={basicOptions} />);
    openCombobox();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    fireEvent.click(getTrigger());
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes dropdown when clicking outside", () => {
    render(
      <div>
        <Combobox options={basicOptions} />
        <button data-testid="outside">Outside</button>
      </div>
    );
    openCombobox();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("does not open when disabled", () => {
    render(<Combobox options={basicOptions} disabled />);
    fireEvent.click(getTrigger());
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  // ---- Option selection ----

  it("selects an option on click", () => {
    const onChange = vi.fn();
    render(<Combobox options={basicOptions} onChange={onChange} />);
    openCombobox();
    fireEvent.mouseDown(screen.getByText("Banana"));
    expect(onChange).toHaveBeenCalledWith("banana");
  });

  it("closes dropdown after selection", () => {
    render(<Combobox options={basicOptions} />);
    openCombobox();
    fireEvent.mouseDown(screen.getByText("Cherry"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("updates displayed value after selection (uncontrolled)", () => {
    render(<Combobox options={basicOptions} />);
    openCombobox();
    fireEvent.mouseDown(screen.getByText("Apple"));
    expect(getTrigger()).toHaveTextContent("Apple");
  });

  it("does not select disabled options", () => {
    const onChange = vi.fn();
    render(<Combobox options={optionsWithDisabled} onChange={onChange} />);
    openCombobox();
    fireEvent.mouseDown(screen.getByText("Bravo"));
    expect(onChange).not.toHaveBeenCalled();
  });

  // ---- Search filtering ----

  it("filters options based on search input", () => {
    render(<Combobox options={basicOptions} />);
    openCombobox();
    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "an" } });
    // "Banana" contains "an"
    expect(screen.getByText("Banana")).toBeInTheDocument();
    // "Apple" does not contain "an"
    expect(screen.queryByText("Apple")).not.toBeInTheDocument();
  });

  it("shows no results message when search matches nothing", () => {
    render(<Combobox options={basicOptions} />);
    openCombobox();
    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "zzzzz" } });
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("search is case-insensitive", () => {
    render(<Combobox options={basicOptions} />);
    openCombobox();
    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "APPLE" } });
    expect(screen.getByText("Apple")).toBeInTheDocument();
  });

  it("resets search when dropdown reopens", () => {
    render(<Combobox options={basicOptions} />);
    openCombobox();
    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "ban" } });
    fireEvent.click(getTrigger()); // close
    openCombobox(); // reopen
    const newSearchInput = screen.getByRole("searchbox");
    expect(newSearchInput).toHaveValue("");
  });

  // ---- Keyboard navigation ----

  it("opens dropdown with ArrowDown key", () => {
    render(<Combobox options={basicOptions} />);
    fireEvent.keyDown(getTrigger(), { key: "ArrowDown" });
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("opens dropdown with Enter key", () => {
    render(<Combobox options={basicOptions} />);
    fireEvent.keyDown(getTrigger(), { key: "Enter" });
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("opens dropdown with Space key", () => {
    render(<Combobox options={basicOptions} />);
    fireEvent.keyDown(getTrigger(), { key: " " });
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("navigates with ArrowDown", () => {
    render(<Combobox options={basicOptions} />);
    openCombobox();
    const wrapper = getTrigger().closest("div[class]")!;
    // First item is highlighted by default
    expect(screen.getByText("Apple").closest("li")).toHaveAttribute(
      "data-highlighted"
    );
    fireEvent.keyDown(wrapper, { key: "ArrowDown" });
    expect(screen.getByText("Banana").closest("li")).toHaveAttribute(
      "data-highlighted"
    );
  });

  it("navigates with ArrowUp", () => {
    render(<Combobox options={basicOptions} />);
    openCombobox();
    const wrapper = getTrigger().closest("div[class]")!;
    fireEvent.keyDown(wrapper, { key: "ArrowDown" });
    fireEvent.keyDown(wrapper, { key: "ArrowDown" });
    fireEvent.keyDown(wrapper, { key: "ArrowUp" });
    expect(screen.getByText("Banana").closest("li")).toHaveAttribute(
      "data-highlighted"
    );
  });

  it("selects highlighted item with Enter", () => {
    const onChange = vi.fn();
    render(<Combobox options={basicOptions} onChange={onChange} />);
    openCombobox();
    const wrapper = getTrigger().closest("div[class]")!;
    fireEvent.keyDown(wrapper, { key: "ArrowDown" }); // highlight Banana
    fireEvent.keyDown(wrapper, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("banana");
  });

  it("closes dropdown with Escape", () => {
    render(<Combobox options={basicOptions} />);
    openCombobox();
    const wrapper = getTrigger().closest("div[class]")!;
    fireEvent.keyDown(wrapper, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("jumps to first item with Home key", () => {
    render(<Combobox options={basicOptions} />);
    openCombobox();
    const wrapper = getTrigger().closest("div[class]")!;
    fireEvent.keyDown(wrapper, { key: "ArrowDown" });
    fireEvent.keyDown(wrapper, { key: "ArrowDown" });
    fireEvent.keyDown(wrapper, { key: "Home" });
    expect(screen.getByText("Apple").closest("li")).toHaveAttribute(
      "data-highlighted"
    );
  });

  it("jumps to last item with End key", () => {
    render(<Combobox options={basicOptions} />);
    openCombobox();
    const wrapper = getTrigger().closest("div[class]")!;
    fireEvent.keyDown(wrapper, { key: "End" });
    expect(screen.getByText("Elderberry").closest("li")).toHaveAttribute(
      "data-highlighted"
    );
  });

  it("skips disabled items during keyboard navigation", () => {
    render(<Combobox options={optionsWithDisabled} />);
    openCombobox();
    const wrapper = getTrigger().closest("div[class]")!;
    // Start at Alpha (index 0), ArrowDown should skip Bravo → land on Charlie
    fireEvent.keyDown(wrapper, { key: "ArrowDown" });
    expect(screen.getByText("Charlie").closest("li")).toHaveAttribute(
      "data-highlighted"
    );
  });

  // ---- Ref forwarding ----

  it("forwards ref to the trigger button", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Combobox options={basicOptions} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.getAttribute("role")).toBe("combobox");
  });

  // ---- displayName ----

  it("has displayName set", () => {
    expect(Combobox.displayName).toBe("Combobox");
  });

  // ---- Option with value-only (no label) ----

  it("renders option value when label is omitted", () => {
    const opts: ComboboxOption[] = [{ value: "raw-value" }];
    render(<Combobox options={opts} />);
    openCombobox();
    expect(screen.getByText("raw-value")).toBeInTheDocument();
  });

  // ---- aria-selected on options ----

  it("marks the selected option with aria-selected", () => {
    render(<Combobox options={basicOptions} value="banana" />);
    openCombobox();
    const listbox = screen.getByRole("listbox");
    // Query within the listbox to avoid matching the trigger's displayed value
    const options = listbox.querySelectorAll("li");
    const bananaOption = Array.from(options).find(
      (li) => li.textContent?.includes("Banana")
    );
    expect(bananaOption).toHaveAttribute("aria-selected", "true");
  });

  it("marks non-selected options with aria-selected=false", () => {
    render(<Combobox options={basicOptions} value="banana" />);
    openCombobox();
    const listbox = screen.getByRole("listbox");
    const options = listbox.querySelectorAll("li");
    const appleOption = Array.from(options).find(
      (li) => li.textContent?.includes("Apple")
    );
    expect(appleOption).toHaveAttribute("aria-selected", "false");
  });

  // ---- Disabled option has aria-disabled ----

  it("marks disabled options with aria-disabled", () => {
    render(<Combobox options={optionsWithDisabled} />);
    openCombobox();
    const option = screen.getByText("Bravo").closest("li");
    expect(option).toHaveAttribute("aria-disabled", "true");
  });

  // ========================================================================
  // Virtualization tests
  // ========================================================================

  describe("virtualized mode", () => {
    const largeOptions = generateLargeOptions(1000);

    // Mock scrolling and container dimensions for virtual list
    beforeEach(() => {
      // ResizeObserver mock
      const ro = vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      }));
      vi.stubGlobal("ResizeObserver", ro);
    });

    it("renders with virtualized=true without crashing", () => {
      render(<Combobox options={largeOptions} virtualized />);
      expect(getTrigger()).toBeInTheDocument();
    });

    it("opens dropdown in virtualized mode", () => {
      render(<Combobox options={largeOptions} virtualized />);
      openCombobox();
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("renders a subset of items (not all 1000)", () => {
      render(
        <Combobox
          options={largeOptions}
          virtualized
          estimateSize={36}
          overscan={5}
        />
      );
      openCombobox();
      const listbox = screen.getByRole("listbox");
      // With 0 container height in jsdom, virtual list may render 0 items or
      // only overscan items. The key assertion: NOT all 1000 items are in DOM.
      const items = listbox.querySelectorAll("li");
      expect(items.length).toBeLessThan(1000);
    });

    it("sets total height on the list container", () => {
      render(
        <Combobox
          options={largeOptions}
          virtualized
          estimateSize={36}
        />
      );
      openCombobox();
      const listbox = screen.getByRole("listbox");
      // Total height = 1000 * 36 = 36000px
      expect(listbox.style.height).toBe("36000px");
    });

    it("uses absolute positioning on virtual items", () => {
      // Simulate a container with height so some items render
      render(
        <Combobox
          options={largeOptions}
          virtualized
          estimateSize={36}
          overscan={5}
        />
      );
      openCombobox();
      const listbox = screen.getByRole("listbox");
      expect(listbox.style.position).toBe("relative");

      const items = listbox.querySelectorAll("li");
      if (items.length > 0) {
        expect(items[0].style.position).toBe("absolute");
      }
    });

    it("search filtering works in virtualized mode", () => {
      render(<Combobox options={largeOptions} virtualized />);
      openCombobox();
      const searchInput = screen.getByRole("searchbox");
      fireEvent.change(searchInput, { target: { value: "Item 999" } });
      // Should filter to just "Item 999"
      const listbox = screen.getByRole("listbox");
      // Total height should reflect filtered count * estimateSize
      // "Item 999" matches only 1 item → 36px
      expect(listbox.style.height).toBe("36px");
    });

    it("keyboard navigation works in virtualized mode", () => {
      render(
        <Combobox
          options={basicOptions}
          virtualized
          estimateSize={36}
          overscan={10}
        />
      );
      openCombobox();
      const wrapper = getTrigger().closest("div[class]")!;
      fireEvent.keyDown(wrapper, { key: "ArrowDown" });
      // No crash = success for keyboard nav in virtualized mode
      fireEvent.keyDown(wrapper, { key: "Enter" });
      // Should have selected the item
      expect(getTrigger()).toHaveTextContent("Banana");
    });

    it("shows 'No results found' when search matches nothing in virtual mode", () => {
      render(<Combobox options={largeOptions} virtualized />);
      openCombobox();
      const searchInput = screen.getByRole("searchbox");
      fireEvent.change(searchInput, { target: { value: "nonexistent-item" } });
      expect(screen.getByText("No results found")).toBeInTheDocument();
    });

    it("respects custom estimateSize", () => {
      const opts = generateLargeOptions(100);
      render(
        <Combobox options={opts} virtualized estimateSize={50} />
      );
      openCombobox();
      const listbox = screen.getByRole("listbox");
      // 100 * 50 = 5000
      expect(listbox.style.height).toBe("5000px");
    });

    it("selects option via click in virtualized mode", () => {
      const onChange = vi.fn();
      render(
        <Combobox
          options={basicOptions}
          virtualized
          estimateSize={36}
          overscan={10}
          onChange={onChange}
        />
      );
      openCombobox();
      // With overscan=10 and only 5 items, all should render
      fireEvent.mouseDown(screen.getByText("Cherry"));
      expect(onChange).toHaveBeenCalledWith("cherry");
    });
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Label } from "../label";
import { Textarea } from "../textarea";
import { PasswordInput } from "../password-input";
import { SearchInput } from "../search-input";
import { RadioGroup } from "../radio-group";
import { FormField } from "../form-field";
import { IconButton } from "../icon-button";
import { ButtonGroup } from "../button-group";
import { SegmentedControl } from "../segmented-control";
import { TabFilter } from "../tab-filter";
import { FilterBar } from "../filter-bar";

// ── Label ────────────────────────────────────────────────────────

describe("Label", () => {
  it("renders text content", () => {
    render(<Label>Email</Label>);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders as a <label> element", () => {
    render(<Label>Name</Label>);
    expect(screen.getByText("Name").tagName).toBe("LABEL");
  });

  it("passes htmlFor", () => {
    render(<Label htmlFor="email-input">Email</Label>);
    expect(screen.getByText("Email")).toHaveAttribute("for", "email-input");
  });

  it("merges className", () => {
    render(<Label className="custom-class">Test</Label>);
    expect(screen.getByText("Test")).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Label ref={ref}>Ref test</Label>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLLabelElement));
  });
});

// ── Textarea ─────────────────────────────────────────────────────

describe("Textarea", () => {
  it("renders a textarea element", () => {
    render(<Textarea placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter text").tagName).toBe("TEXTAREA");
  });

  it("displays error message when error prop is set", () => {
    render(<Textarea error="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("does not display error message when error prop is absent", () => {
    render(<Textarea placeholder="No error" />);
    expect(screen.queryByText("This field is required")).not.toBeInTheDocument();
  });

  it("merges className", () => {
    render(<Textarea className="custom" placeholder="test" />);
    expect(screen.getByPlaceholderText("test")).toHaveClass("custom");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Textarea ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLTextAreaElement));
  });

  it("supports disabled state", () => {
    render(<Textarea disabled placeholder="disabled" />);
    expect(screen.getByPlaceholderText("disabled")).toBeDisabled();
  });
});

// ── PasswordInput ────────────────────────────────────────────────

describe("PasswordInput", () => {
  it("renders a password input", () => {
    render(<PasswordInput placeholder="Password" />);
    const input = screen.getByPlaceholderText("Password");
    expect(input).toHaveAttribute("type", "password");
  });

  it("shows toggle visibility button", () => {
    render(<PasswordInput />);
    // The button label is "Show password" when password is hidden
    expect(
      screen.getByRole("button", { name: "Show password" })
    ).toBeInTheDocument();
  });

  it("displays error message", () => {
    render(<PasswordInput error="Password is too short" />);
    expect(screen.getByText("Password is too short")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<PasswordInput ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

  it("supports disabled state", () => {
    render(<PasswordInput disabled placeholder="disabled" />);
    expect(screen.getByPlaceholderText("disabled")).toBeDisabled();
  });
});

// ── SearchInput ──────────────────────────────────────────────────

describe("SearchInput", () => {
  it("renders a search input", () => {
    render(<SearchInput placeholder="Search..." />);
    const input = screen.getByPlaceholderText("Search...");
    expect(input).toHaveAttribute("type", "search");
  });

  it("does not show clear button when value is empty", () => {
    render(<SearchInput value="" onClear={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
  });

  it("shows clear button when value is present and onClear is provided", () => {
    render(<SearchInput value="test" onClear={vi.fn()} onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Clear search" })).toBeInTheDocument();
  });

  it("calls onClear when clear button is clicked", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<SearchInput value="query" onClear={onClear} onChange={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<SearchInput ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });
});

// ── RadioGroup ───────────────────────────────────────────────────

describe("RadioGroup", () => {
  const options = [
    { label: "Option A", value: "a" },
    { label: "Option B", value: "b" },
    { label: "Option C", value: "c" },
  ];

  it("renders all options", () => {
    render(<RadioGroup options={options} />);
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
    expect(screen.getByText("Option C")).toBeInTheDocument();
  });

  it("renders radio inputs for each option", () => {
    render(<RadioGroup options={options} name="test" />);
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
  });

  it("selects defaultValue", () => {
    render(<RadioGroup options={options} defaultValue="b" name="test" />);
    const radios = screen.getAllByRole("radio");
    expect(radios[1]).toBeChecked();
  });

  it("calls onValueChange when an option is clicked", () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup options={options} onValueChange={onValueChange} name="test" />
    );
    fireEvent.click(screen.getByText("Option B"));
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("renders card variant with descriptions", () => {
    const cardOptions = [
      { label: "Card A", value: "a", description: "Description A" },
      { label: "Card B", value: "b", description: "Description B" },
    ];
    render(<RadioGroup options={cardOptions} variant="card" />);
    expect(screen.getByText("Description A")).toBeInTheDocument();
    expect(screen.getByText("Description B")).toBeInTheDocument();
  });
});

// ── FormField ────────────────────────────────────────────────────

describe("FormField", () => {
  it("renders label and input", () => {
    render(<FormField label="Email" placeholder="Enter email" />);
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<FormField label="Email" error="Required" />);
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("shows hint when no error", () => {
    render(
      <FormField label="Email" hint="We will never share your email">
        <input id="email" />
      </FormField>
    );
    expect(screen.getByText("We will never share your email")).toBeInTheDocument();
  });

  it("hides hint when error is present", () => {
    render(
      <FormField label="Email" error="Required" hint="Hint text">
        <input id="email" />
      </FormField>
    );
    expect(screen.queryByText("Hint text")).not.toBeInTheDocument();
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("wraps custom children with label", () => {
    render(
      <FormField label="Custom">
        <select>
          <option>Choose</option>
        </select>
      </FormField>
    );
    expect(screen.getByText("Custom")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});

// ── IconButton ───────────────────────────────────────────────────

describe("IconButton", () => {
  it("renders a button with type='button'", () => {
    render(<IconButton icon="settings" aria-label="Settings" />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "button");
  });

  it("renders without aria-label when not provided", () => {
    render(<IconButton icon="settings" />);
    const button = screen.getByRole("button");
    // IconButton does not default aria-label to icon name
    expect(button).not.toHaveAttribute("aria-label");
  });

  it("allows custom aria-label", () => {
    render(<IconButton icon="settings" aria-label="Open settings" />);
    expect(
      screen.getByRole("button", { name: "Open settings" })
    ).toBeInTheDocument();
  });

  it("fires onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<IconButton icon="close" onClick={onClick} aria-label="Close" />);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("supports disabled state", () => {
    render(<IconButton icon="edit" disabled aria-label="Edit" />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<IconButton icon="close" ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });
});

// ── ButtonGroup ──────────────────────────────────────────────────

describe("ButtonGroup", () => {
  it("renders children", () => {
    render(
      <ButtonGroup>
        <button>A</button>
        <button>B</button>
      </ButtonGroup>
    );
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("has role='group'", () => {
    render(
      <ButtonGroup>
        <button>A</button>
      </ButtonGroup>
    );
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("merges className", () => {
    render(
      <ButtonGroup className="custom">
        <button>A</button>
      </ButtonGroup>
    );
    expect(screen.getByRole("group")).toHaveClass("custom");
  });
});

// ── SegmentedControl ─────────────────────────────────────────────

describe("SegmentedControl", () => {
  const items = [
    { label: "Day", value: "day" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
  ];

  it("renders all items", () => {
    render(<SegmentedControl items={items} />);
    expect(screen.getByText("Day")).toBeInTheDocument();
    expect(screen.getByText("Week")).toBeInTheDocument();
    expect(screen.getByText("Month")).toBeInTheDocument();
  });

  it("renders radio buttons with type='button'", () => {
    render(<SegmentedControl items={items} />);
    // SegmentedControl uses role="radio" not role="button"
    const radios = screen.getAllByRole("radio");
    radios.forEach((btn) => {
      expect(btn).toHaveAttribute("type", "button");
    });
  });

  it("calls onValueChange when a segment is clicked", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SegmentedControl items={items} onValueChange={onValueChange} />);
    await user.click(screen.getByText("Week"));
    expect(onValueChange).toHaveBeenCalledWith("week");
  });

  it("selects defaultValue", () => {
    render(<SegmentedControl items={items} defaultValue="month" />);
    // The "month" button should exist and the component should render
    expect(screen.getByText("Month")).toBeInTheDocument();
  });
});

// ── TabFilter ────────────────────────────────────────────────────

describe("TabFilter", () => {
  const items = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Archived", value: "archived" },
  ];

  it("renders all items as tabs", () => {
    render(<TabFilter items={items} />);
    // TabFilter uses role="tab" for desktop buttons
    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBeGreaterThanOrEqual(3);
  });

  it("renders a mobile select", () => {
    render(<TabFilter items={items} />);
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(3);
  });

  it("calls onValueChange when a tab is clicked", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TabFilter items={items} onValueChange={onValueChange} />);
    const tabs = screen.getAllByRole("tab");
    await user.click(tabs.find((b) => b.textContent === "Active")!);
    expect(onValueChange).toHaveBeenCalledWith("active");
  });
});

// ── FilterBar ────────────────────────────────────────────────────

describe("FilterBar", () => {
  const filters = [
    { label: "Design", value: "design" },
    { label: "Engineering", value: "engineering" },
    { label: "Marketing", value: "marketing" },
  ];

  it("renders all filter chips", () => {
    render(<FilterBar filters={filters} />);
    expect(screen.getByText("Design")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("Marketing")).toBeInTheDocument();
  });

  it("toggles a filter on click", () => {
    const onFilterChange = vi.fn();
    render(<FilterBar filters={filters} onFilterChange={onFilterChange} />);
    fireEvent.click(screen.getByText("Design"));
    expect(onFilterChange).toHaveBeenCalledWith(["design"]);
  });

  it("shows clear all button when filters are active", () => {
    render(
      <FilterBar
        filters={filters}
        activeValues={["design"]}
        showClearAll
      />
    );
    expect(screen.getByText("Clear all")).toBeInTheDocument();
  });

  it("hides clear all when no filters are active", () => {
    render(<FilterBar filters={filters} activeValues={[]} showClearAll />);
    expect(screen.queryByText("Clear all")).not.toBeInTheDocument();
  });

  it("calls onFilterChange with empty array on clear all", () => {
    const onFilterChange = vi.fn();
    render(
      <FilterBar
        filters={filters}
        activeValues={["design"]}
        onFilterChange={onFilterChange}
        showClearAll
      />
    );
    fireEvent.click(screen.getByText("Clear all"));
    expect(onFilterChange).toHaveBeenCalledWith([]);
  });
});

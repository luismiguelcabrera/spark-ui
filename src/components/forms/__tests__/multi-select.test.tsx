import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MultiSelect } from "../multi-select";

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "SolidJS" },
];

describe("MultiSelect", () => {
  it("renders with placeholder", () => {
    render(<MultiSelect options={options} placeholder="Pick frameworks" />);
    expect(screen.getByPlaceholderText("Pick frameworks")).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(<MultiSelect options={options} label="Frameworks" />);
    expect(screen.getByText("Frameworks")).toBeInTheDocument();
  });

  it("opens dropdown on click", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={options} />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(5);
  });

  it("selects an option on click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MultiSelect options={options} onChange={onChange} />);
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("React"));
    expect(onChange).toHaveBeenCalledWith(["react"]);
  });

  it("shows selected items as chips", async () => {
    render(<MultiSelect options={options} value={["react", "vue"]} />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Vue")).toBeInTheDocument();
  });

  it("removes a chip when X is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MultiSelect options={options} value={["react", "vue"]} onChange={onChange} />,
    );
    const removeBtn = screen.getByLabelText("Remove React");
    await user.click(removeBtn);
    expect(onChange).toHaveBeenCalledWith(["vue"]);
  });

  it("clears all when clear button is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MultiSelect options={options} value={["react", "vue"]} onChange={onChange} clearable />,
    );
    await user.click(screen.getByLabelText("Clear all selections"));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("filters options by search query", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={options} />);
    await user.click(screen.getByRole("combobox"));
    await user.type(screen.getByLabelText("Search options"), "rea");
    const listbox = screen.getByRole("listbox");
    expect(within(listbox).getAllByRole("option")).toHaveLength(1);
    expect(within(listbox).getByText("React")).toBeInTheDocument();
  });

  it("shows 'No results found' when no match", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={options} />);
    await user.click(screen.getByRole("combobox"));
    await user.type(screen.getByLabelText("Search options"), "zzzzz");
    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });

  it("hides already-selected options from the dropdown", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={options} value={["react"]} />);
    await user.click(screen.getByRole("combobox"));
    const listbox = screen.getByRole("listbox");
    expect(within(listbox).queryByText("React")).not.toBeInTheDocument();
    expect(within(listbox).getAllByRole("option")).toHaveLength(4);
  });

  it("respects maxSelections", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MultiSelect
        options={options}
        value={["react", "vue"]}
        onChange={onChange}
        maxSelections={2}
      />,
    );
    expect(screen.getByText("2/2 selected")).toBeInTheDocument();
    // Open dropdown — options should show as disabled
    await user.click(screen.getByRole("combobox"));
    const opts = screen.getAllByRole("option");
    opts.forEach((opt) => {
      expect(opt).toHaveAttribute("aria-disabled", "true");
    });
  });

  it("shows error message", () => {
    render(<MultiSelect options={options} error="Required" />);
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("forwards ref to container div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<MultiSelect ref={ref} options={options} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<MultiSelect ref={ref} options={options} className="custom-cls" />);
    expect(ref.current).toHaveClass("custom-cls");
  });

  it("disables interaction when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MultiSelect options={options} disabled onChange={onChange} />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("removes last chip with Backspace when search is empty", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MultiSelect options={options} value={["react", "vue"]} onChange={onChange} />,
    );
    const input = screen.getByLabelText("Search options");
    await user.click(input);
    await user.keyboard("{Backspace}");
    expect(onChange).toHaveBeenCalledWith(["react"]);
  });

  it("navigates with arrow keys and selects with Enter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MultiSelect options={options} onChange={onChange} />);
    await user.click(screen.getByRole("combobox"));
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledWith(["react"]);
  });

  it("closes dropdown on Escape", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={options} />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it.each(["sm", "md", "lg"] as const)("renders size %s", (sz) => {
    render(<MultiSelect options={options} size={sz} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("works uncontrolled with defaultValue", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={options} defaultValue={["react"]} />);
    expect(screen.getByText("React")).toBeInTheDocument();
    // Remove the chip
    await user.click(screen.getByLabelText("Remove React"));
    expect(screen.queryByText("React")).not.toBeInTheDocument();
  });

  it("hides clear button when clearable is false", () => {
    render(
      <MultiSelect options={options} value={["react"]} clearable={false} />,
    );
    expect(screen.queryByLabelText("Clear all selections")).not.toBeInTheDocument();
  });

  it("supports disabled options", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const opts = [
      { value: "a", label: "A" },
      { value: "b", label: "B", disabled: true },
    ];
    render(<MultiSelect options={opts} onChange={onChange} />);
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("B"));
    expect(onChange).not.toHaveBeenCalled();
  });
});

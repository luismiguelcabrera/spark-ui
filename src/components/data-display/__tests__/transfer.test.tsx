import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Transfer, type TransferItem } from "../transfer";

const items: TransferItem[] = [
  { key: "js", label: "JavaScript", description: "Dynamic language" },
  { key: "ts", label: "TypeScript", description: "Typed JavaScript" },
  { key: "py", label: "Python", description: "General purpose" },
  { key: "rs", label: "Rust", description: "Systems language" },
  { key: "go", label: "Go", description: "Concurrent language" },
  { key: "disabled", label: "Disabled Item", disabled: true },
];

describe("Transfer", () => {
  it("renders without error", () => {
    render(<Transfer dataSource={items} />);
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
  });

  it("renders source and target panels", () => {
    render(<Transfer dataSource={items} />);
    const panels = screen.getAllByRole("group");
    expect(panels).toHaveLength(2);
  });

  it("renders custom titles", () => {
    render(<Transfer dataSource={items} titles={["Available", "Selected"]} />);
    expect(screen.getByText("Available")).toBeInTheDocument();
    expect(screen.getByText("Selected")).toBeInTheDocument();
  });

  it("renders default titles", () => {
    render(<Transfer dataSource={items} />);
    expect(screen.getByText("Source")).toBeInTheDocument();
    expect(screen.getByText("Target")).toBeInTheDocument();
  });

  it("moves items from source to target", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Transfer dataSource={items} onChange={onChange} />);

    // Select JavaScript checkbox via its label text
    await user.click(screen.getByText("JavaScript"));

    // Click move right button
    await user.click(screen.getByLabelText("Move selected items to target"));
    expect(onChange).toHaveBeenCalledWith(["js"], "right", ["js"]);
  });

  it("moves items from target to source", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Transfer
        dataSource={items}
        defaultTargetKeys={["js", "ts"]}
        onChange={onChange}
      />
    );

    // Select TypeScript from target
    await user.click(screen.getByText("TypeScript"));

    // Click move left button
    await user.click(screen.getByLabelText("Move selected items to source"));
    expect(onChange).toHaveBeenCalledWith(["js"], "left", ["ts"]);
  });

  it("shows items in target when defaultTargetKeys is set", () => {
    render(<Transfer dataSource={items} defaultTargetKeys={["js", "ts"]} />);
    const panels = screen.getAllByRole("group");
    const targetPanel = panels[1];
    expect(within(targetPanel).getByText("JavaScript")).toBeInTheDocument();
    expect(within(targetPanel).getByText("TypeScript")).toBeInTheDocument();
  });

  it("removes items from source when they are in target", () => {
    render(<Transfer dataSource={items} defaultTargetKeys={["js"]} />);
    const panels = screen.getAllByRole("group");
    const sourcePanel = panels[0];
    expect(within(sourcePanel).queryByText("JavaScript")).not.toBeInTheDocument();
  });

  it("filters items when searchable", async () => {
    const user = userEvent.setup();
    render(<Transfer dataSource={items} searchable />);

    const searchInput = screen.getByLabelText("Search source");
    await user.type(searchInput, "Type");

    const panels = screen.getAllByRole("group");
    const sourcePanel = panels[0];
    expect(within(sourcePanel).getByText("TypeScript")).toBeInTheDocument();
    expect(within(sourcePanel).queryByText("JavaScript")).not.toBeInTheDocument();
  });

  it("select all toggles all visible non-disabled items", async () => {
    const user = userEvent.setup();
    render(<Transfer dataSource={items} showSelectAll />);

    const selectAllBtn = screen.getByLabelText("Select all source items");
    await user.click(selectAllBtn);

    // All non-disabled checkboxes in source should be checked
    const sourcePanel = screen.getAllByRole("group")[0];
    const sourceCheckboxes = within(sourcePanel).getAllByRole("checkbox");
    // Filter out the select-all checkbox itself (first checkbox)
    const itemCheckboxes = sourceCheckboxes.slice(1);
    itemCheckboxes.forEach((cb) => {
      if (!(cb as HTMLInputElement).disabled) {
        expect(cb).toBeChecked();
      }
    });
  });

  it("disabled items cannot be selected", () => {
    render(<Transfer dataSource={items} />);

    // The disabled item's li should have aria-disabled
    const disabledLi = screen.getByText("Disabled Item").closest("li");
    expect(disabledLi).toHaveAttribute("aria-disabled", "true");
  });

  it("transfer buttons are disabled when no items are selected", () => {
    render(<Transfer dataSource={items} />);
    expect(
      screen.getByLabelText("Move selected items to target")
    ).toBeDisabled();
    expect(
      screen.getByLabelText("Move selected items to source")
    ).toBeDisabled();
  });

  it("works in controlled mode", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <Transfer dataSource={items} targetKeys={["js"]} onChange={onChange} />
    );

    // JS should be in target
    const panels = screen.getAllByRole("group");
    expect(within(panels[1]).getByText("JavaScript")).toBeInTheDocument();

    // Select TS in source
    await user.click(screen.getByText("TypeScript"));
    await user.click(screen.getByLabelText("Move selected items to target"));

    expect(onChange).toHaveBeenCalledWith(["js", "ts"], "right", ["ts"]);

    // Rerender with new targetKeys
    rerender(
      <Transfer
        dataSource={items}
        targetKeys={["js", "ts"]}
        onChange={onChange}
      />
    );
    expect(within(panels[1]).getByText("TypeScript")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Transfer ref={ref} dataSource={items} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Transfer ref={ref} dataSource={items} className="custom-class" />);
    expect(ref.current).toHaveClass("custom-class");
  });

  it("disables the entire component when disabled", () => {
    render(<Transfer dataSource={items} disabled />);
    const moveRight = screen.getByLabelText("Move selected items to target");
    const moveLeft = screen.getByLabelText("Move selected items to source");
    expect(moveRight).toBeDisabled();
    expect(moveLeft).toBeDisabled();
  });

  it("shows item count in panel headers", () => {
    render(<Transfer dataSource={items} defaultTargetKeys={["js"]} />);
    // Source should show 5 items (6 total - 1 in target)
    expect(screen.getByText("5")).toBeInTheDocument();
    // Target should show 1
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("shows 'No items' when a panel is empty", () => {
    render(<Transfer dataSource={[]} />);
    const noItems = screen.getAllByText("No items");
    expect(noItems.length).toBeGreaterThanOrEqual(2);
  });

  it("shows description for items that have one", () => {
    render(<Transfer dataSource={items} />);
    expect(screen.getByText("Dynamic language")).toBeInTheDocument();
  });
});

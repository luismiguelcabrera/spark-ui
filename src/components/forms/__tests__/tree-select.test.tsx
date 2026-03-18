import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TreeSelect, type TreeSelectNode } from "../tree-select";

const treeData: TreeSelectNode[] = [
  {
    label: "Documents",
    value: "docs",
    icon: "folder",
    children: [
      {
        label: "Reports",
        value: "reports",
        icon: "folder",
        children: [
          { label: "Q1 Report.pdf", value: "q1", icon: "description" },
          { label: "Q2 Report.pdf", value: "q2", icon: "description" },
        ],
      },
      { label: "README.md", value: "readme", icon: "description" },
    ],
  },
  {
    label: "Images",
    value: "images",
    icon: "folder",
    children: [
      { label: "photo.png", value: "photo", icon: "image" },
      { label: "logo.svg", value: "logo", icon: "image" },
    ],
  },
  {
    label: "Disabled Folder",
    value: "disabled-folder",
    disabled: true,
    children: [
      { label: "Secret.txt", value: "secret" },
    ],
  },
];

describe("TreeSelect", () => {
  it("renders without error", () => {
    render(<TreeSelect data={treeData} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("shows placeholder text when nothing selected", () => {
    render(<TreeSelect data={treeData} placeholder="Choose a file" />);
    expect(screen.getByText("Choose a file")).toBeInTheDocument();
  });

  it("opens dropdown on click", async () => {
    const user = userEvent.setup();
    render(<TreeSelect data={treeData} />);

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("tree")).toBeInTheDocument();
  });

  it("shows top-level tree nodes when opened", async () => {
    const user = userEvent.setup();
    render(<TreeSelect data={treeData} />);

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByText("Documents")).toBeInTheDocument();
    expect(screen.getByText("Images")).toBeInTheDocument();
  });

  it("expands tree node on click", async () => {
    const user = userEvent.setup();
    render(<TreeSelect data={treeData} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Documents"));
    expect(screen.getByText("Reports")).toBeInTheDocument();
    expect(screen.getByText("README.md")).toBeInTheDocument();
  });

  it("selects a leaf node in single select mode", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TreeSelect data={treeData} onChange={onChange} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Images"));
    await user.click(screen.getByText("photo.png"));

    expect(onChange).toHaveBeenCalledWith("photo");
    // Dropdown should close
    expect(screen.queryByRole("tree")).not.toBeInTheDocument();
  });

  it("shows selected value in trigger", async () => {
    render(<TreeSelect data={treeData} value="photo" />);
    expect(screen.getByText("photo.png")).toBeInTheDocument();
  });

  it("supports defaultValue (uncontrolled)", () => {
    render(<TreeSelect data={treeData} defaultValue="readme" />);
    expect(screen.getByText("README.md")).toBeInTheDocument();
  });

  it("shows path when showPath is true", () => {
    render(<TreeSelect data={treeData} value="q1" showPath />);
    expect(screen.getByText("Documents > Reports > Q1 Report.pdf")).toBeInTheDocument();
  });

  // ── Multiple select ──

  it("supports multiple selection with chips", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TreeSelect data={treeData} multiple onChange={onChange} expandAll />,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("photo.png"));
    expect(onChange).toHaveBeenCalledWith(["photo"]);
  });

  it("shows selected items as chips in multiple mode", () => {
    render(
      <TreeSelect
        data={treeData}
        multiple
        value={["photo", "logo"]}
      />,
    );
    expect(screen.getByText("photo.png")).toBeInTheDocument();
    expect(screen.getByText("logo.svg")).toBeInTheDocument();
  });

  it("removes a chip on close button click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TreeSelect
        data={treeData}
        multiple
        value={["photo", "logo"]}
        onChange={onChange}
      />,
    );

    const removeBtn = screen.getByLabelText("Remove photo.png");
    await user.click(removeBtn);
    expect(onChange).toHaveBeenCalledWith(["logo"]);
  });

  // ── Checkable mode ──

  it("shows checkboxes in checkable mode", async () => {
    const user = userEvent.setup();
    render(<TreeSelect data={treeData} checkable expandAll />);

    await user.click(screen.getByRole("combobox"));
    // Tree items should be visible
    const treeItems = screen.getAllByRole("treeitem");
    expect(treeItems.length).toBeGreaterThan(0);
  });

  it("checks parent and all children in checkable mode", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TreeSelect data={treeData} checkable expandAll onChange={onChange} />,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Images"));

    // Should select images + photo + logo
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect(lastCall[0]).toEqual(expect.arrayContaining(["images", "photo", "logo"]));
  });

  // ── Search ──

  it("filters tree when searchable", async () => {
    const user = userEvent.setup();
    render(<TreeSelect data={treeData} searchable />);

    await user.click(screen.getByRole("combobox"));
    const input = screen.getByLabelText("Search tree");
    await user.type(input, "photo");
    expect(screen.getByText("photo.png")).toBeInTheDocument();
  });

  it("shows no results message when search has no matches", async () => {
    const user = userEvent.setup();
    render(<TreeSelect data={treeData} searchable />);

    await user.click(screen.getByRole("combobox"));
    const input = screen.getByLabelText("Search tree");
    await user.type(input, "zzzzzzz");
    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });

  // ── Disabled ──

  it("disables interaction when disabled", async () => {
    const user = userEvent.setup();
    render(<TreeSelect data={treeData} disabled />);

    const combobox = screen.getByRole("combobox");
    expect(combobox).toHaveAttribute("aria-disabled", "true");
    expect(combobox).toHaveAttribute("tabindex", "-1");

    await user.click(combobox);
    expect(screen.queryByRole("tree")).not.toBeInTheDocument();
  });

  // ── Close on outside click ──

  it("closes on outside click", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <TreeSelect data={treeData} />
        <button type="button">Outside</button>
      </div>,
    );

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("tree")).toBeInTheDocument();

    await user.click(screen.getByText("Outside"));
    expect(screen.queryByRole("tree")).not.toBeInTheDocument();
  });

  // ── Sizes ──

  it.each(["sm", "md", "lg"] as const)("renders %s size", (size) => {
    render(<TreeSelect data={treeData} size={size} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  // ── Expand all ──

  it("expands all nodes when expandAll is true", async () => {
    const user = userEvent.setup();
    render(<TreeSelect data={treeData} expandAll />);

    await user.click(screen.getByRole("combobox"));
    // All leaf nodes should be visible
    expect(screen.getByText("Q1 Report.pdf")).toBeInTheDocument();
    expect(screen.getByText("photo.png")).toBeInTheDocument();
  });

  // ── Accessibility ──

  it("has correct ARIA attributes", () => {
    render(<TreeSelect data={treeData} />);
    const combobox = screen.getByRole("combobox");
    expect(combobox).toHaveAttribute("aria-expanded", "false");
    expect(combobox).toHaveAttribute("aria-haspopup", "tree");
  });

  // ── Keyboard ──

  it("opens on Enter key", async () => {
    const user = userEvent.setup();
    render(<TreeSelect data={treeData} />);

    screen.getByRole("combobox").focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("tree")).toBeInTheDocument();
  });

  it("closes on Escape key", async () => {
    const user = userEvent.setup();
    render(<TreeSelect data={treeData} />);

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("tree")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tree")).not.toBeInTheDocument();
  });

  // ── className + ref ──

  it("merges className", () => {
    render(<TreeSelect data={treeData} className="custom-tree" />);
    const wrapper = screen.getByRole("combobox").parentElement?.parentElement;
    expect(wrapper?.className).toContain("custom-tree");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<TreeSelect ref={ref} data={treeData} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

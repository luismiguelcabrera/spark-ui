import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { DataTable, type Column } from "../data-table";

/* -------------------------------------------------------------------------- */
/*  Shared test data                                                           */
/* -------------------------------------------------------------------------- */

type User = {
  name: string;
  email: string;
  role: string;
  status: string;
};

const users: User[] = [
  { name: "Alice", email: "alice@example.com", role: "Admin", status: "Active" },
  { name: "Bob", email: "bob@example.com", role: "Editor", status: "Inactive" },
  { name: "Charlie", email: "charlie@example.com", role: "Viewer", status: "Active" },
];

const columns: Column<User>[] = [
  { key: "name", header: "Name", render: (r) => r.name },
  { key: "email", header: "Email", render: (r) => r.email },
  { key: "role", header: "Role", render: (r) => r.role },
  { key: "status", header: "Status", render: (r) => r.status },
];

/* -------------------------------------------------------------------------- */
/*  Basic rendering                                                            */
/* -------------------------------------------------------------------------- */

describe("DataTable", () => {
  it("renders column headers", () => {
    render(<DataTable columns={columns} data={users} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders data rows", () => {
    render(<DataTable columns={columns} data={users} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();
    expect(screen.getByText("Viewer")).toBeInTheDocument();
  });

  it("renders empty state when data is empty", () => {
    render(
      <DataTable columns={columns} data={[]} emptyState="No users found." />,
    );
    expect(screen.getByText("No users found.")).toBeInTheDocument();
  });

  it("renders loading skeleton when isLoading is true", () => {
    render(<DataTable columns={columns} data={users} isLoading />);
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <DataTable columns={columns} data={users} className="my-custom-class" />,
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  /* ------------------------------------------------------------------------ */
  /*  Selection                                                                */
  /* ------------------------------------------------------------------------ */

  describe("Selection", () => {
    it("renders checkboxes when selectable", () => {
      render(<DataTable columns={columns} data={users} selectable />);
      // Header checkbox + 3 row checkboxes
      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes.length).toBe(4);
    });

    it("calls onSelectionChange when a row is selected", () => {
      const onSelectionChange = vi.fn();
      render(
        <DataTable
          columns={columns}
          data={users}
          selectable
          onSelectionChange={onSelectionChange}
        />,
      );
      const checkboxes = screen.getAllByRole("checkbox");
      // Click first row checkbox (index 1, since 0 is "select all")
      fireEvent.click(checkboxes[1]);
      expect(onSelectionChange).toHaveBeenCalledWith([0]);
    });

    it("selects all rows when header checkbox is clicked", () => {
      const onSelectionChange = vi.fn();
      render(
        <DataTable
          columns={columns}
          data={users}
          selectable
          onSelectionChange={onSelectionChange}
        />,
      );
      const checkboxes = screen.getAllByRole("checkbox");
      fireEvent.click(checkboxes[0]); // Select all
      expect(onSelectionChange).toHaveBeenCalledWith([0, 1, 2]);
    });
  });

  /* ------------------------------------------------------------------------ */
  /*  Sorting                                                                  */
  /* ------------------------------------------------------------------------ */

  describe("Sorting", () => {
    const sortableColumns: Column<User>[] = [
      { key: "name", header: "Name", render: (r) => r.name, sortable: true },
      { key: "email", header: "Email", render: (r) => r.email },
    ];

    it("renders sort buttons for sortable columns", () => {
      render(<DataTable columns={sortableColumns} data={users} />);
      expect(
        screen.getByRole("button", { name: /sort by name/i }),
      ).toBeInTheDocument();
    });

    it("does not render sort buttons for non-sortable columns", () => {
      render(<DataTable columns={sortableColumns} data={users} />);
      expect(
        screen.queryByRole("button", { name: /sort by email/i }),
      ).not.toBeInTheDocument();
    });

    it("calls onSortChange when sort button is clicked", () => {
      const onSortChange = vi.fn();
      render(
        <DataTable
          columns={sortableColumns}
          data={users}
          sort={null}
          onSortChange={onSortChange}
        />,
      );
      fireEvent.click(
        screen.getByRole("button", { name: /sort by name/i }),
      );
      expect(onSortChange).toHaveBeenCalledWith({
        key: "name",
        direction: "asc",
      });
    });

    it("sorts data with defaultSort", () => {
      render(
        <DataTable
          columns={sortableColumns}
          data={users}
          defaultSort={{ key: "name", direction: "desc" }}
        />,
      );
      // Data should be sorted desc: Charlie, Bob, Alice
      const cells = screen.getAllByText(/^(Alice|Bob|Charlie)$/);
      expect(cells[0]).toHaveTextContent("Charlie");
      expect(cells[1]).toHaveTextContent("Bob");
      expect(cells[2]).toHaveTextContent("Alice");
    });
  });

  /* ------------------------------------------------------------------------ */
  /*  Filtering                                                                */
  /* ------------------------------------------------------------------------ */

  describe("Filtering", () => {
    const filterColumns: Column<User>[] = [
      {
        key: "name",
        header: "Name",
        render: (r) => r.name,
        filterable: "text",
      },
      {
        key: "role",
        header: "Role",
        render: (r) => r.role,
        filterable: "select",
      },
      { key: "email", header: "Email", render: (r) => r.email },
    ];

    it("renders text filter inputs", () => {
      render(<DataTable columns={filterColumns} data={users} />);
      expect(
        screen.getByLabelText("Filter by Name"),
      ).toBeInTheDocument();
    });

    it("renders select filter dropdowns", () => {
      render(<DataTable columns={filterColumns} data={users} />);
      expect(
        screen.getByLabelText("Filter by Role"),
      ).toBeInTheDocument();
    });

    it("filters data when text filter changes", async () => {
      const user = userEvent.setup();
      render(<DataTable columns={filterColumns} data={users} />);
      const input = screen.getByLabelText("Filter by Name");
      await user.type(input, "Alice");
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.queryByText("Bob")).not.toBeInTheDocument();
    });
  });

  /* ------------------------------------------------------------------------ */
  /*  Row Expansion                                                            */
  /* ------------------------------------------------------------------------ */

  describe("Row Expansion", () => {
    const expandable = {
      render: (row: User) => (
        <div data-testid={`detail-${row.name}`}>
          Details for {row.name}: {row.email}
        </div>
      ),
    };

    it("renders expand toggle buttons when expandable is provided", () => {
      render(
        <DataTable columns={columns} data={users} expandable={expandable} />,
      );
      const expandButtons = screen.getAllByRole("button", {
        name: /expand row/i,
      });
      expect(expandButtons.length).toBe(3);
    });

    it("expand buttons have aria-expanded=false initially", () => {
      render(
        <DataTable columns={columns} data={users} expandable={expandable} />,
      );
      const expandButtons = screen.getAllByRole("button", {
        name: /expand row/i,
      });
      expandButtons.forEach((btn) => {
        expect(btn).toHaveAttribute("aria-expanded", "false");
      });
    });

    it("does not show detail content initially", () => {
      render(
        <DataTable columns={columns} data={users} expandable={expandable} />,
      );
      expect(screen.queryByTestId("detail-Alice")).not.toBeInTheDocument();
    });

    it("shows detail content when expand button is clicked", () => {
      render(
        <DataTable columns={columns} data={users} expandable={expandable} />,
      );
      const expandButtons = screen.getAllByRole("button", {
        name: /expand row/i,
      });
      fireEvent.click(expandButtons[0]);
      expect(screen.getByTestId("detail-Alice")).toBeInTheDocument();
      expect(screen.getByText("Details for Alice: alice@example.com")).toBeInTheDocument();
    });

    it("sets aria-expanded=true on expanded row", () => {
      render(
        <DataTable columns={columns} data={users} expandable={expandable} />,
      );
      const expandButtons = screen.getAllByRole("button", {
        name: /expand row/i,
      });
      fireEvent.click(expandButtons[0]);
      // First button should now say "Collapse row"
      const collapseButton = screen.getByRole("button", {
        name: /collapse row/i,
      });
      expect(collapseButton).toHaveAttribute("aria-expanded", "true");
    });

    it("collapses row when toggle is clicked again", () => {
      render(
        <DataTable columns={columns} data={users} expandable={expandable} />,
      );
      const expandButtons = screen.getAllByRole("button", {
        name: /expand row/i,
      });
      fireEvent.click(expandButtons[0]);
      expect(screen.getByTestId("detail-Alice")).toBeInTheDocument();

      const collapseButton = screen.getByRole("button", {
        name: /collapse row/i,
      });
      fireEvent.click(collapseButton);
      expect(screen.queryByTestId("detail-Alice")).not.toBeInTheDocument();
    });

    it("can expand multiple rows simultaneously", () => {
      render(
        <DataTable columns={columns} data={users} expandable={expandable} />,
      );
      const expandButtons = screen.getAllByRole("button", {
        name: /expand row/i,
      });
      fireEvent.click(expandButtons[0]);
      fireEvent.click(expandButtons[1]);
      expect(screen.getByTestId("detail-Alice")).toBeInTheDocument();
      expect(screen.getByTestId("detail-Bob")).toBeInTheDocument();
    });

    it("supports controlled expandedRows", () => {
      const onExpandChange = vi.fn();
      const { rerender } = render(
        <DataTable
          columns={columns}
          data={users}
          expandable={expandable}
          expandedRows={[]}
          onExpandChange={onExpandChange}
        />,
      );
      const expandButtons = screen.getAllByRole("button", {
        name: /expand row/i,
      });
      fireEvent.click(expandButtons[0]);
      expect(onExpandChange).toHaveBeenCalledWith([0]);

      // With controlled state set to [0], detail should show
      rerender(
        <DataTable
          columns={columns}
          data={users}
          expandable={expandable}
          expandedRows={[0]}
          onExpandChange={onExpandChange}
        />,
      );
      expect(screen.getByTestId("detail-Alice")).toBeInTheDocument();
    });

    it("supports defaultExpandedRows", () => {
      render(
        <DataTable
          columns={columns}
          data={users}
          expandable={expandable}
          defaultExpandedRows={[1]}
        />,
      );
      expect(screen.getByTestId("detail-Bob")).toBeInTheDocument();
      expect(screen.queryByTestId("detail-Alice")).not.toBeInTheDocument();
    });
  });

  /* ------------------------------------------------------------------------ */
  /*  Cell Editing                                                             */
  /* ------------------------------------------------------------------------ */

  describe("Cell Editing", () => {
    const editableColumns: Column<User>[] = [
      { key: "name", header: "Name", render: (r) => r.name, editable: true },
      { key: "email", header: "Email", render: (r) => r.email, editable: true },
      { key: "role", header: "Role", render: (r) => r.role },
    ];

    it("marks editable cells with data-editable attribute", () => {
      const { container } = render(
        <DataTable columns={editableColumns} data={users} />,
      );
      const editableCells = container.querySelectorAll("[data-editable]");
      // 3 rows x 2 editable columns = 6
      expect(editableCells.length).toBe(6);
    });

    it("enters edit mode on double-click", () => {
      render(<DataTable columns={editableColumns} data={users} />);
      const aliceCell = screen.getByText("Alice");
      fireEvent.doubleClick(aliceCell.closest("[data-editable]")!);
      expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
    });

    it("does not enter edit mode on non-editable cells", () => {
      render(<DataTable columns={editableColumns} data={users} />);
      const roleCell = screen.getByText("Admin");
      fireEvent.doubleClick(roleCell);
      // Should not show an input
      expect(screen.queryByDisplayValue("Admin")).not.toBeInTheDocument();
    });

    it("saves value on Enter key", async () => {
      const onCellEdit = vi.fn();
      render(
        <DataTable
          columns={editableColumns}
          data={users}
          onCellEdit={onCellEdit}
        />,
      );

      // Double-click to enter edit mode
      const aliceCell = screen.getByText("Alice");
      fireEvent.doubleClick(aliceCell.closest("[data-editable]")!);

      const input = screen.getByDisplayValue("Alice");
      fireEvent.change(input, { target: { value: "Alice Updated" } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(onCellEdit).toHaveBeenCalledWith(0, "name", "Alice Updated");
    });

    it("cancels editing on Escape key", () => {
      const onCellEdit = vi.fn();
      render(
        <DataTable
          columns={editableColumns}
          data={users}
          onCellEdit={onCellEdit}
        />,
      );

      const aliceCell = screen.getByText("Alice");
      fireEvent.doubleClick(aliceCell.closest("[data-editable]")!);

      const input = screen.getByDisplayValue("Alice");
      fireEvent.change(input, { target: { value: "Changed" } });
      fireEvent.keyDown(input, { key: "Escape" });

      expect(onCellEdit).not.toHaveBeenCalled();
      // Should be back to normal display
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    it("shows edit input with correct initial value", () => {
      render(<DataTable columns={editableColumns} data={users} />);

      const bobEmail = screen.getByText("bob@example.com");
      fireEvent.doubleClick(bobEmail.closest("[data-editable]")!);

      expect(screen.getByDisplayValue("bob@example.com")).toBeInTheDocument();
    });

    it("supports custom editRender", () => {
      const customColumns: Column<User>[] = [
        {
          key: "name",
          header: "Name",
          render: (r) => r.name,
          editable: true,
          editRender: (value, _row, onChange) => (
            <select
              data-testid="custom-edit"
              value={String(value)}
              onChange={(e) => onChange(e.target.value)}
            >
              <option value="Alice">Alice</option>
              <option value="Bob">Bob</option>
            </select>
          ),
        },
        { key: "email", header: "Email", render: (r) => r.email },
      ];

      render(<DataTable columns={customColumns} data={users} />);
      const aliceCell = screen.getByText("Alice");
      fireEvent.doubleClick(aliceCell.closest("[data-editable]")!);
      expect(screen.getByTestId("custom-edit")).toBeInTheDocument();
    });
  });

  /* ------------------------------------------------------------------------ */
  /*  Column Resize                                                            */
  /* ------------------------------------------------------------------------ */

  describe("Column Resize", () => {
    it("renders resize handles when resizable is true", () => {
      render(
        <DataTable columns={columns} data={users} resizable />,
      );
      const handles = screen.getAllByRole("separator");
      // Resize handles appear between columns, so columns.length - 1
      expect(handles.length).toBe(columns.length - 1);
    });

    it("does not render resize handles when resizable is false", () => {
      render(<DataTable columns={columns} data={users} />);
      expect(screen.queryByRole("separator")).not.toBeInTheDocument();
    });

    it("resize handles have correct cursor style", () => {
      render(
        <DataTable columns={columns} data={users} resizable />,
      );
      const handles = screen.getAllByRole("separator");
      handles.forEach((handle) => {
        expect(handle.className).toContain("cursor-col-resize");
      });
    });

    it("resize handles have vertical aria-orientation", () => {
      render(
        <DataTable columns={columns} data={users} resizable />,
      );
      const handles = screen.getAllByRole("separator");
      handles.forEach((handle) => {
        expect(handle).toHaveAttribute("aria-orientation", "vertical");
      });
    });
  });

  /* ------------------------------------------------------------------------ */
  /*  Combined features                                                        */
  /* ------------------------------------------------------------------------ */

  describe("Combined features", () => {
    it("works with expandable + selectable together", () => {
      const expandable = {
        render: (row: User) => <div>Detail: {row.name}</div>,
      };
      render(
        <DataTable
          columns={columns}
          data={users}
          selectable
          expandable={expandable}
        />,
      );
      // Should have checkboxes and expand buttons
      expect(screen.getAllByRole("checkbox").length).toBe(4);
      expect(
        screen.getAllByRole("button", { name: /expand row/i }).length,
      ).toBe(3);
    });

    it("works with expandable + resizable together", () => {
      const expandable = {
        render: (row: User) => <div>Detail: {row.name}</div>,
      };
      render(
        <DataTable
          columns={columns}
          data={users}
          expandable={expandable}
          resizable
        />,
      );
      expect(
        screen.getAllByRole("button", { name: /expand row/i }).length,
      ).toBe(3);
      expect(screen.getAllByRole("separator").length).toBe(
        columns.length - 1,
      );
    });

    it("editable cells work alongside expandable rows", () => {
      const editableColumns: Column<User>[] = [
        { key: "name", header: "Name", render: (r) => r.name, editable: true },
        { key: "email", header: "Email", render: (r) => r.email },
      ];
      const expandable = {
        render: (row: User) => (
          <div data-testid={`detail-${row.name}`}>Detail: {row.name}</div>
        ),
      };
      const onCellEdit = vi.fn();

      render(
        <DataTable
          columns={editableColumns}
          data={users}
          expandable={expandable}
          onCellEdit={onCellEdit}
        />,
      );

      // Expand first row
      const expandButtons = screen.getAllByRole("button", {
        name: /expand row/i,
      });
      fireEvent.click(expandButtons[0]);
      expect(screen.getByTestId("detail-Alice")).toBeInTheDocument();

      // Double-click to edit
      const aliceCell = screen.getByText("Alice");
      fireEvent.doubleClick(aliceCell.closest("[data-editable]")!);
      const input = screen.getByDisplayValue("Alice");
      fireEvent.change(input, { target: { value: "Alice 2" } });
      fireEvent.keyDown(input, { key: "Enter" });
      expect(onCellEdit).toHaveBeenCalledWith(0, "name", "Alice 2");
    });
  });

  /* ------------------------------------------------------------------------ */
  /*  Pagination                                                               */
  /* ------------------------------------------------------------------------ */

  describe("Pagination", () => {
    it("does not render pagination when total <= pageSize", () => {
      render(
        <DataTable
          columns={columns}
          data={users}
          pagination={{ current: 1, total: 3, pageSize: 10 }}
        />,
      );
      expect(screen.queryByText("Previous")).not.toBeInTheDocument();
    });

    it("renders pagination when total > pageSize", () => {
      render(
        <DataTable
          columns={columns}
          data={users}
          pagination={{ current: 1, total: 30, pageSize: 10 }}
        />,
      );
      expect(screen.getByText("Previous")).toBeInTheDocument();
      expect(screen.getByText("Next")).toBeInTheDocument();
    });
  });
});

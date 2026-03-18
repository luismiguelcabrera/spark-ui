import { render, screen, fireEvent } from "@testing-library/react";
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

  it("renders table role", () => {
    render(<DataTable columns={columns} data={users} />);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("renders row roles", () => {
    render(<DataTable columns={columns} data={users} />);
    // 1 header row + 3 data rows = 4
    expect(screen.getAllByRole("row").length).toBe(4);
  });

  it("renders columnheader roles", () => {
    render(<DataTable columns={columns} data={users} />);
    const headers = screen.getAllByRole("columnheader");
    expect(headers.length).toBe(4);
  });

  it("renders cell roles", () => {
    render(<DataTable columns={columns} data={users} />);
    // 3 rows x 4 columns = 12 cells
    const cells = screen.getAllByRole("cell");
    expect(cells.length).toBe(12);
  });

  it("renders header slot", () => {
    render(
      <DataTable
        columns={columns}
        data={users}
        header={<div>Filter Bar</div>}
      />,
    );
    expect(screen.getByText("Filter Bar")).toBeInTheDocument();
  });

  it("renders custom skeleton when isLoading", () => {
    render(
      <DataTable
        columns={columns}
        data={users}
        isLoading
        skeleton={<div>Custom Loading...</div>}
      />,
    );
    expect(screen.getByText("Custom Loading...")).toBeInTheDocument();
  });

  it("renders mobile cards when mobileCard is provided", () => {
    render(
      <DataTable
        columns={columns}
        data={users}
        mobileCard={(row) => <div>Mobile: {row.name}</div>}
      />,
    );
    expect(screen.getByText("Mobile: Alice")).toBeInTheDocument();
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

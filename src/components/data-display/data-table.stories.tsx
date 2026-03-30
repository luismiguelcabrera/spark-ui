import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, type Column, type SortState } from "./data-table";
import { Badge } from "./badge";

/* -------------------------------------------------------------------------- */
/*  Shared data                                                                */
/* -------------------------------------------------------------------------- */

type Employee = {
  name: string;
  email: string;
  role: string;
  department: string;
  salary: number;
  status: "active" | "away" | "offline";
};

const employees: Employee[] = [
  { name: "Alice Johnson", email: "alice@acme.com", role: "Engineer", department: "Product", salary: 120000, status: "active" },
  { name: "Bob Smith", email: "bob@acme.com", role: "Designer", department: "Design", salary: 95000, status: "away" },
  { name: "Charlie Brown", email: "charlie@acme.com", role: "Manager", department: "Product", salary: 140000, status: "active" },
  { name: "Diana Prince", email: "diana@acme.com", role: "Engineer", department: "Platform", salary: 130000, status: "offline" },
  { name: "Eve Wilson", email: "eve@acme.com", role: "Analyst", department: "Data", salary: 85000, status: "active" },
  { name: "Frank Castle", email: "frank@acme.com", role: "Engineer", department: "Platform", salary: 115000, status: "away" },
  { name: "Grace Hopper", email: "grace@acme.com", role: "Lead", department: "Product", salary: 160000, status: "active" },
];

const statusBadge = (status: Employee["status"]) => (
  <Badge
    variant={
      status === "active" ? "success" : status === "away" ? "warning" : "default"
    }
  >
    {status}
  </Badge>
);

const baseColumns: Column<Employee>[] = [
  { key: "name", header: "Name", render: (r) => r.name, sortable: true },
  { key: "email", header: "Email", render: (r) => r.email },
  { key: "role", header: "Role", render: (r) => r.role, sortable: true },
  { key: "department", header: "Department", render: (r) => r.department, sortable: true },
  {
    key: "salary",
    header: "Salary",
    render: (r) => `$${r.salary.toLocaleString()}`,
    sortable: true,
    sortFn: (a, b) => a.salary - b.salary,
  },
  {
    key: "status",
    header: "Status",
    render: (r) => statusBadge(r.status),
  },
];

/* -------------------------------------------------------------------------- */
/*  Meta                                                                       */
/* -------------------------------------------------------------------------- */

const meta = {
  title: "Data Display/DataTable",
  component: DataTable,
  tags: ["autodocs"],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/*  Stories                                                                     */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
  render: () => <DataTable columns={baseColumns} data={employees} />,
};

export const WithSorting: Story = {
  render: () => {
    const [sort, setSort] = useState<SortState | null>(null);
    return (
      <DataTable
        columns={baseColumns}
        data={employees}
        sort={sort}
        onSortChange={setSort}
      />
    );
  },
};

export const WithRowExpansion: Story = {
  render: () => (
    <DataTable
      columns={baseColumns}
      data={employees}
      expandable={{
        render: (row) => (
          <div className="flex flex-col gap-2 py-2">
            <p className="text-sm font-medium text-navy-text">
              Employee Details
            </p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Email:</span>{" "}
                <span className="text-navy-text">{row.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Department:</span>{" "}
                <span className="text-navy-text">{row.department}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Annual Salary:</span>{" "}
                <span className="text-navy-text font-semibold">
                  ${row.salary.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ),
      }}
    />
  ),
};

export const WithCellEditing: Story = {
  render: () => {
    const [data, setData] = useState(employees);

    const editableColumns: Column<Employee>[] = [
      { key: "name", header: "Name", render: (r) => r.name, editable: true, sortable: true },
      { key: "email", header: "Email", render: (r) => r.email, editable: true },
      { key: "role", header: "Role", render: (r) => r.role, editable: true },
      { key: "department", header: "Department", render: (r) => r.department },
      {
        key: "salary",
        header: "Salary",
        render: (r) => `$${r.salary.toLocaleString()}`,
      },
      {
        key: "status",
        header: "Status",
        render: (r) => statusBadge(r.status),
      },
    ];

    return (
      <div className="flex flex-col gap-3">
        <p className="text-xs text-muted-foreground">
          Double-click editable cells (Name, Email, Role) to edit. Enter to
          save, Escape to cancel.
        </p>
        <DataTable
          columns={editableColumns}
          data={data}
          onCellEdit={(rowIndex, columnKey, newValue) => {
            setData((prev) =>
              prev.map((row, i) =>
                i === rowIndex ? { ...row, [columnKey]: newValue } : row,
              ),
            );
          }}
        />
      </div>
    );
  },
};

export const WithColumnResize: Story = {
  render: () => (
    <DataTable
      columns={baseColumns}
      data={employees}
      resizable
    />
  ),
};

export const AllFeatures: Story = {
  name: "All Features Combined",
  render: () => {
    const [data, setData] = useState(employees);
    const [sort, setSort] = useState<SortState | null>(null);

    const allColumns: Column<Employee>[] = [
      {
        key: "name",
        header: "Name",
        render: (r) => r.name,
        editable: true,
        sortable: true,
        filterable: "text",
      },
      {
        key: "email",
        header: "Email",
        render: (r) => r.email,
        editable: true,
      },
      {
        key: "role",
        header: "Role",
        render: (r) => r.role,
        sortable: true,
        filterable: "select",
      },
      {
        key: "department",
        header: "Department",
        render: (r) => r.department,
        filterable: "select",
      },
      {
        key: "salary",
        header: "Salary",
        render: (r) => `$${r.salary.toLocaleString()}`,
        sortable: true,
        sortFn: (a, b) => a.salary - b.salary,
      },
      {
        key: "status",
        header: "Status",
        render: (r) => statusBadge(r.status),
        filterable: "select",
      },
    ];

    return (
      <div className="flex flex-col gap-3">
        <p className="text-xs text-muted-foreground">
          Expandable rows, inline editing (Name, Email), sorting, filtering,
          selection, and resizable columns.
        </p>
        <DataTable
          columns={allColumns}
          data={data}
          selectable
          resizable
          sort={sort}
          onSortChange={setSort}
          expandable={{
            render: (row) => (
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <p>
                  <strong>{row.name}</strong> works in the {row.department}{" "}
                  department as a {row.role}.
                </p>
                <p>Contact: {row.email}</p>
              </div>
            ),
          }}
          onCellEdit={(rowIndex, columnKey, newValue) => {
            setData((prev) =>
              prev.map((row, i) =>
                i === rowIndex ? { ...row, [columnKey]: newValue } : row,
              ),
            );
          }}
          emptyState="No employees match the current filters."
        />
      </div>
    );
  },
};

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, type Column, type SortState } from "./data-table";
import { Badge } from "./badge";

type Employee = {
  name: string;
  role: string;
  department: string;
  salary: number;
  status: "active" | "away" | "offline";
};

const employees: Employee[] = [
  { name: "Alice Johnson", role: "Engineer", department: "Product", salary: 120000, status: "active" },
  { name: "Bob Smith", role: "Designer", department: "Design", salary: 95000, status: "away" },
  { name: "Charlie Brown", role: "Manager", department: "Product", salary: 140000, status: "active" },
  { name: "Diana Prince", role: "Engineer", department: "Platform", salary: 130000, status: "offline" },
  { name: "Eve Wilson", role: "Analyst", department: "Data", salary: 85000, status: "active" },
  { name: "Frank Castle", role: "Engineer", department: "Platform", salary: 115000, status: "away" },
  { name: "Grace Hopper", role: "Lead", department: "Product", salary: 160000, status: "active" },
];

const columns: Column<Employee>[] = [
  { key: "name", header: "Name", render: (r) => r.name, sortable: true },
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
    render: (r) => (
      <Badge
        variant={
          r.status === "active" ? "success" : r.status === "away" ? "warning" : "secondary"
        }
      >
        {r.status}
      </Badge>
    ),
  },
];

const meta = {
  title: "Data Display/DataTable",
  component: DataTable,
  tags: ["autodocs"],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <DataTable columns={columns} data={employees} />,
};

export const WithSorting: Story = {
  render: () => {
    const [sort, setSort] = useState<SortState | null>(null);
    return (
      <div className="flex flex-col gap-3">
        <DataTable
          columns={columns}
          data={employees}
          sort={sort}
          onSortChange={setSort}
        />
        <p className="text-xs text-slate-400">
          Sort: {sort ? `${sort.key} ${sort.direction}` : "none"}
        </p>
      </div>
    );
  },
};

export const DefaultSorted: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={employees}
      defaultSort={{ key: "salary", direction: "desc" }}
    />
  ),
};

export const SortableWithSelection: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={employees}
      selectable
      defaultSort={{ key: "name", direction: "asc" }}
    />
  ),
};

export const MixedSortable: Story = {
  name: "Mixed: Some Columns Sortable",
  render: () => {
    const mixedCols: Column<Employee>[] = [
      { key: "name", header: "Name", render: (r) => r.name, sortable: true },
      { key: "role", header: "Role", render: (r) => r.role },
      { key: "department", header: "Dept", render: (r) => r.department },
      {
        key: "salary",
        header: "Salary",
        render: (r) => `$${r.salary.toLocaleString()}`,
        sortable: true,
        sortFn: (a, b) => a.salary - b.salary,
      },
    ];
    return <DataTable columns={mixedCols} data={employees} />;
  },
};

export const EmptyWithSort: Story = {
  render: () => <DataTable columns={columns} data={[]} emptyState="No employees found." />,
};

const filterColumns: Column<Employee>[] = [
  { key: "name", header: "Name", render: (r) => r.name, sortable: true, filterable: "text" },
  { key: "role", header: "Role", render: (r) => r.role, filterable: "select" },
  { key: "department", header: "Department", render: (r) => r.department, filterable: "select" },
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
    render: (r) => (
      <Badge
        variant={
          r.status === "active" ? "success" : r.status === "away" ? "warning" : "secondary"
        }
      >
        {r.status}
      </Badge>
    ),
    filterable: "select",
  },
];

export const WithFiltering: Story = {
  render: () => (
    <DataTable
      columns={filterColumns}
      data={employees}
      emptyState="No matches found."
    />
  ),
};

export const FilterAndSort: Story = {
  name: "Filtering + Sorting",
  render: () => {
    const [sort, setSort] = useState<SortState | null>(null);
    return (
      <DataTable
        columns={filterColumns}
        data={employees}
        sort={sort}
        onSortChange={setSort}
        emptyState="No matches."
      />
    );
  },
};

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { DataTable, type Column } from "../data-table";

type Person = { name: string; age: number; city: string };

const people: Person[] = [
  { name: "Charlie", age: 30, city: "NYC" },
  { name: "Alice", age: 25, city: "LA" },
  { name: "Bob", age: 35, city: "Chicago" },
];

const columns: Column<Person>[] = [
  { key: "name", header: "Name", render: (r) => r.name, sortable: true },
  {
    key: "age",
    header: "Age",
    render: (r) => String(r.age),
    sortable: true,
    sortFn: (a, b) => a.age - b.age,
  },
  { key: "city", header: "City", render: (r) => r.city },
];

describe("DataTable (basic)", () => {
  it("renders all rows", () => {
    render(<DataTable columns={columns} data={people} />);
    expect(screen.getByText("Charlie")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("renders column headers", () => {
    render(<DataTable columns={columns} data={people} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("City")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(
      <DataTable columns={columns} data={[]} emptyState="No data" />,
    );
    expect(screen.getByText("No data")).toBeInTheDocument();
  });
});

describe("DataTable (sorting)", () => {
  it("shows sort buttons only for sortable columns", () => {
    render(<DataTable columns={columns} data={people} />);
    // Name and Age are sortable — rendered as buttons
    const nameBtn = screen.getByRole("button", { name: /Name/ });
    expect(nameBtn).toBeInTheDocument();
    const ageBtn = screen.getByRole("button", { name: /Age/ });
    expect(ageBtn).toBeInTheDocument();
    // City is NOT sortable — no button
    expect(screen.queryByRole("button", { name: /City/ })).not.toBeInTheDocument();
  });

  it("sortable header has data-sort='none' initially", () => {
    const { container } = render(<DataTable columns={columns} data={people} />);
    const nameCol = container.querySelector('[data-sort]');
    expect(nameCol).toHaveAttribute("data-sort", "none");
  });

  it("clicking a sortable header sorts ascending", async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(
      <DataTable columns={columns} data={people} onSortChange={onSort} />,
    );
    await user.click(screen.getByRole("button", { name: /Name/ }));
    expect(onSort).toHaveBeenCalledWith({ key: "name", direction: "asc" });
  });

  it("clicking again sorts descending", async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={people}
        defaultSort={{ key: "name", direction: "asc" }}
        onSortChange={onSort}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Name/ }));
    expect(onSort).toHaveBeenCalledWith({ key: "name", direction: "desc" });
  });

  it("clicking a third time clears sort", async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={people}
        defaultSort={{ key: "name", direction: "desc" }}
        onSortChange={onSort}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Name/ }));
    expect(onSort).toHaveBeenCalledWith(null);
  });

  it("sorts data ascending by string column (uncontrolled)", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={people} />);
    await user.click(screen.getByRole("button", { name: /Name/ }));
    // After sorting by Name asc: Alice, Bob, Charlie
    const sortBtn = screen.getByRole("button", { name: /Sort by Name/ });
    expect(sortBtn).toHaveAttribute("aria-label", "Sort by Name, currently ascending");
    // Verify names appear in sorted order in the document
    const names = screen.getAllByText(/^(Alice|Bob|Charlie)$/);
    expect(names[0]).toHaveTextContent("Alice");
    expect(names[1]).toHaveTextContent("Bob");
    expect(names[2]).toHaveTextContent("Charlie");
  });

  it("sorts data using custom sortFn (numeric)", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={people} />);
    await user.click(screen.getByRole("button", { name: /Age/ }));
    // Sorted by age asc: Alice(25), Charlie(30), Bob(35)
    const sortBtn = screen.getByRole("button", { name: /Sort by Age/ });
    expect(sortBtn).toHaveAttribute("aria-label", "Sort by Age, currently ascending");
    const ages = screen.getAllByText(/^(25|30|35)$/);
    expect(ages[0]).toHaveTextContent("25");
    expect(ages[1]).toHaveTextContent("30");
    expect(ages[2]).toHaveTextContent("35");
  });

  it("controlled sort shows correct aria-label", () => {
    render(
      <DataTable
        columns={columns}
        data={people}
        sort={{ key: "age", direction: "desc" }}
      />,
    );
    const ageBtn = screen.getByRole("button", { name: /Sort by Age/ });
    expect(ageBtn).toHaveAttribute("aria-label", "Sort by Age, currently descending");
    // Name should still show 'none'
    const nameBtn = screen.getByRole("button", { name: /Sort by Name/ });
    expect(nameBtn).toHaveAttribute("aria-label", "Sort by Name, currently none");
  });

  it("clicking a different column changes sort column", async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={people}
        defaultSort={{ key: "name", direction: "asc" }}
        onSortChange={onSort}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Age/ }));
    expect(onSort).toHaveBeenCalledWith({ key: "age", direction: "asc" });
  });

  it("does not sort when column is not sortable", () => {
    render(
      <DataTable
        columns={columns}
        data={people}
        defaultSort={{ key: "city", direction: "asc" }}
      />,
    );
    // Data should remain in original order since city is not sortable
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Filtering
// ---------------------------------------------------------------------------

const filterColumns: Column<Person>[] = [
  { key: "name", header: "Name", render: (r) => r.name, filterable: "text" },
  { key: "city", header: "City", render: (r) => r.city, filterable: "select" },
  { key: "age", header: "Age", render: (r) => String(r.age) },
];

describe("DataTable (filtering)", () => {
  it("renders filter inputs for text-filterable columns", () => {
    render(<DataTable columns={filterColumns} data={people} />);
    expect(screen.getByLabelText("Filter by Name")).toBeInTheDocument();
  });

  it("renders filter selects for select-filterable columns", () => {
    render(<DataTable columns={filterColumns} data={people} />);
    expect(screen.getByLabelText("Filter by City")).toBeInTheDocument();
  });

  it("does not render filter for non-filterable columns", () => {
    render(<DataTable columns={filterColumns} data={people} />);
    expect(screen.queryByLabelText("Filter by Age")).not.toBeInTheDocument();
  });

  it("filters rows by text input", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={filterColumns} data={people} />);
    await user.type(screen.getByLabelText("Filter by Name"), "Ali");
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Charlie")).not.toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });

  it("filters rows by select dropdown", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={filterColumns} data={people} />);
    await user.selectOptions(screen.getByLabelText("Filter by City"), "NYC");
    expect(screen.getByText("Charlie")).toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });

  it("select filter shows unique values from data", () => {
    render(<DataTable columns={filterColumns} data={people} />);
    const select = screen.getByLabelText("Filter by City") as HTMLSelectElement;
    const options = Array.from(select.options).map((o) => o.value);
    expect(options).toContain("");  // "All" option
    expect(options).toContain("NYC");
    expect(options).toContain("LA");
    expect(options).toContain("Chicago");
  });

  it("calls onFilterChange when typing", async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    render(
      <DataTable
        columns={filterColumns}
        data={people}
        onFilterChange={onFilterChange}
      />,
    );
    await user.type(screen.getByLabelText("Filter by Name"), "B");
    expect(onFilterChange).toHaveBeenCalledWith({ name: "B" });
  });

  it("controlled filters work", () => {
    render(
      <DataTable
        columns={filterColumns}
        data={people}
        filters={{ name: "Bob" }}
      />,
    );
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    expect(screen.queryByText("Charlie")).not.toBeInTheDocument();
  });

  it("shows empty state when filter matches nothing", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        columns={filterColumns}
        data={people}
        emptyState="No results"
      />,
    );
    await user.type(screen.getByLabelText("Filter by Name"), "zzzzz");
    expect(screen.getByText("No results")).toBeInTheDocument();
  });

  it("supports custom filterFn", async () => {
    const user = userEvent.setup();
    const customCols: Column<Person>[] = [
      {
        key: "age",
        header: "Age",
        render: (r) => String(r.age),
        filterable: "text",
        filterFn: (row, value) => row.age >= Number(value),
      },
      { key: "name", header: "Name", render: (r) => r.name },
    ];
    render(<DataTable columns={customCols} data={people} />);
    await user.type(screen.getByLabelText("Filter by Age"), "30");
    // Alice (25) should be filtered out
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument(); // 30
    expect(screen.getByText("Bob")).toBeInTheDocument(); // 35
  });

  it("filter + sort work together", async () => {
    const user = userEvent.setup();
    const bothCols: Column<Person>[] = [
      { key: "name", header: "Name", render: (r) => r.name, sortable: true, filterable: "text" },
      { key: "age", header: "Age", render: (r) => String(r.age) },
      { key: "city", header: "City", render: (r) => r.city },
    ];
    render(<DataTable columns={bothCols} data={people} />);
    // Filter to just Charlie and Bob (contain "b" or "c" — use "l" for Alice/Charlie)
    await user.type(screen.getByLabelText("Filter by Name"), "li");
    // Only Alice and Charlie match "li"
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });
});

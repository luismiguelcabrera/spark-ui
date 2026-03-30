import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataIterator, type DataIteratorProps } from "./data-iterator";

type Person = { name: string; age: number; department: string };

const people: Person[] = [
  { name: "Alice", age: 25, department: "Engineering" },
  { name: "Bob", age: 35, department: "Design" },
  { name: "Charlie", age: 30, department: "Engineering" },
  { name: "Diana", age: 28, department: "Marketing" },
  { name: "Eve", age: 22, department: "Design" },
  { name: "Frank", age: 40, department: "Engineering" },
  { name: "Grace", age: 33, department: "Marketing" },
  { name: "Hank", age: 27, department: "Design" },
];

const meta = {
  title: "Data Display/DataIterator",
  component: DataIterator,
  tags: ["autodocs"],
  argTypes: {
    pageSize: { control: { type: "number", min: 0, max: 10, step: 1 } },
  },
} satisfies Meta<typeof DataIterator>;

export default meta;

// Use a manually typed story since DataIterator is generic
type Story = StoryObj<{ items: Person[]; pageSize?: number; sortBy?: string; sortDirection?: "asc" | "desc"; filterFn?: (item: Person) => boolean; children: (props: unknown) => React.ReactNode }>;

export const Default: Story = {
  render: () => (
    <DataIterator<Person> items={people}>
      {({ items }) => (
        <ul className="space-y-1">
          {items.map((p) => (
            <li key={p.name} className="text-sm text-slate-700">
              {p.name} ({p.age}) — {p.department}
            </li>
          ))}
        </ul>
      )}
    </DataIterator>
  ),
};

export const WithSorting: Story = {
  render: () => (
    <DataIterator<Person> items={people} sortBy="age">
      {({ items, sortBy, sortDirection, setSortBy }) => (
        <div className="space-y-3">
          <div className="flex gap-2">
            {["name", "age", "department"].map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSortBy(key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  sortBy === key
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {key} {sortBy === key ? (sortDirection === "asc" ? "\u2191" : "\u2193") : ""}
              </button>
            ))}
          </div>
          <ul className="space-y-1">
            {items.map((p) => (
              <li key={p.name} className="text-sm text-slate-700">
                {p.name} ({p.age}) — {p.department}
              </li>
            ))}
          </ul>
        </div>
      )}
    </DataIterator>
  ),
};

export const WithPagination: Story = {
  render: () => (
    <DataIterator<Person> items={people} pageSize={3}>
      {({ items, page, pageCount, prevPage, nextPage, isFirst, isLast }) => (
        <div className="space-y-3">
          <ul className="space-y-1">
            {items.map((p) => (
              <li key={p.name} className="text-sm text-slate-700">
                {p.name} ({p.age}) — {p.department}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3 text-sm">
            <button
              type="button"
              onClick={prevPage}
              disabled={isFirst}
              className="px-3 py-1 border rounded-lg disabled:opacity-50 text-xs"
            >
              Prev
            </button>
            <span className="text-slate-500">
              Page {page} of {pageCount}
            </span>
            <button
              type="button"
              onClick={nextPage}
              disabled={isLast}
              className="px-3 py-1 border rounded-lg disabled:opacity-50 text-xs"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </DataIterator>
  ),
};

export const WithFilter: Story = {
  render: () => (
    <DataIterator<Person>
      items={people}
      filterFn={(p) => p.department === "Engineering"}
    >
      {({ items, totalItems }) => (
        <div className="space-y-2">
          <p className="text-xs text-slate-400">
            Showing {items.length} of {totalItems} (Engineering only)
          </p>
          <ul className="space-y-1">
            {items.map((p) => (
              <li key={p.name} className="text-sm text-slate-700">
                {p.name} ({p.age})
              </li>
            ))}
          </ul>
        </div>
      )}
    </DataIterator>
  ),
};

export const CombinedExample: Story = {
  render: () => (
    <DataIterator<Person>
      items={people}
      sortBy="name"
      filterFn={(p) => p.age >= 25}
      pageSize={3}
    >
      {({
        items,
        page,
        pageCount,
        prevPage,
        nextPage,
        isFirst,
        isLast,
        totalItems,
        sortBy,
        sortDirection,
        setSortBy,
      }) => (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            {totalItems} results (age &ge; 25), sorted by {sortBy} ({sortDirection})
          </p>
          <div className="flex gap-2">
            {["name", "age"].map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSortBy(key)}
                className={`px-3 py-1 text-xs font-medium rounded-lg border ${
                  sortBy === key
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-white border-slate-200 text-slate-600"
                }`}
              >
                Sort by {key}
              </button>
            ))}
          </div>
          <ul className="space-y-1">
            {items.map((p) => (
              <li key={p.name} className="text-sm">
                {p.name} ({p.age}) — {p.department}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3 text-sm">
            <button
              type="button"
              onClick={prevPage}
              disabled={isFirst}
              className="px-3 py-1 border rounded-lg disabled:opacity-50 text-xs"
            >
              Prev
            </button>
            <span className="text-slate-500">
              {page}/{pageCount}
            </span>
            <button
              type="button"
              onClick={nextPage}
              disabled={isLast}
              className="px-3 py-1 border rounded-lg disabled:opacity-50 text-xs"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </DataIterator>
  ),
};

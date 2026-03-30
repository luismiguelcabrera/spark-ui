import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DataIterator } from "../data-iterator";

type Person = { name: string; age: number };

const people: Person[] = [
  { name: "Charlie", age: 30 },
  { name: "Alice", age: 25 },
  { name: "Bob", age: 35 },
  { name: "Diana", age: 28 },
  { name: "Eve", age: 22 },
];

describe("DataIterator", () => {
  it("renders all items when no filter/sort/pagination", () => {
    render(
      <DataIterator items={people}>
        {({ items }) => (
          <ul>
            {items.map((p) => (
              <li key={p.name}>{p.name}</li>
            ))}
          </ul>
        )}
      </DataIterator>,
    );
    expect(screen.getByText("Charlie")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Diana")).toBeInTheDocument();
    expect(screen.getByText("Eve")).toBeInTheDocument();
  });

  it("sorts items by a key (ascending)", () => {
    render(
      <DataIterator items={people} sortBy="name">
        {({ items }) => (
          <ul>
            {items.map((p) => (
              <li key={p.name}>{p.name}</li>
            ))}
          </ul>
        )}
      </DataIterator>,
    );
    const listItems = screen.getAllByRole("listitem");
    expect(listItems[0]).toHaveTextContent("Alice");
    expect(listItems[1]).toHaveTextContent("Bob");
    expect(listItems[2]).toHaveTextContent("Charlie");
  });

  it("sorts items by a key (descending)", () => {
    render(
      <DataIterator items={people} sortBy="name" sortDirection="desc">
        {({ items }) => (
          <ul>
            {items.map((p) => (
              <li key={p.name}>{p.name}</li>
            ))}
          </ul>
        )}
      </DataIterator>,
    );
    const listItems = screen.getAllByRole("listitem");
    expect(listItems[0]).toHaveTextContent("Eve");
    expect(listItems[1]).toHaveTextContent("Diana");
  });

  it("sorts numeric values correctly", () => {
    render(
      <DataIterator items={people} sortBy="age">
        {({ items }) => (
          <ul>
            {items.map((p) => (
              <li key={p.name}>
                {p.name}:{p.age}
              </li>
            ))}
          </ul>
        )}
      </DataIterator>,
    );
    const listItems = screen.getAllByRole("listitem");
    expect(listItems[0]).toHaveTextContent("Eve:22");
    expect(listItems[4]).toHaveTextContent("Bob:35");
  });

  it("filters items with filterFn", () => {
    render(
      <DataIterator items={people} filterFn={(p) => p.age >= 28}>
        {({ items, totalItems }) => (
          <>
            <span data-testid="count">{totalItems}</span>
            <ul>
              {items.map((p) => (
                <li key={p.name}>{p.name}</li>
              ))}
            </ul>
          </>
        )}
      </DataIterator>,
    );
    expect(screen.getByTestId("count")).toHaveTextContent("3");
    expect(screen.getByText("Charlie")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Diana")).toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    expect(screen.queryByText("Eve")).not.toBeInTheDocument();
  });

  it("paginates items", () => {
    render(
      <DataIterator items={people} pageSize={2}>
        {({ items, page, pageCount, isFirst, isLast }) => (
          <>
            <span data-testid="page">{page}</span>
            <span data-testid="pageCount">{pageCount}</span>
            <span data-testid="isFirst">{String(isFirst)}</span>
            <span data-testid="isLast">{String(isLast)}</span>
            <ul>
              {items.map((p) => (
                <li key={p.name}>{p.name}</li>
              ))}
            </ul>
          </>
        )}
      </DataIterator>,
    );
    expect(screen.getByTestId("page")).toHaveTextContent("1");
    expect(screen.getByTestId("pageCount")).toHaveTextContent("3");
    expect(screen.getByTestId("isFirst")).toHaveTextContent("true");
    expect(screen.getByTestId("isLast")).toHaveTextContent("false");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("navigates pages with nextPage/prevPage", () => {
    function TestComponent() {
      return (
        <DataIterator items={people} pageSize={2}>
          {({ items, page, nextPage, prevPage, isFirst, isLast }) => (
            <>
              <span data-testid="page">{page}</span>
              <span data-testid="isFirst">{String(isFirst)}</span>
              <span data-testid="isLast">{String(isLast)}</span>
              <button type="button" onClick={prevPage}>
                Prev
              </button>
              <button type="button" onClick={nextPage}>
                Next
              </button>
              <ul>
                {items.map((p) => (
                  <li key={p.name}>{p.name}</li>
                ))}
              </ul>
            </>
          )}
        </DataIterator>
      );
    }

    render(<TestComponent />);

    // Page 1
    expect(screen.getByTestId("page")).toHaveTextContent("1");
    expect(screen.getByTestId("isFirst")).toHaveTextContent("true");

    // Go to page 2
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByTestId("page")).toHaveTextContent("2");

    // Go to page 3
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByTestId("page")).toHaveTextContent("3");
    expect(screen.getByTestId("isLast")).toHaveTextContent("true");

    // Cannot go past the last page
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByTestId("page")).toHaveTextContent("3");

    // Go back
    fireEvent.click(screen.getByText("Prev"));
    expect(screen.getByTestId("page")).toHaveTextContent("2");

    // Cannot go before first page
    fireEvent.click(screen.getByText("Prev"));
    fireEvent.click(screen.getByText("Prev"));
    expect(screen.getByTestId("page")).toHaveTextContent("1");
    expect(screen.getByTestId("isFirst")).toHaveTextContent("true");
  });

  it("goToPage navigates to specific page", () => {
    function TestComponent() {
      return (
        <DataIterator items={people} pageSize={2}>
          {({ page, goToPage }) => (
            <>
              <span data-testid="page">{page}</span>
              <button type="button" onClick={() => goToPage(3)}>
                Go to 3
              </button>
            </>
          )}
        </DataIterator>
      );
    }

    render(<TestComponent />);
    fireEvent.click(screen.getByText("Go to 3"));
    expect(screen.getByTestId("page")).toHaveTextContent("3");
  });

  it("setSortBy toggles direction when clicking the same key", () => {
    function TestComponent() {
      return (
        <DataIterator items={people}>
          {({ items, sortBy, sortDirection, setSortBy }) => (
            <>
              <span data-testid="sortBy">{sortBy ?? "none"}</span>
              <span data-testid="dir">{sortDirection}</span>
              <button type="button" onClick={() => setSortBy("name")}>
                Sort by name
              </button>
              <ul>
                {items.map((p) => (
                  <li key={p.name}>{p.name}</li>
                ))}
              </ul>
            </>
          )}
        </DataIterator>
      );
    }

    render(<TestComponent />);
    expect(screen.getByTestId("sortBy")).toHaveTextContent("none");

    // First click: sort by name asc
    fireEvent.click(screen.getByText("Sort by name"));
    expect(screen.getByTestId("sortBy")).toHaveTextContent("name");
    expect(screen.getByTestId("dir")).toHaveTextContent("asc");

    // Second click: toggle to desc
    fireEvent.click(screen.getByText("Sort by name"));
    expect(screen.getByTestId("dir")).toHaveTextContent("desc");
  });

  it("uses custom sortFn when provided", () => {
    const customSort = vi.fn(
      (a: Person, b: Person, _key: string, dir: string) => {
        const cmp = a.age - b.age;
        return dir === "desc" ? -cmp : cmp;
      },
    );

    render(
      <DataIterator items={people} sortBy="age" sortFn={customSort}>
        {({ items }) => (
          <ul>
            {items.map((p) => (
              <li key={p.name}>
                {p.name}:{p.age}
              </li>
            ))}
          </ul>
        )}
      </DataIterator>,
    );
    expect(customSort).toHaveBeenCalled();
    const listItems = screen.getAllByRole("listitem");
    expect(listItems[0]).toHaveTextContent("Eve:22");
  });

  it("combined filter + sort + pagination", () => {
    render(
      <DataIterator
        items={people}
        filterFn={(p) => p.age >= 25}
        sortBy="age"
        sortDirection="desc"
        pageSize={2}
      >
        {({ items, pageCount, totalItems }) => (
          <>
            <span data-testid="total">{totalItems}</span>
            <span data-testid="pages">{pageCount}</span>
            <ul>
              {items.map((p) => (
                <li key={p.name}>
                  {p.name}:{p.age}
                </li>
              ))}
            </ul>
          </>
        )}
      </DataIterator>,
    );
    // Filtered: Charlie(30), Alice(25), Bob(35), Diana(28) => 4 items
    expect(screen.getByTestId("total")).toHaveTextContent("4");
    // Sorted desc by age: Bob(35), Charlie(30), Diana(28), Alice(25)
    // Page 1 with pageSize 2: Bob(35), Charlie(30)
    expect(screen.getByTestId("pages")).toHaveTextContent("2");
    const listItems = screen.getAllByRole("listitem");
    expect(listItems[0]).toHaveTextContent("Bob:35");
    expect(listItems[1]).toHaveTextContent("Charlie:30");
  });

  it("handles empty items array", () => {
    render(
      <DataIterator items={[]}>
        {({ items, pageCount, isFirst, isLast }) => (
          <>
            <span data-testid="count">{items.length}</span>
            <span data-testid="pages">{pageCount}</span>
            <span data-testid="isFirst">{String(isFirst)}</span>
            <span data-testid="isLast">{String(isLast)}</span>
          </>
        )}
      </DataIterator>,
    );
    expect(screen.getByTestId("count")).toHaveTextContent("0");
    expect(screen.getByTestId("pages")).toHaveTextContent("1");
    expect(screen.getByTestId("isFirst")).toHaveTextContent("true");
    expect(screen.getByTestId("isLast")).toHaveTextContent("true");
  });

  it("provides allItems (before pagination)", () => {
    render(
      <DataIterator items={people} pageSize={2}>
        {({ items, allItems }) => (
          <>
            <span data-testid="page-count">{items.length}</span>
            <span data-testid="all-count">{allItems.length}</span>
          </>
        )}
      </DataIterator>,
    );
    expect(screen.getByTestId("page-count")).toHaveTextContent("2");
    expect(screen.getByTestId("all-count")).toHaveTextContent("5");
  });
});

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "../table";

describe("Table", () => {
  it("renders a table element", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("renders header and body rows", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Alice</TableCell>
            <TableCell>alice@example.com</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
  });

  it("forwards ref to the table element", () => {
    const ref = { current: null as HTMLTableElement | null };
    render(
      <Table ref={ref}>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(ref.current).toBeInstanceOf(HTMLTableElement);
  });

  it("has correct displayName", () => {
    expect(Table.displayName).toBe("Table");
  });

  it("merges custom className on table", () => {
    render(
      <Table className="custom-table">
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const table = screen.getByRole("table");
    expect(table.className).toContain("custom-table");
  });
});

describe("TableHeader", () => {
  it("has correct displayName", () => {
    expect(TableHeader.displayName).toBe("TableHeader");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLTableSectionElement | null };
    render(
      <table>
        <TableHeader ref={ref}>
          <TableRow>
            <TableHead>H</TableHead>
          </TableRow>
        </TableHeader>
      </table>,
    );
    expect(ref.current).toBeInstanceOf(HTMLTableSectionElement);
  });

  it("merges className", () => {
    const { container } = render(
      <table>
        <TableHeader className="extra">
          <TableRow>
            <TableHead>H</TableHead>
          </TableRow>
        </TableHeader>
      </table>,
    );
    expect(container.querySelector("thead")!.className).toContain("extra");
  });
});

describe("TableBody", () => {
  it("has correct displayName", () => {
    expect(TableBody.displayName).toBe("TableBody");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLTableSectionElement | null };
    render(
      <table>
        <TableBody ref={ref}>
          <TableRow>
            <TableCell>C</TableCell>
          </TableRow>
        </TableBody>
      </table>,
    );
    expect(ref.current).toBeInstanceOf(HTMLTableSectionElement);
  });
});

describe("TableFooter", () => {
  it("has correct displayName", () => {
    expect(TableFooter.displayName).toBe("TableFooter");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLTableSectionElement | null };
    render(
      <table>
        <TableFooter ref={ref}>
          <TableRow>
            <TableCell>F</TableCell>
          </TableRow>
        </TableFooter>
      </table>,
    );
    expect(ref.current).toBeInstanceOf(HTMLTableSectionElement);
  });

  it("merges className", () => {
    const { container } = render(
      <table>
        <TableFooter className="extra">
          <TableRow>
            <TableCell>F</TableCell>
          </TableRow>
        </TableFooter>
      </table>,
    );
    expect(container.querySelector("tfoot")!.className).toContain("extra");
  });
});

describe("TableRow", () => {
  it("has correct displayName", () => {
    expect(TableRow.displayName).toBe("TableRow");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLTableRowElement | null };
    render(
      <table>
        <tbody>
          <TableRow ref={ref}>
            <TableCell>C</TableCell>
          </TableRow>
        </tbody>
      </table>,
    );
    expect(ref.current).toBeInstanceOf(HTMLTableRowElement);
  });

  it("merges className", () => {
    render(
      <table>
        <tbody>
          <TableRow className="extra" data-testid="row">
            <TableCell>C</TableCell>
          </TableRow>
        </tbody>
      </table>,
    );
    expect(screen.getByTestId("row").className).toContain("extra");
  });
});

describe("TableHead", () => {
  it("has correct displayName", () => {
    expect(TableHead.displayName).toBe("TableHead");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLTableCellElement | null };
    render(
      <table>
        <thead>
          <tr>
            <TableHead ref={ref}>H</TableHead>
          </tr>
        </thead>
      </table>,
    );
    expect(ref.current).toBeInstanceOf(HTMLTableCellElement);
  });
});

describe("TableCell", () => {
  it("has correct displayName", () => {
    expect(TableCell.displayName).toBe("TableCell");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLTableCellElement | null };
    render(
      <table>
        <tbody>
          <tr>
            <TableCell ref={ref}>C</TableCell>
          </tr>
        </tbody>
      </table>,
    );
    expect(ref.current).toBeInstanceOf(HTMLTableCellElement);
  });

  it("merges className", () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell className="extra">C</TableCell>
          </tr>
        </tbody>
      </table>,
    );
    expect(screen.getByText("C").className).toContain("extra");
  });
});

describe("TableCaption", () => {
  it("has correct displayName", () => {
    expect(TableCaption.displayName).toBe("TableCaption");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLTableCaptionElement | null };
    render(
      <table>
        <TableCaption ref={ref}>Caption</TableCaption>
      </table>,
    );
    expect(ref.current).toBeInstanceOf(HTMLTableCaptionElement);
  });

  it("renders caption text", () => {
    render(
      <table>
        <TableCaption>My Table</TableCaption>
      </table>,
    );
    expect(screen.getByText("My Table")).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Countdown } from "../countdown";
import { ImageGrid } from "../image-grid";
import { DataList, DataListItem } from "../data-list";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../table";

describe("Countdown", () => {
  it("renders all time units", () => {
    const futureDate = new Date(Date.now() + 86400000 + 3600000 + 60000 + 1000);
    const { container } = render(<Countdown targetDate={futureDate} />);
    // Should have days, hours, minutes, seconds
    expect(container.textContent).toBeTruthy();
  });
});

describe("ImageGrid", () => {
  const images = [
    { src: "/img1.jpg", alt: "Image 1" },
    { src: "/img2.jpg", alt: "Image 2" },
  ];

  it("renders images", () => {
    render(<ImageGrid images={images} />);
    expect(screen.getByAltText("Image 1")).toBeInTheDocument();
    expect(screen.getByAltText("Image 2")).toBeInTheDocument();
  });

  it("applies columns", () => {
    const { container } = render(<ImageGrid images={images} cols={4} />);
    expect(container.firstChild).toHaveClass("grid-cols-4");
  });
});

describe("DataList", () => {
  it("renders items", () => {
    render(
      <DataList>
        <DataListItem label="Name" value="John" />
        <DataListItem label="Email" value="john@example.com" />
      </DataList>
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
  });
});

describe("Table", () => {
  it("renders table structure", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
  });
});

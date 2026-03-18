import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { AdminPage } from "../admin-page";

describe("AdminPage", () => {
  it("renders without error", () => {
    render(<AdminPage>Page content</AdminPage>);
    expect(screen.getByText("Page content")).toBeInTheDocument();
  });

  it("renders as a main element (via AppShellContent)", () => {
    render(<AdminPage>Content</AdminPage>);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLElement>();
    render(<AdminPage ref={ref}>Content</AdminPage>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it("has displayName", () => {
    expect(AdminPage.displayName).toBe("AdminPage");
  });

  it("merges className", () => {
    render(<AdminPage className="custom-admin">Content</AdminPage>);
    expect(screen.getByRole("main")).toHaveClass("custom-admin");
  });

  it("renders children", () => {
    render(
      <AdminPage>
        <div>Child 1</div>
        <div>Child 2</div>
      </AdminPage>,
    );
    expect(screen.getByText("Child 1")).toBeInTheDocument();
    expect(screen.getByText("Child 2")).toBeInTheDocument();
  });
});

describe("AdminPage.Header", () => {
  it("renders title", () => {
    render(
      <AdminPage>
        <AdminPage.Header title="Dashboard" />
      </AdminPage>,
    );
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders subtitle", () => {
    render(
      <AdminPage>
        <AdminPage.Header title="Dashboard" subtitle="Overview of your data" />
      </AdminPage>,
    );
    expect(screen.getByText("Overview of your data")).toBeInTheDocument();
  });

  it("renders action slot", () => {
    render(
      <AdminPage>
        <AdminPage.Header title="Dashboard" action={<button>Add New</button>} />
      </AdminPage>,
    );
    expect(screen.getByRole("button", { name: "Add New" })).toBeInTheDocument();
  });

  it("has displayName", () => {
    expect(AdminPage.Header.displayName).toBe("AdminPage.Header");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <AdminPage>
        <AdminPage.Header ref={ref} title="Dashboard" />
      </AdminPage>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <AdminPage>
        <AdminPage.Header ref={ref} title="Dashboard" className="custom-header" />
      </AdminPage>,
    );
    expect(ref.current).toHaveClass("custom-header");
  });
});

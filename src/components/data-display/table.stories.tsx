import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "./table";
import { Badge } from "./badge";

const meta = {
  title: "Data Display/Table",
  component: Table,
  tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const invoices = [
  { id: "INV-001", date: "2024-01-15", customer: "Alice Johnson", amount: "$250.00", status: "Paid" },
  { id: "INV-002", date: "2024-01-18", customer: "Bob Smith", amount: "$150.00", status: "Pending" },
  { id: "INV-003", date: "2024-01-20", customer: "Charlie Brown", amount: "$350.00", status: "Paid" },
  { id: "INV-004", date: "2024-01-22", customer: "Diana Prince", amount: "$450.00", status: "Overdue" },
  { id: "INV-005", date: "2024-01-25", customer: "Eve Wilson", amount: "$200.00", status: "Paid" },
];

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>{invoice.date}</TableCell>
            <TableCell>{invoice.customer}</TableCell>
            <TableCell>{invoice.amount}</TableCell>
            <TableCell>
              <Badge
                variant={
                  invoice.status === "Paid"
                    ? "success"
                    : invoice.status === "Pending"
                    ? "warning"
                    : "danger"
                }
              >
                {invoice.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Widget A</TableCell>
          <TableCell>3</TableCell>
          <TableCell className="text-right">$30.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Widget B</TableCell>
          <TableCell>1</TableCell>
          <TableCell className="text-right">$45.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Widget C</TableCell>
          <TableCell>2</TableCell>
          <TableCell className="text-right">$20.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2} className="font-semibold">Total</TableCell>
          <TableCell className="text-right font-semibold">$95.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const WithCaption: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of recent transactions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Transaction</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Payment from Alice</TableCell>
          <TableCell>Jan 15, 2024</TableCell>
          <TableCell className="text-right text-green-600">+$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Subscription renewal</TableCell>
          <TableCell>Jan 18, 2024</TableCell>
          <TableCell className="text-right text-red-600">-$29.99</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Payment from Bob</TableCell>
          <TableCell>Jan 20, 2024</TableCell>
          <TableCell className="text-right text-green-600">+$150.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const SelectedRows: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow data-state="selected">
          <TableCell className="font-medium">Alice Johnson</TableCell>
          <TableCell>alice@example.com</TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Bob Smith</TableCell>
          <TableCell>bob@example.com</TableCell>
          <TableCell>Editor</TableCell>
        </TableRow>
        <TableRow data-state="selected">
          <TableCell className="font-medium">Charlie Brown</TableCell>
          <TableCell>charlie@example.com</TableCell>
          <TableCell>Viewer</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

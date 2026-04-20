import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { mockBookings } from "@/data/mock-data";

const columns = [
  { key: "id", label: "ID" },
  { key: "service", label: "Service" },
  { key: "provider", label: "Provider" },
  { key: "customer", label: "Customer" },
  { key: "date", label: "Date" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
];

export default function ServiceBookings() {
  return (
    <div>
      <PageHeader title="Bookings" description="Manage service bookings" />
      <DataTable columns={columns} data={mockBookings} />
    </div>
  );
}

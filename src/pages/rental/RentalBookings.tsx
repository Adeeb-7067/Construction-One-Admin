import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { mockBookings } from "@/data/mock-data";

const columns = [
  { key: "id", label: "ID" },
  { key: "service", label: "Equipment" },
  { key: "customer", label: "Customer" },
  { key: "date", label: "Date" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
];

export default function RentalBookings() {
  return (
    <div>
      <PageHeader title="Rental Bookings" description="Manage equipment bookings" />
      <DataTable columns={columns} data={mockBookings} />
    </div>
  );
}

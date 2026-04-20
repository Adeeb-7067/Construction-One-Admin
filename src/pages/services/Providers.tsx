import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { mockProviders } from "@/data/mock-data";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Provider" },
  { key: "service", label: "Service" },
  { key: "rating", label: "Rating" },
  { key: "bookings", label: "Bookings" },
  { key: "status", label: "Status" },
];

export default function Providers() {
  return (
    <div>
      <PageHeader title="Providers" description="Manage service providers" />
      <DataTable columns={columns} data={mockProviders} />
    </div>
  );
}

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { mockCategories } from "@/data/mock-data";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Category" },
  { key: "subCount", label: "Sub Categories" },
  { key: "productCount", label: "Equipment Count" },
];

export default function RentalCategories() {
  return (
    <div>
      <PageHeader title="Rental Categories" description="Manage equipment categories" />
      <DataTable columns={columns} data={mockCategories.filter(c => !c.parent)} />
    </div>
  );
}

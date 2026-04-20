import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { mockEquipment } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";

const columns = [
  { 
    key: "available", 
    label: "Available", 
    render: (v: boolean) => (
      <Badge 
        variant="outline" 
        className={`text-[10px] min-w-[70px] justify-center ${
          v ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
        }`}
      >
        {v ? "Yes" : "No"}
      </Badge>
    ) 
  },
];

export default function Equipment() {
  return (
    <div>
      <PageHeader title="Equipment" description="Manage rental equipment" />
      <DataTable columns={columns} data={mockEquipment} />
    </div>
  );
}

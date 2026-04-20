import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { mockProjects } from "@/data/mock-data";
import { Progress } from "@/components/ui/progress";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Project" },
  { key: "budget", label: "Budget" },
  { key: "progress", label: "Progress", render: (v: number) => (
    <div className="flex items-center gap-2">
      <Progress value={v} className="h-2 w-20" />
      <span className="text-xs text-muted-foreground">{v}%</span>
    </div>
  )},
  { key: "status", label: "Status" },
  { key: "startDate", label: "Start Date" },
];

export default function Projects() {
  return (
    <div>
      <PageHeader title="Projects" description="Manage construction projects" />
      <DataTable columns={columns} data={mockProjects} />
    </div>
  );
}

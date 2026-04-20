import { DollarSign, Calculator, FolderKanban, Hammer } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { moduleStats } from "@/data/mock-data";

export default function PlannerDashboard() {
  const s = moduleStats.planner;
  return (
    <div>
      <PageHeader title="Planner Dashboard" description="Overview of planning operations" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Projects" value={s.projects.toString()} change="+6.4%" icon={FolderKanban} />
        <StatCard title="Estimations" value={s.estimations.toLocaleString()} change="+8.2%" icon={Calculator} />
        <StatCard title="Revenue" value={s.revenue} change="+12.1%" icon={DollarSign} />
        <StatCard title="Tools" value={s.tools.toString()} change="+1.5%" icon={Hammer} />
      </div>
    </div>
  );
}

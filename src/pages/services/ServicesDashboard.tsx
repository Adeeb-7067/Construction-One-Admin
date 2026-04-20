import { DollarSign, UserCheck, Calendar, Search } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { moduleStats } from "@/data/mock-data";

export default function ServicesDashboard() {
  const s = moduleStats.services;
  return (
    <div>
      <PageHeader title="Services Dashboard" description="Overview of service operations" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Bookings" value={s.bookings.toLocaleString()} change="+10.2%" icon={Calendar} />
        <StatCard title="Providers" value={s.providers.toString()} change="+5.1%" icon={UserCheck} />
        <StatCard title="Revenue" value={s.revenue} change="+14.3%" icon={DollarSign} />
        <StatCard title="Inspections" value={s.inspections.toString()} change="+7.8%" icon={Search} />
      </div>
    </div>
  );
}

import { DollarSign, Hammer, Calendar, FolderTree } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { moduleStats } from "@/data/mock-data";

export default function RentalDashboard() {
  const s = moduleStats.rental;
  return (
    <div>
      <PageHeader title="Rental Tool Dashboard" description="Overview of equipment rental operations" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Bookings" value={s.bookings.toLocaleString()} change="+9.4%" icon={Calendar} />
        <StatCard title="Equipment" value={s.equipment.toLocaleString()} change="+3.2%" icon={Hammer} />
        <StatCard title="Revenue" value={s.revenue} change="+11.7%" icon={DollarSign} />
        <StatCard title="Categories" value={s.categories.toString()} change="+2.1%" icon={FolderTree} />
      </div>
    </div>
  );
}

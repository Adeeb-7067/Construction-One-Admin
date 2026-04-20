import { TrendingUp, TrendingDown } from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  trend?: "up" | "down";
  accent?: string;
}

export function StatCard({ title, value, change, icon: Icon, trend = "up" }: StatCardProps) {
  return (
    <div className="stat-card group">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="rounded-xl bg-primary/10 p-2.5 group-hover:bg-primary/20 transition-colors duration-200">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
        {change && (
          <div className="mt-1.5 flex items-center gap-1.5 text-xs">
            <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${
              trend === "up" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
            }`}>
              {trend === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span className="font-medium">{change}</span>
            </div>
            <span className="text-muted-foreground">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}

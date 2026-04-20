import { type LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ModuleCardProps {
  title: string;
  icon: LucideIcon;
  stats: Record<string, string | number>;
  url: string;
}

export function ModuleCard({ title, icon: Icon, stats, url }: ModuleCardProps) {
  const navigate = useNavigate();

  return (
    <div className="module-card group" onClick={() => navigate(url)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 p-3 group-hover:from-primary/25 group-hover:to-primary/10 transition-all duration-300">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-[11px] text-muted-foreground">Module overview</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="bg-muted/50 rounded-lg px-3 py-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{key}</p>
            <p className="text-sm font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-between text-primary hover:text-primary hover:bg-primary/5 group/btn"
      >
        View Dashboard
        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}

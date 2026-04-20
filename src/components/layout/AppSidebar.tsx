import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, PanelLeftClose, PanelLeft } from "lucide-react";
import { sidebarConfig, type SidebarEntry, type SidebarGroup } from "@/config/sidebar-config";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

function isGroup(entry: SidebarEntry): entry is SidebarGroup {
  return "items" in entry;
}

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const permissions: string[] = JSON.parse(localStorage.getItem("permissions") || "[]");

  const hasPermission = (permission?: string) => {
    if (!permission) return true;
    return permissions.includes("*") || permissions.includes(permission);
  };

  const filteredSidebarConfig = sidebarConfig
    .map((entry) => {
      if (!isGroup(entry)) {
        return hasPermission(entry.permission) ? entry : null;
      }
      const visibleItems = entry.items.filter((item) => hasPermission(item.permission));
      return visibleItems.length > 0 ? { ...entry, items: visibleItems } : null;
    })
    .filter((entry): entry is SidebarEntry => entry !== null);

  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    filteredSidebarConfig.forEach((entry) => {
      if (isGroup(entry) && entry.items.some((item) => location.pathname === item.url)) {
        initial.add(entry.title);
      }
    });
    return initial;
  });

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  const isActive = (url: string) => location.pathname === url;

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
        "border-sidebar-border",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2 animate-fade-in">
            <img src={logo} alt="ConstructionOne" className="h-7" />
          </div>
        )}
        <button
          onClick={onToggle}
          className="rounded-lg p-2 hover:bg-sidebar-accent transition-all duration-200 group"
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4 text-sidebar-foreground/50 group-hover:text-primary transition-colors" />
          ) : (
            <PanelLeftClose className="h-4 w-4 text-sidebar-foreground/50 group-hover:text-primary transition-colors" />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-3 space-y-1">
        {filteredSidebarConfig.map((entry) => {
          if (!isGroup(entry)) {
            const active = isActive(entry.url);
            return (
              <button
                key={entry.title}
                onClick={() => navigate(entry.url)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                  active
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <entry.icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0 transition-colors",
                    active ? "text-primary" : "text-sidebar-foreground/40"
                  )}
                />
                {!collapsed && <span className="animate-fade-in">{entry.title}</span>}
              </button>
            );
          }

          const groupActive = entry.items.some((item) => isActive(item.url));
          const isOpen = openGroups.has(entry.title);

          return (
            <div key={entry.title} className="space-y-0.5">
              <button
                onClick={() => (collapsed ? navigate(entry.items[0].url) : toggleGroup(entry.title))}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                  groupActive
                    ? "text-primary font-semibold"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <entry.icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0 transition-colors",
                    groupActive ? "text-primary" : "text-sidebar-foreground/40"
                  )}
                />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left animate-fade-in">{entry.title}</span>
                    <div className={cn("transition-transform duration-200", isOpen && "rotate-180")}>
                      <ChevronDown className="h-3.5 w-3.5 text-sidebar-foreground/40" />
                    </div>
                  </>
                )}
              </button>

              {!collapsed && (
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="ml-5 space-y-0.5 border-l-2 border-sidebar-border pl-3 py-1">
                    {entry.items.map((item) => {
                      const itemActive = isActive(item.url);
                      return (
                        <button
                          key={item.url}
                          onClick={() => navigate(item.url)}
                          className={cn(
                            "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-all duration-200",
                            itemActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-3.5 w-3.5 shrink-0",
                              itemActive ? "text-primary" : "text-sidebar-foreground/40"
                            )}
                          />
                          <span>{item.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-sidebar-border p-4 animate-fade-in">
          <p className="text-[10px] text-sidebar-foreground/40 text-center">© 2026 ConstructionOne</p>
        </div>
      )}
    </aside>
  );
}
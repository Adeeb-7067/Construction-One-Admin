import { Bell, Search, User, ChevronDown, Settings, LogOut, Moon, Command, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { CommandMenu } from "./CommandMenu";
import { ModeToggle } from "../mode-toggle";
import { useGetAdminMeQuery } from "@/pages/Redux/apiSlice";

const notifications = [
  { id: 1, title: "New order received", desc: "Order #ORD-4521 from Vendor 3", time: "2m ago", unread: true },
  { id: 2, title: "RFQ approved", desc: "RFQ #RFQ-892 has been approved", time: "1h ago", unread: true },
  { id: 3, title: "Equipment returned", desc: "Excavator EQP-401 returned", time: "3h ago", unread: false },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const { data: response, isLoading: isAdminLoading } = useGetAdminMeQuery(role);
  const admin = response?.data?.admin || response?.admin || response?.data?.subAdmin || response?.subAdmin;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminId");
    localStorage.removeItem("admin");
    localStorage.removeItem("permissions");
    toast.success("Logout successfully");
    navigate("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card/80 backdrop-blur-sm px-6 sticky top-0 z-10">
      <div className="relative w-80">
        <Button
          variant="outline"
          className="relative h-10 w-full justify-start bg-muted/50 border-0 rounded-lg text-sm text-muted-foreground transition-all hover:bg-muted/80 pr-12"
          onClick={() => setOpen(true)}
        >
          <Search className="mr-2 h-4 w-4" />
          <span>Search anything...</span>
          <kbd className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>
      <CommandMenu open={open} setOpen={setOpen} />

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <ModeToggle />

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-lg hover:bg-muted">
              <Bell className="h-[18px] w-[18px] text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="px-4 py-3 border-b">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Notifications</h4>
                <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-primary/20">3 new</Badge>
              </div>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors border-b last:border-0"
                >
                  <div className="flex items-start gap-3">
                    {n.unread && <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />}
                    {!n.unread && <span className="mt-1.5 h-2 w-2 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{n.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{n.desc}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2 border-t">
              <Button variant="ghost" size="sm" className="w-full text-primary text-xs">View all notifications</Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Divider */}
        <div className="h-6 w-px bg-border" />

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-sm">
                {isAdminLoading ? (
                  <Loader2 className="h-4 w-4 text-primary-foreground animate-spin" />
                ) : (
                  <User className="h-4 w-4 text-primary-foreground" />
                )}
              </div>
              <div className="hidden md:block text-left">
                {isAdminLoading ? (
                  <div className="space-y-1">
                    <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                    <div className="h-2 w-28 bg-muted animate-pulse rounded" />
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium text-foreground leading-tight">
                      {admin ? `${admin.firstName} ${admin.lastName}` : "Admin User"}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-tight">
                      {admin?.email || "admin@constructionone.com"}
                    </p>
                  </>
                )}
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden md:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => navigate("/admin/profile")} className="gap-2 cursor-pointer transition-colors hover:text-primary">
              <User className="h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer transition-colors hover:text-primary">
              <Settings className="h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
              <LogOut className="h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}


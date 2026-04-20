import { DollarSign, ShoppingCart, Users, Store, Plus, UserPlus, FileText, FolderKanban, ArrowRight, Clock } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { ModuleCard } from "@/components/shared/ModuleCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { dashboardStats, moduleStats, revenueData, ordersData, recentActivity } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Wrench, Truck, ClipboardList } from "lucide-react";

const pieData = [
  { name: "Marketplace", value: 45 },
  { name: "Services", value: 25 },
  { name: "Rental", value: 18 },
  { name: "Planner", value: 12 },
];

const COLORS = [
  "hsl(24, 85%, 52%)",
  "hsl(16, 80%, 48%)",
  "hsl(152, 60%, 42%)",
  "hsl(210, 80%, 55%)",
];

export default function MainDashboard() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Dashboard" description="Welcome back! Here's your platform overview" />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Total Revenue" value={dashboardStats.totalRevenue} change={dashboardStats.revenueChange} icon={DollarSign} />
        <StatCard title="Total Orders" value={dashboardStats.totalOrders} change={dashboardStats.ordersChange} icon={ShoppingCart} />
        <StatCard title="Total Users" value={dashboardStats.totalUsers} change={dashboardStats.usersChange} icon={Users} />
        <StatCard title="Active Vendors" value={dashboardStats.activeVendors} change={dashboardStats.vendorsChange} icon={Store} />
      </div>

      {/* Module Cards */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">Modules</h2>
        <Button variant="ghost" size="sm" className="text-primary gap-1">
          View All <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <ModuleCard title="Marketplace" icon={ShoppingCart} stats={moduleStats.marketplace} url="/marketplace/dashboard" />
        <ModuleCard title="Services" icon={Wrench} stats={moduleStats.services} url="/services/dashboard" />
        <ModuleCard title="Rental Tool" icon={Truck} stats={moduleStats.rental} url="/rental/dashboard" />
        <ModuleCard title="Planner" icon={ClipboardList} stats={moduleStats.planner} url="/planner/dashboard" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2 rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-foreground">Revenue Trend</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Monthly revenue across modules</p>
            </div>
            <Badge variant="secondary" className="text-[10px] font-medium bg-slate-50 text-slate-700 border-slate-200">Last 7 months</Badge>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(24, 85%, 52%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(24, 85%, 52%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSvc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(152, 60%, 42%)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(152, 60%, 42%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 10%, 90%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(20, 6%, 50%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(20, 6%, 50%)" />
              <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid hsl(30, 10%, 90%)", fontSize: 12 }} />
              <Area type="monotone" dataKey="marketplace" stroke="hsl(24, 85%, 52%)" fill="url(#colorRev)" strokeWidth={2} />
              <Area type="monotone" dataKey="services" stroke="hsl(152, 60%, 42%)" fill="url(#colorSvc)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-sm font-bold text-foreground mb-1">Revenue Split</h3>
          <p className="text-xs text-muted-foreground mb-4">By module contribution</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid hsl(30, 10%, 90%)", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {pieData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-muted-foreground">{entry.name}</span>
                <span className="font-semibold text-foreground ml-auto">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Bar Chart */}
      <div className="rounded-xl border bg-card p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-foreground">Orders Analytics</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Completed vs cancelled orders</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={ordersData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 10%, 90%)" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(20, 6%, 50%)" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(20, 6%, 50%)" />
            <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid hsl(30, 10%, 90%)", fontSize: 12 }} />
            <Bar dataKey="completed" fill="hsl(24, 85%, 52%)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="cancelled" fill="hsl(0, 72%, 51%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-foreground">Recent Activity</h3>
            <Button variant="ghost" size="sm" className="text-primary text-xs gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-1">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
                <Badge 
                  variant={item.status === "completed" || item.status === "confirmed" || item.status === "approved" ? "default" : "secondary"} 
                  className={`text-[10px] ${(item.status === "completed" || item.status === "confirmed" || item.status === "approved") ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-sm font-bold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { icon: Plus, label: "Add Product", color: "text-primary" },
                { icon: UserPlus, label: "Add Vendor", color: "text-success" },
                { icon: FileText, label: "Create RFQ", color: "text-info" },
                { icon: FolderKanban, label: "Add Project", color: "text-warning" },
              ].map(({ icon: QIcon, label, color }) => (
                <Button key={label} variant="outline" className="w-full justify-start gap-3 h-11 rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-all">
                  <div className={`h-7 w-7 rounded-lg bg-muted flex items-center justify-center`}>
                    <QIcon className={`h-3.5 w-3.5 ${color}`} />
                  </div>
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-sm font-bold text-foreground mb-4">Platform Health</h3>
            <div className="space-y-4">
              {[
                { label: "Uptime", value: 99.8, color: "bg-success" },
                { label: "Order Fulfillment", value: 87, color: "bg-primary" },
                { label: "Vendor Activity", value: 72, color: "bg-warning" },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-semibold text-foreground">{value}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

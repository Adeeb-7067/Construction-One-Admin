import {
  motion,
  AnimatePresence,
  HTMLMotionProps,
  Variants,
} from "framer-motion";
import {
  ShoppingCart,
  DollarSign,
  Users,
  Store,
  TrendingUp,
  MapPin,
  Tag,
  PackageCheck,
  Clock,
  XCircle,
  CheckCircle2,
  ArrowUpRight,
  History,
  Trophy,
  Calendar as CalendarIcon,
  ChevronRight,
  Filter,
  RefreshCw,
  BarChart3,
  Loader2,
  Zap,
  Target,
  Activity,
  CreditCard,
  Globe,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";
import { useState, useMemo } from "react";
import { useGetAdminDashboardQuery } from "@/pages/Redux/apiSlice";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";

// ── Design tokens ─────────────────────────────────────────────
const C = {
  primary: "#E8632A",
  emerald: "#10B981",
  sky: "#0EA5E9",
  violet: "#8B5CF6",
  amber: "#F59E0B",
  rose: "#F43F5E",
  slate: "#64748B",
  border: "hsl(var(--border))",
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// ── Animation helpers ─────────────────────────────────────────
const fadeUp = (delay = 0): HTMLMotionProps<"div"> => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
  transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay },
});

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

// ── Custom components ──────────────────────────────────────────
function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-border bg-card/95 backdrop-blur-md px-4 py-3 text-[11px] shadow-xl ring-1 ring-black/5">
      <p className="mb-2 font-black text-foreground uppercase tracking-wider opacity-60">
        {label}
      </p>
      {payload.map((p: any) => (
        <p
          key={p.name}
          className="flex items-center gap-2.5 text-muted-foreground py-0.5"
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: p.color }}
          />
          <span className="flex-1 font-bold">{p.name}:</span>
          <span className="font-black text-foreground tracking-tighter text-[12px]">
            {p.value.toLocaleString()}
          </span>
        </p>
      ))}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
  icon: Icon,
  delay,
  trend,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
  icon: any;
  delay: number;
  trend?: string;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const bgOpacity = isDark ? "25" : "15"; // More vibrant in dark mode
  const borderOpacity = isDark ? "35" : "25";

  return (
    <motion.div
      {...fadeUp(delay)}
      className="group relative overflow-hidden rounded-xl border p-5 transition-all hover:shadow-lg transition-all duration-300"
      style={{
        background: `linear-gradient(135deg, ${color}${bgOpacity} 0%, ${color}05 100%)`,
        borderColor: `${color}${borderOpacity}`,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center transition-colors shadow-sm"
          style={{ background: `${color}10`, color }}
        >
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            +{trend}
          </span>
        )}
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground opacity-60">
          {label}
        </p>
        <p className="text-2xl font-black text-foreground tracking-tight tabular-nums">
          {value}
        </p>
      </div>
      <p className="mt-3 text-[10px] font-bold text-muted-foreground border-t border-border/50 pt-2">
        {sub}
      </p>
    </motion.div>
  );
}

function Section({
  title,
  sub,
  icon: Icon,
  children,
  delay,
  className = "",
}: {
  title: string;
  sub?: string;
  icon?: any;
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <motion.div
      {...fadeUp(delay)}
      className={cn(
        "rounded-xl border border-border bg-card p-6 shadow-sm",
        className,
      )}
    >
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="h-9 w-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <div>
            <h3 className="text-md font-black tracking-tight text-foreground">
              {title}
            </h3>
            {sub && (
              <p className="text-[10px] font-bold text-muted-foreground opacity-50 uppercase tracking-widest">
                {sub}
              </p>
            )}
          </div>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────
export default function MarketplaceDashboard() {
  const [range, setRange] = useState("lifetime");
  const [date, setDate] = useState<DateRange | undefined>();

  const queryParams = useMemo(() => {
    if (range === "custom" && date?.from && date?.to) {
      return {
        filter: "custom",
        startDate: format(date.from, "yyyy-MM-dd"),
        endDate: format(date.to, "yyyy-MM-dd"),
      };
    }
    return { filter: range };
  }, [range, date]);

  const {  
    data: response,
    isLoading,
    isFetching,
  } = useGetAdminDashboardQuery(queryParams);
  const d = response?.data;

  const analyticData = useMemo(() => {
    if (!d?.monthWiseAnalytics) return [];
    return MONTHS.map((month, index) => {
      const mIdx = (index + 1).toString();
      return {
        month,
        users: d.monthWiseAnalytics.usersByMonth?.[mIdx] || 0,
        vendors: d.monthWiseAnalytics.vendorsByMonth?.[mIdx] || 0,
        orders: d.monthWiseAnalytics.ordersByMonth?.[mIdx] || 0,
      };
    });
  }, [d]);

  const orderStatusPie = useMemo(() => {
    if (!d?.summary) return [];
    const s = d.summary;
    const named = (s.ordersDelivered || 0) + (s.pendingOrders || 0) + (s.placedOrders || 0);
    const other = Math.max(0, (s.totalOrders || 0) - named);

    const base = [
      { name: "Delivered", value: s.ordersDelivered, color: C.emerald },
      { name: "Pending", value: s.pendingOrders, color: C.amber },
      { name: "Placed", value: s.placedOrders, color: C.primary },
    ];

    if (other > 0) {
      base.push({ name: "Other", value: other, color: C.slate });
    }
    return base;
  }, [d]);

  if (isLoading) return <DashboardSkeleton />;

  const s = d?.summary;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <PageHeader
          title="Marketplace Dashboard"
          description="Core platform metrics & operational health"
        />

        <div className="flex items-center gap-1.5 bg-muted/30 p-1.5 rounded-xl border border-border overflow-x-auto no-scrollbar">
          {["lifetime", "today", "yesterday", "last7days", "last30days"].map(
            (f) => ( 
              <Button
                key={f}
                variant={range === f ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setRange(f)}
                className={cn(
                  "rounded-sm text-[9px] font-black uppercase tracking-wider h-8 px-4",
                  range === f && "bg-background shadow-sm text-primary",
                )}
              >
                {f.replace("last", "")}
              </Button>
            ),
          )}

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={range === "custom" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setRange("custom")}
                className={cn(
                  "rounded-xl text-[9px] font-black uppercase tracking-wider h-8 gap-2 px-4 whitespace-nowrap",
                  range === "custom" && "bg-background text-primary",
                )}
              >
                <CalendarIcon className="h-3 w-3" />
                {date?.from
                  ? format(date.from, "MMM dd") +
                    (date.to ? "-" + format(date.to, "MMM dd") : "")
                  : "Range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 rounded-2xl overflow-hidden border-border bg-card shadow-2xl"
              align="end"
            >
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {isFetching && (
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-primary opacity-50 mx-2" />
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={range + (date?.from || "")}
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* ── Top Row: Primary KPIs ── */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            <StatCard
              label="Platform GMV"
              value={`₹${(s?.totalTransactionRevenue || 0).toLocaleString()}`}
              sub="Total Transaction Value"
              color={C.primary}
              icon={Zap}
              delay={0.05}
            />
            <StatCard
              label="Total Revenue"
              value={`₹${(s?.totalRevenue || 0).toLocaleString()}`}
              sub="Direct platform income"
              color={C.emerald}
              icon={CreditCard}
              delay={0.1}
            />
            <StatCard
              label="Active Scale"
              value={(s?.totalOrders || 0).toLocaleString()}
              sub={`${s?.pendingOrders || 0} currently processing`}
              color={C.sky}
              icon={ShoppingCart}
              delay={0.15}
            />
            <StatCard
              label="Identity"
              value={(s?.totalUsers || 0).toLocaleString()}
              sub="Registered platform users"
              color={C.violet}
              icon={Users}
              delay={0.2}
            />
            <StatCard
              label="Vendors"
              value={(s?.totalVendors || 0).toLocaleString()}
              sub={`${s?.activeVendor || 0} currently active`}
              color={C.amber}
              icon={Store}
              delay={0.25}
            />
          </div>

          {/* ── Middle: Charts ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Section
              title="Growth Trends"
              sub="User, Order & Vendor onboarding"
              icon={TrendingUp}
              delay={0.3}
              className="lg:col-span-8"
            >
              <div className="mb-6 flex gap-6 overflow-x-auto no-scrollbar">
                {[
                  { label: "Orders", color: C.primary },
                  { label: "Accounts", color: C.violet },
                  { label: "Vendors", color: C.sky },
                ].map((leg) => (
                  <div
                    key={leg.label}
                    className="flex items-center gap-2 shrink-0"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: leg.color }}
                    />
                    <span className="text-[10px] font-black uppercase text-muted-foreground">
                      {leg.label}
                    </span>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart
                  data={analyticData}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="clrP" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={C.primary}
                        stopOpacity={0.1}
                      />
                      <stop
                        offset="95%"
                        stopColor={C.primary}
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient id="clrS" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.sky} stopOpacity={0.1} />
                      <stop offset="95%" stopColor={C.sky} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke={C.border}
                    vertical={false}
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: C.slate }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: C.slate }}
                  />
                  <Tooltip content={<ChartTip />} />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    name="Orders"
                    stroke={C.primary}
                    strokeWidth={2.5}
                    fill="url(#clrP)"
                    strokeLinecap="round"
                  />
                  <Area
                    type="monotone"
                    dataKey="vendors"
                    name="Vendors"
                    stroke={C.sky}
                    strokeWidth={2.5}
                    fill="url(#clrS)"
                    strokeLinecap="round"
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    name="Accounts"
                    stroke={C.violet}
                    strokeWidth={2.5}
                    fill="transparent"
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Section>

            <Section
              title="Operation Mix"
              sub="Fulfillment Split"
              icon={Target}
              delay={0.35}
              className="lg:col-span-4"
            >
              <div className="flex flex-col items-center">
                <div className="relative h-48 w-48 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderStatusPie}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                      >
                        {orderStatusPie.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-foreground">
                      {s?.totalOrders || 0}
                    </span>
                    <span className="text-[9px] font-bold text-muted-foreground opacity-50 uppercase">
                      Orders
                    </span>
                  </div>
                </div>
                <div className="w-full mt-6 space-y-2">
                  {orderStatusPie.map((i) => {
                    const total = s?.totalOrders || 1;
                    const pct = Math.round((i.value / total) * 100);
                    return (
                      <div
                        key={i.name}
                        className="flex items-center justify-between p-2.5 rounded-2xl bg-muted/20 border border-border/50"
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: i.color }}
                          />
                          <span className="text-[10px] font-black uppercase text-muted-foreground">
                            {i.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black">{i.value}</span>
                          <span className="text-[9px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                            {pct}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Section>
          </div>

          {/* ── Operational Health & Scale ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section
              title="Vendor Health"
              sub="Verification Pipeline"
              icon={Store}
              delay={0.4}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-2">
                <div className="relative h-44 w-44 mx-auto">
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black">
                      {s?.totalVendors || 0}
                    </span>
                    <span className="text-[9px] font-bold opacity-40 uppercase">
                      Vendors
                    </span>
                  </div>
                  <PieChart width={176} height={176}>
                    <Pie
                      data={[
                        {
                          name: "Verified",
                          value: s?.verifiedVendors || 0,
                          color: C.emerald,
                        },
                        {
                          name: "Unverified",
                          value: s?.unverifiedVendors || 0,
                          color: C.rose,
                        },
                      ]}
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell fill={C.emerald} />
                      <Cell fill={C.rose} />
                    </Pie>
                  </PieChart>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-[1.5rem] bg-emerald/5 border border-emerald/10">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald" />
                      <span className="text-xs font-black uppercase text-emerald">
                        Verified
                      </span>
                    </div>
                    <span className="text-lg font-black">
                      {s?.verifiedVendors || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-[1.5rem] bg-rose/5 border border-rose/10">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-4 w-4 text-rose" />
                      <span className="text-xs font-black uppercase text-rose">
                        Pending
                      </span>
                    </div>
                    <span className="text-lg font-black">
                      {s?.unverifiedVendors || 0}
                    </span>
                  </div>
                </div>
              </div>
            </Section>

            <Section
              title="Catalog Depth"
              sub="Structure & Coverage"
              icon={Activity}
              delay={0.45}
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "P-Categories",
                    value: s?.totalPCategories,
                    color: C.primary,
                    icon: Tag,
                  },
                  {
                    label: "Categories",
                    value: s?.totalCategories,
                    color: C.sky,
                    icon: BarChart3,
                  },
                  {
                    label: "Sub-Categories",
                    value: s?.totalSubCategories,
                    color: C.violet,
                    icon: TrendingUp,
                  },
                  {
                    label: "Brands",
                    value: s?.totalBrands,
                    color: C.amber,
                    icon: Zap,
                  },
                  {
                    label: "Cities",
                    value: s?.totalCities,
                    color: C.emerald,
                    icon: MapPin,
                  },
                  {
                    label: "States",
                    value: s?.totalStates,
                    color: C.sky,
                    icon: Globe, // I'll use Globe if available or just stick to MapPin
                  },
                ].map((p) => (
                  <div
                    key={p.label}
                    className="p-4 rounded-[1.8rem] bg-muted/10 border border-border group hover:bg-muted/20 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3 text-muted-foreground">
                      <p className="text-[9px] font-black uppercase tracking-widest">
                        {p.label}
                      </p>
                      <p className="text-lg font-black text-foreground tabular-nums">
                        {p.value || 0}
                      </p>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(p.value / Math.max(s?.totalSubCategories || 1, s?.totalPCategories || 1)) * 100 || 0}%`,
                        }}
                        transition={{ duration: 1 }}
                        className="h-full rounded-full"
                        style={{ background: p.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3.5 rounded-[1.5rem] bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-primary opacity-50" />
                    <span className="text-[10px] font-black uppercase text-primary/70">
                      Transactions
                    </span>
                  </div>
                  <span className="font-black text-primary text-sm">
                    {s?.totalTransactions || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-[1.5rem] bg-violet/5 border border-violet/10">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-violet opacity-50" />
                    <span className="text-[10px] font-black uppercase text-violet/70">
                      Sub-Admins
                    </span>
                  </div>
                  <span className="font-black text-violet text-sm">
                    {s?.totalSubAdmin || 0}
                  </span>
                </div>
              </div>
            </Section>
          </div>

          {/* ── Bottom Row: Lists ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section
              title="Recent Stream"
              sub="System activities"
              icon={History}
              delay={0.5}
            >
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                {d?.recentActivities?.map((a: any, i: number) => (
                  <div
                    key={a._id + i}
                    className="flex items-center gap-4 p-4 rounded-3xl bg-muted/5 border border-transparent hover:border-border transition-all"
                  >
                    <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black truncate">
                        {a.firstName} {a.lastName}
                      </p>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-50 truncate">
                        {a.role.replace("_", " ")} • {a.email}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[9px] font-black text-primary">
                        {format(new Date(a.updatedAt), "HH:mm")}
                      </p>
                      <p className="text-[8px] font-bold opacity-30 uppercase">
                        {format(new Date(a.updatedAt), "MMM dd")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section
              title="Top Performers"
              sub="Vendor fulfillment ranking"
              icon={Trophy}
              delay={0.55}
            >
              <div className="space-y-3">
                {d?.topVendors?.map((v: any, i: number) => (
                  <div
                    key={v._id + i}
                    className="flex items-center gap-4 p-4 rounded-3xl border border-border/50 group hover:border-primary/30 transition-all"
                  >
                    <div className="h-9 w-9 rounded-xl bg-amber/10 flex items-center justify-center text-amber text-sm font-black italic">
                      #{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
                        Vendor ID: {v._id.slice(-8).toUpperCase()}
                      </p>
                      <div className="flex gap-4 mt-0.5">
                        <span className="text-[10px] font-bold text-muted-foreground">
                          Orders:{" "}
                          <span className="text-foreground">
                            {v.totalOrders}
                          </span>
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground">
                          Revenue:{" "}
                          <span className="text-emerald-500">
                            ₹{v.totalRevenue}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-muted text-[9px] font-black text-muted-foreground uppercase">
                      {v.totalReviews} Revs
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function UserCircleIcon({ activity }: { activity: any }) {
  return (
    <div className="relative">
      <Users className="h-5 w-5" />
      {activity.role === "ADMIN" && (
        <div className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-primary border-2 border-card rounded-full" />
      )}
    </div>
  );
}

function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-full border border-border text-[10px] font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-10 pb-20 pt-6 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-lg opacity-40" />
        </div>
        <div className="flex gap-1.5 bg-muted/20 p-1.5 rounded-2xl border border-border/50">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-xl" />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* KPI Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-5 rounded-xl border border-border bg-card/40 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-4 w-12 rounded-full opacity-30" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-20 opacity-40" />
                <Skeleton className="h-8 w-32" />
              </div>
              <Skeleton className="h-3 w-full border-t border-border/30 pt-2" />
            </div>
          ))}
        </div>

        {/* Charts Row Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 p-6 rounded-xl border border-border bg-card/40 space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-64 opacity-30" />
                </div>
              </div>
            </div>
            <Skeleton className="h-[280px] w-full rounded-xl opacity-20" />
          </div>
          <div className="lg:col-span-4 p-6 rounded-xl border border-border bg-card/40 space-y-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-48 opacity-30" />
              </div>
            </div>
            <div className="flex flex-col items-center py-4 space-y-8">
              <Skeleton className="h-44 w-44 rounded-full opacity-20" />
              <div className="w-full space-y-3">
                <Skeleton className="h-10 w-full rounded-2xl opacity-10" />
                <Skeleton className="h-10 w-full rounded-2xl opacity-10" />
                <Skeleton className="h-10 w-full rounded-2xl opacity-10" />
              </div>
            </div>
          </div>
        </div>

        {/* Operational Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="p-6 rounded-xl border border-border bg-card/40 space-y-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-64 opacity-30" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                   <Skeleton className="h-40 w-full rounded-2xl opacity-20" />
                </div>
                <div className="space-y-3">
                   <Skeleton className="h-10 w-full rounded-xl opacity-10" />
                   <Skeleton className="h-10 w-full rounded-xl opacity-10" />
                   <Skeleton className="h-10 w-full rounded-xl opacity-10" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Rows Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="p-6 rounded-xl border border-border bg-card/40 space-y-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-64 opacity-30" />
                </div>
              </div>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="p-4 rounded-3xl border border-border/30 flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-2xl" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48 opacity-20" />
                    </div>
                    <Skeleton className="h-8 w-16 rounded-xl opacity-20" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

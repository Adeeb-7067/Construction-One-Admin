import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import {
  useGetFlashSalesQuery,
  useGetPlatformModulesQuery,
  useGetVendorsByModuleQuery,
  useGetProductsByVendorQuery,
  useGetProductVariantsQuery,
  useCreateFlashSaleMutation,
  useUpdateFlashSaleMutation,
  useCancelFlashSaleMutation,
} from "@/pages/Redux/apiSlice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";
import {
  Zap,
  Calendar,
  User,
  Store,
  Tag,
  Clock,
  Plus,
  Loader2,
  Trash2,
  Package,
  Percent,
  Boxes,
  XCircle,
} from "lucide-react";

/* ───────── helpers ───────── */
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const toLocalInput = (iso: string) => {
  const d = new Date(iso);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
};

const statusColor = (s: string) => {
  switch (s) {
    case "ACTIVE":
      return "bg-green-50 text-green-700 border-green-200";
    case "UPCOMING":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "COMPLETED":
      return "bg-slate-50 text-slate-600 border-slate-200";
    case "CANCELLED":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
};

/* ───────── types ───────── */
interface FlashItem {
  _id?: string;
  productId: string;
  variantId: string;
  flashDiscountPercent: number;
  allocatedStock: number;
  _productLabel?: string;
  _variantLabel?: string;
}

interface FormState {
  label: string;
  moduleId: string;
  vendorId: string;
  startDateTime: string;
  endDateTime: string;
  items: FlashItem[];
}

const emptyForm: FormState = {
  label: "",
  moduleId: "",
  vendorId: "",
  startDateTime: "",
  endDateTime: "",
  items: [],
};

/* ───────── columns ───────── */
const columns = [
  {
    key: "label",
    label: "Sale",
    render: (val: string) => <span className="font-medium">{val}</span>,
  },
  {
    key: "module",
    label: "Module",
    render: (_: any, row: any) => (
      <Badge variant="outline" className="text-xs font-normal">
        {row.module}
      </Badge>
    ),
  },
  { key: "vendor", label: "Vendor" },
  { key: "startDate", label: "Start" },
  { key: "endDate", label: "End" },
  { key: "createdByName", label: "Created By" },
  {
    key: "status",
    label: "Status",
    render: (val: string) => (
      <Badge 
        variant="outline" 
        className={`text-[10px] min-w-[80px] justify-center ${statusColor(val)}`}
      >
        {val}
      </Badge>
    ),
  },
];

/* ───────── detail row helper ───────── */
function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-muted/60 last:border-0">
      <div className="mt-0.5 p-1.5 rounded-md bg-muted/60">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm font-medium break-words">{value}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Item Selector – picks product → variant for one item
   ═══════════════════════════════════════════════════════ */
function ItemSelector({
  vendorId,
  item,
  index,
  onChange,
  onRemove,
  isEditing = false,
}: {
  vendorId: string;
  item: FlashItem;
  index: number;
  onChange: (i: number, patch: Partial<FlashItem>) => void;
  onRemove: (i: number) => void;
  isEditing?: boolean;
}) {
  const { data: productsRes, isLoading: loadingProducts } = useGetProductsByVendorQuery(vendorId, { skip: !vendorId });
  const { data: variantsRes, isLoading: loadingVariants } = useGetProductVariantsQuery(
    { vendorId, productId: item.productId },
    { skip: !vendorId || !item.productId }
  );

  const products = productsRes?.data?.products ?? productsRes?.data ?? [];
  const variants = variantsRes?.data?.variants ?? variantsRes?.data ?? [];

  return (
    <div className="rounded-xl border border-muted bg-muted/20 p-4 space-y-3 relative">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Item #{index + 1}
        </span>
        {!isEditing && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:bg-destructive/10"
            onClick={() => onRemove(index)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Product + Variant row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium">Product <span className="text-destructive">*</span></label>
          <Select
            value={item.productId}
            onValueChange={(v) => onChange(index, { productId: v, variantId: "", _variantLabel: "" })}
            disabled={isEditing}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder={loadingProducts ? "Loading…" : "Select product"} />
            </SelectTrigger>
            <SelectContent>
              {products.map((p: any) => (
                <SelectItem key={p._id} value={p._id}>
                  {p.title || p.name || p._id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium">Variant <span className="text-destructive">*</span></label>
          <Select
            value={item.variantId}
            onValueChange={(v) => onChange(index, { variantId: v })}
            disabled={!item.productId || isEditing}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder={loadingVariants ? "Loading…" : "Select variant"} />
            </SelectTrigger>
            <SelectContent>
              {variants.map((v: any) => (
                <SelectItem key={v._id} value={v._id}>
                  <div className="flex flex-col gap-0.5">
                 
                    <div className="flex items-center gap-2 text-sm ">
                      <span className="flex items-center gap-1">
                        Price: ₹{v.price || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        Stock: {v.stock || 0}
                      </span>
                      {v.packageWeight && (
                        <span className="flex items-center gap-1">
                          Wt: {v.packageWeight}kg
                        </span>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Discount + Stock row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium flex items-center gap-1">
            <Percent className="h-3 w-3" /> Discount % <span className="text-destructive">*</span>
          </label>
          <Input
            type="number"
            min={1}
            max={100}
            placeholder="e.g. 50"
            className="h-9"
            value={item.flashDiscountPercent || ""}
            onChange={(e) => onChange(index, { flashDiscountPercent: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium flex items-center gap-1">
            <Boxes className="h-3 w-3" /> Allocated Stock <span className="text-destructive">*</span>
          </label>
          <Input
            type="number"
            min={1}
            placeholder="e.g. 10"
            className="h-9"
            value={item.allocatedStock || ""}
            onChange={(e) => onChange(index, { allocatedStock: Number(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Main FlashSale Component
   ═══════════════════════════════════════════════════ */
export default function FlashSale() {
  const { data: response, isLoading } = useGetFlashSalesQuery(undefined);
  const [createFlashSale] = useCreateFlashSaleMutation();
  const [updateFlashSale] = useUpdateFlashSaleMutation();
  const [cancelFlashSale] = useCancelFlashSaleMutation();

  /* ── View dialog ── */
  const [viewSale, setViewSale] = useState<any>(null);

  /* ── Form dialog ── */
  const [formOpen, setFormOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<any>(null);
  const [form, setForm] = useState<FormState>({ ...emptyForm });
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ── Cancellation dialog ── */
  const [cancelRow, setCancelRow] = useState<any>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  /* ── Cascading queries ── */
  const { data: modulesRes } = useGetPlatformModulesQuery(undefined);
  const { data: vendorsRes, isFetching: fetchingVendors } = useGetVendorsByModuleQuery(form.moduleId, { skip: !form.moduleId });

  const modules = modulesRes?.data?.modules ?? modulesRes?.data ?? [];
  const vendors = vendorsRes?.data?.vendors ?? vendorsRes?.data ?? [];

  /* Cascade resets are handled inline in the Select onValueChange handlers */

  /* ── Transform API data for table ── */
  const rows = (response?.data?.flashSales ?? []).map((sale: any) => ({
    ...sale,
    id: sale._id,
    module: sale.moduleId?.title ?? "—",
    vendor: `${sale.vendorId?.firstName ?? ""} ${sale.vendorId?.lastName ?? ""}`.trim() || "—",
    vendorPhone: sale.vendorId?.phoneNumber ?? "—",
    startDate: fmtDate(sale.startDateTime),
    endDate: fmtDate(sale.endDateTime),
    createdByName: `${sale.createdBy?.firstName ?? ""} ${sale.createdBy?.lastName ?? ""}`.trim() || "—",
    createdByEmail: sale.createdBy?.email ?? "—",
    status: sale.status,
  }));

  /* ── Open create / edit ── */
  const openCreate = () => {
    setEditingSale(null);
    setForm({ ...emptyForm });
    setFormOpen(true);
  };

  const openEdit = (row: any) => {
    setEditingSale(row);
    const mappedItems = (row.items ?? []).map((it: any) => ({
      _id: it._id,
      productId: typeof it.productId === "object" ? it.productId._id : it.productId,
      variantId: typeof it.variantId === "object" ? it.variantId._id : it.variantId,
      flashDiscountPercent: it.flashDiscountPercent ?? 0,
      allocatedStock: it.allocatedStock ?? 0,
    }));
    setForm({
      label: row.label ?? "",
      moduleId: typeof row.moduleId === "object" ? row.moduleId._id : (row.moduleId ?? ""),
      vendorId: typeof row.vendorId === "object" ? row.vendorId._id : (row.vendorId ?? ""),
      startDateTime: row.startDateTime ? toLocalInput(row.startDateTime) : "",
      endDateTime: row.endDateTime ? toLocalInput(row.endDateTime) : "",
      items: mappedItems,
    });
    setFormOpen(true);
  };

  /* ── Item helpers ── */
  const addItem = () =>
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { productId: "", variantId: "", flashDiscountPercent: 0, allocatedStock: 0 },
      ],
    }));

  const updateItem = (idx: number, patch: Partial<FlashItem>) =>
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    }));

  const removeItem = (idx: number) =>
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!form.label.trim()) return toast.error("Sale label is required");
    if (!form.moduleId) return toast.error("Please select a module");
    if (!form.vendorId) return toast.error("Please select a vendor");
    if (!form.startDateTime || !form.endDateTime) return toast.error("Start and end dates are required");
    if (form.items.length === 0) return toast.error("Add at least one item");

    for (let i = 0; i < form.items.length; i++) {
      const it = form.items[i];
      if (!it.productId || !it.variantId) return toast.error(`Item #${i + 1}: select product and variant`);
      if (!it.flashDiscountPercent || it.flashDiscountPercent <= 0) return toast.error(`Item #${i + 1}: enter a valid discount`);
      if (!it.allocatedStock || it.allocatedStock <= 0) return toast.error(`Item #${i + 1}: enter allocated stock`);
    }

    const payload = {
      label: form.label.trim(),
      moduleId: form.moduleId,
      vendorId: form.vendorId,
      startDateTime: new Date(form.startDateTime).toISOString(),
      endDateTime: new Date(form.endDateTime).toISOString(),
      items: form.items.map(({ productId, variantId, flashDiscountPercent, allocatedStock }) => ({
        productId,
        variantId,
        flashDiscountPercent,
        allocatedStock,
      })),
    };

    setIsSubmitting(true);
    try {
      if (editingSale) {
        const updatePayload = {
          itemUpdates: form.items.map((it) => ({
            itemId: it._id,
            flashDiscountPercent: it.flashDiscountPercent,
            allocatedStock: it.allocatedStock,
          })),
          startDateTime: new Date(form.startDateTime).toISOString(),
          endDateTime: new Date(form.endDateTime).toISOString(),
        };

        await updateFlashSale({
          id: editingSale._id,
          data: updatePayload,
        }).unwrap();
        toast.success("Flash sale updated successfully");
      } else {
        await createFlashSale(payload).unwrap();
        toast.success("Flash sale created successfully");
      }
      setFormOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || `Failed to ${editingSale ? "update" : "create"} flash sale`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelSale = async () => {
    if (!cancelRow) return;
    setIsCancelling(true);
    try {
      await cancelFlashSale(cancelRow.id).unwrap();
      toast.success("Flash sale cancelled successfully");
      setCancelRow(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to cancel flash sale");
    } finally {
      setIsCancelling(false);
    }
  };

  /* ═══ Render ═══ */
  return (
    <div className="space-y-6">
      <PageHeader
        title="Flash Sales"
        description="Manage promotional flash sales"
        actions={
          <Button size="sm" onClick={openCreate} className="rounded-xl">
            <Plus className="h-4 w-4 mr-1" /> Create Sale
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={rows}
        isLoading={isLoading}
        onView={(row) => setViewSale(row)}
        onEdit={openEdit}
        extraActions={(row) => (
          (row.status === "ACTIVE" || row.status === "UPCOMING") && (
            <DropdownMenuItem
              className="gap-2 text-destructive focus:text-destructive cursor-pointer"
              onClick={() => setCancelRow(row)}
            >
              <XCircle className="h-3.5 w-3.5" /> Cancel Sale
            </DropdownMenuItem>
          )
        )}
      />

      {/* ─────── View Detail Dialog ─────── */}
      <Dialog open={!!viewSale} onOpenChange={() => setViewSale(null)}>
        <DialogContent className="sm:max-w-xl   p-0 overflow-hidden border-none shadow-2xl">
          {viewSale && (
            <div className="flex flex-col">
              {/* Header with status background */}
              <div className={`p-6 text-white relative overflow-hidden ${
                viewSale.status === 'ACTIVE' ? 'bg-emerald-600' : 
                viewSale.status === 'CANCELLED' ? 'bg-red-600' : 
                viewSale.status === 'COMPLETED' ? 'bg-slate-700' : 'bg-blue-600'
              }`}>
                <div className="relative z-10">
                  <Badge className={`mb-2 hover:opacity-90 border-none backdrop-blur-md ${
                    viewSale.status === 'ACTIVE' ? 'bg-green-500' : 
                    viewSale.status === 'CANCELLED' ? 'bg-red-500' : 
                    viewSale.status === 'COMPLETED' ? 'bg-slate-500' : 'bg-amber-500'
                  }`}>
                    <Zap className="h-3 w-3 mr-1 fill-current" /> {viewSale.status}
                  </Badge>
                  <h2 className="text-2xl font-bold tracking-tight">{viewSale.label}</h2>
                  <p className="text-white/80 text-sm mt-1 flex items-center gap-1.5">
                    <Store className="h-3.5 w-3.5" /> {viewSale.module} • {viewSale.vendor}
                  </p>
                </div>
                {/* Decorative background icon */}
                <Zap className="absolute -right-8 -bottom-8 h-48 w-48 opacity-10 rotate-12" />
              </div>

              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto bg-background">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Start Time</p>
                    <p className="text-sm font-medium flex items-center gap-2">
                       <Calendar className="h-3.5 w-3.5 text-primary" /> {fmtDateTime(viewSale.startDateTime)}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">End Time</p>
                    <p className="text-sm font-medium flex items-center gap-2">
                       <Calendar className="h-3.5 w-3.5 text-primary" /> {fmtDateTime(viewSale.endDateTime)}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Created By</p>
                    <p className="text-sm font-medium flex items-center gap-2 truncate">
                       <User className="h-3.5 w-3.5 text-primary" /> {viewSale.createdByName}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Vendor Contact</p>
                    <p className="text-sm font-medium flex items-center gap-2">
                       <Store className="h-3.5 w-3.5 text-primary" /> {viewSale.vendorPhone}
                    </p>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold flex items-center gap-2 px-1">
                    <Package className="h-4 w-4 text-primary" /> 
                    Sale Items ({viewSale.items?.length || 0})
                  </h3>
                  
                  <div className="space-y-2">
                    {viewSale.items?.map((it: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl border bg-card hover:bg-muted/10 transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {i + 1}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{it.productId?.name || "Product"}</p>
                            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                              Stock: <span className="font-medium text-foreground">{it.sold}/{it.allocatedStock}</span> sold
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-1.5 justify-end">
                            <span className="text-[10px] text-muted-foreground line-through">₹{it.basePriceSnapshot}</span>
                            <span className="text-sm font-bold text-emerald-600">₹{it.flashPrice}</span>
                          </div>
                          <Badge variant="outline" className="text-[9px] h-4 px-1.5 bg-emerald-50 text-emerald-700 border-emerald-200">
                            {it.flashDiscountPercent}% OFF
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t bg-muted/20 flex justify-end">
                <Button variant="outline" onClick={() => setViewSale(null)} className="rounded-xl px-6">
                  Close Detail
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ─────── Create / Edit Dialog ─────── */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              {editingSale ? "Edit Flash Sale" : "Create Flash Sale"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Label */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Sale Label <span className="text-destructive">*</span></label>
              <Input
                placeholder="e.g. Holi Mega Flash Sale"
                value={form.label}
                onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
                disabled={!!editingSale}
              />
            </div>

            {/* Module + Vendor */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Module <span className="text-destructive">*</span></label>
                <Select
                  value={form.moduleId}
                  onValueChange={(v) => setForm((p) => ({ ...p, moduleId: v, vendorId: "", items: [] }))}
                  disabled={!!editingSale}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select module" />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.map((m: any) => (
                      <SelectItem key={m._id} value={m._id}>
                        {m.title || m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Vendor <span className="text-destructive">*</span></label>
                <Select
                  value={form.vendorId}
                  onValueChange={(v) => setForm((p) => ({ ...p, vendorId: v, items: [] }))}
                  disabled={!form.moduleId || !!editingSale}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder={fetchingVendors ? "Loading…" : "Select vendor"} />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((v: any) => (
                      <SelectItem key={v._id} value={v._id}>
                        {`${v.firstName ?? ""} ${v.lastName ?? ""}`.trim() || v.phoneNumber || v._id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Start Date & Time <span className="text-destructive">*</span></label>
                <Input
                  type="datetime-local"
                  className="h-9"
                  value={form.startDateTime}
                  onChange={(e) => setForm((p) => ({ ...p, startDateTime: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">End Date & Time <span className="text-destructive">*</span></label>
                <Input
                  type="datetime-local"
                  className="h-9"
                  value={form.endDateTime}
                  onChange={(e) => setForm((p) => ({ ...p, endDateTime: e.target.value }))}
                />
              </div>
            </div>

            {/* ── Items Section ── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold flex items-center gap-1.5">
                  <Package className="h-4 w-4 text-primary" />
                  Sale Items
                </label>
                {!editingSale && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="rounded-xl h-8 text-xs"
                    onClick={addItem}
                    disabled={!form.vendorId}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add Item
                  </Button>
                )}
              </div>

              {!form.vendorId && (
                <p className="text-xs text-muted-foreground italic">Select a module and vendor first to add items.</p>
              )}

              {form.items.length === 0 && form.vendorId && (
                <div className="rounded-xl border border-dashed border-muted-foreground/30 py-8 text-center">
                  <Package className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">No items added yet</p>
                  <p className="text-xs text-muted-foreground/60">Click "Add Item" to add products to this flash sale</p>
                </div>
              )}

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {form.items.map((item, idx) => (
                  <ItemSelector
                    key={idx}
                    vendorId={form.vendorId}
                    item={item}
                    index={idx}
                    isEditing={!!editingSale}
                    onChange={updateItem}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setFormOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="rounded-xl px-8">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingSale ? "Update Sale" : "Create Sale"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─────── Cancellation Dialog ─────── */}
      <AlertDialog open={!!cancelRow} onOpenChange={(open) => !open && setCancelRow(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Flash Sale?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel <span className="font-semibold text-foreground">"{cancelRow?.label}"</span>? 
              This action cannot be undone and the sale will be stopped immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Keep Sale</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleCancelSale();
              }}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isCancelling}
            >
              {isCancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Cancellation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

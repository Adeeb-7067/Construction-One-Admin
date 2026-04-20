import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { useGetRFQsQuery } from "../Redux/apiSlice";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Eye,
  FileText,
  MapPin,
  Truck,
  IndianRupee,
  Calendar,
  User,
  Building2,
  Package,
  Phone,
  Mail,
  ClipboardList,
  CreditCard,
  StickyNote,
} from "lucide-react";

export default function RFQ() {
  const { data: response, isLoading } = useGetRFQsQuery(undefined);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedRFQ, setSelectedRFQ] = useState<any>(null);

  const rfqs = response?.data || [];

  const openViewDialog = (rfq: any) => {
    setSelectedRFQ(rfq);
    setViewDialogOpen(true);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const formatDate = (date: string) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "N/A";

  const statusColors: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    completed: "bg-blue-50 text-blue-700 border-blue-200",
    cancelled: "bg-slate-50 text-slate-700 border-slate-200",
  };

  const paymentTermsLabel: Record<string, string> = {
    "50_50": "50% Advance + 50% on Delivery",
    "100advance": "100% Advance",
    "100delivery": "100% on Delivery",
    cod: "Cash on Delivery",
  };

  const columns = [
    {
      key: "rfqNumber",
      label: "RFQ #",
      render: (value: string) => (
        <div className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-primary" />
          <span className="font-mono font-semibold text-xs">{value}</span>
        </div>
      ),
    },
    {
      key: "user",
      label: "Customer",
      render: (_: any, row: any) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">
            {row.userName || row.user?.name || "N/A"}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {row.userPhone || row.user?.phone || "N/A"}
          </span>
        </div>
      ),
    },
    {
      key: "vendor",
      label: "Vendor",
      render: (value: any) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">
            {value?.name || "N/A"}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {value?.phone || "N/A"}
          </span>
        </div>
      ),
    },
    {
      key: "items",
      label: "Items",
      render: (value: any[]) => (
        <div className="flex flex-col gap-0.5">
          {value?.slice(0, 2).map((item: any, i: number) => (
            <span key={i} className="text-xs">
              {item.productName}{" "}
              <span className="text-muted-foreground">×{item.quantity}</span>
            </span>
          ))}
          {value?.length > 2 && (
            <span className="text-[10px] text-muted-foreground">
              +{value.length - 2} more
            </span>
          )}
        </div>
      ),
    },
    {
      key: "targetPrice",
      label: "Target Price",
      render: (value: number) => (
        <span className="font-semibold text-sm">
          {value ? formatPrice(value) : "N/A"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge
          variant="outline"
          className={`text-[10px] min-w-[80px] justify-center capitalize ${statusColors[value] || "bg-gray-50 text-gray-700 border-gray-200"}`}
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(value)}
        </span>
      ),
    },
  ];

  // Detail row helper
  const DetailRow = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="flex items-start gap-3 py-2.5">
      <div className="flex-shrink-0 mt-0.5 h-8 w-8 rounded-lg bg-primary/5 flex items-center justify-center">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
          {label}
        </span>
        <span className="text-sm font-medium mt-0.5">{value || "N/A"}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="RFQ"
        description="Manage request for quotations"
      />
      <DataTable
        columns={columns}
        data={rfqs}
        isLoading={isLoading}
        extraActions={(row) => (
          <DropdownMenuItem
            className="gap-2 cursor-pointer"
            onClick={() => openViewDialog(row)}
          >
            <Eye className="h-3.5 w-3.5" /> View Details
          </DropdownMenuItem>
        )}
      />

      {/* View RFQ Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[620px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              RFQ Details
            </DialogTitle>
          </DialogHeader>
          {selectedRFQ && (
            <div className="space-y-5 pt-2">
              {/* RFQ Header */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-muted/30 border">
                <div className="flex flex-col gap-1">
                  <span className="font-mono font-bold text-lg">
                    {selectedRFQ.rfqNumber}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Created: {formatDate(selectedRFQ.createdAt)}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[11px] min-w-[90px] justify-center capitalize px-3 py-1 ${statusColors[selectedRFQ.status] || ""}`}
                >
                  {selectedRFQ.status}
                </Badge>
              </div>

              {/* Customer & Vendor */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border bg-card space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" /> Customer
                  </h4>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">
                      {selectedRFQ.userName || selectedRFQ.user?.name || "N/A"}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {selectedRFQ.userPhone || selectedRFQ.user?.phone || "N/A"}
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl border bg-card space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" /> Vendor
                  </h4>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">
                      {selectedRFQ.vendor?.name || "N/A"}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {selectedRFQ.vendor?.phone || "N/A"}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {selectedRFQ.vendor?.email || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-1">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider px-1 flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5" /> Items
                </h4>
                <div className="rounded-xl border bg-card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">
                          Product
                        </th>
                        <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">
                          Size
                        </th>
                        <th className="text-right p-3 text-xs font-semibold text-muted-foreground uppercase">
                          Qty
                        </th>
                        <th className="text-right p-3 text-xs font-semibold text-muted-foreground uppercase">
                          MOQ
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRFQ.items?.map((item: any, i: number) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="p-3">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {item.productName}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {item.specification}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-muted-foreground">
                            {item.size || "N/A"}
                          </td>
                          <td className="p-3 text-right font-semibold">
                            {item.quantity}
                          </td>
                          <td className="p-3 text-right text-muted-foreground">
                            {item.moqSnapshot || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Delivery & Payment Details */}
              <div className="space-y-1">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider px-1">
                  Delivery & Payment
                </h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-0 p-4 rounded-xl border bg-card">
                  <DetailRow
                    icon={MapPin}
                    label="Delivery Location"
                    value={selectedRFQ.deliveryLocation?.address}
                  />
                  <DetailRow
                    icon={Truck}
                    label="Delivery Type"
                    value={
                      <span className="capitalize">
                        {selectedRFQ.deliveryType}
                      </span>
                    }
                  />
                  <DetailRow
                    icon={Calendar}
                    label="Expected Delivery"
                    value={formatDate(selectedRFQ.expectedDeliveryDate)}
                  />
                  <DetailRow
                    icon={IndianRupee}
                    label="Target Price"
                    value={
                      selectedRFQ.targetPrice
                        ? formatPrice(selectedRFQ.targetPrice)
                        : "N/A"
                    }
                  />
                  <DetailRow
                    icon={CreditCard}
                    label="Payment Terms"
                    value={
                      paymentTermsLabel[selectedRFQ.paymentTerms] ||
                      selectedRFQ.paymentTerms
                    }
                  />
                  <DetailRow
                    icon={IndianRupee}
                    label="GST Preference"
                    value={
                      <span className="capitalize">
                        {selectedRFQ.gstPreference}
                      </span>
                    }
                  />
                  <DetailRow
                    icon={Truck}
                    label="Transport Preference"
                    value={
                      <span className="capitalize">
                        {selectedRFQ.transportPreference}
                      </span>
                    }
                  />
                </div>
              </div>

              {/* Note */}
              {selectedRFQ.note && (
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider px-1 flex items-center gap-1.5">
                    <StickyNote className="h-3.5 w-3.5" /> Note
                  </h4>
                  <div className="p-4 rounded-xl border bg-card">
                    <p className="text-sm text-muted-foreground">
                      {selectedRFQ.note}
                    </p>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1 pb-2">
                <span>Created: {formatDate(selectedRFQ.createdAt)}</span>
                <span>Updated: {formatDate(selectedRFQ.updatedAt)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import {
  useGetProductsQuery,
  useVerifyProductMutation,
  useToggleProductStatusMutation,
} from "../Redux/apiSlice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Eye,
  ShieldCheck,
  ShieldX,
  Loader2,
  Package,
  Truck,
  Star,
  IndianRupee,
  Tag,
  Building2,
  Clock,
  Undo2,
  Shield,
  Weight,
  Box,
} from "lucide-react";

export default function Products() {
  const { data: response, isLoading } = useGetProductsQuery(undefined);
  const [verifyProduct] = useVerifyProductMutation();
  const [toggleStatus] = useToggleProductStatusMutation();

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  // Unverify dialog state
  const [unverifyDialogOpen, setUnverifyDialogOpen] = useState(false);
  const [unverifyProductId, setUnverifyProductId] = useState<string | null>(null);
  const [unverifyReason, setUnverifyReason] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const products = (response?.data?.products || []).map((p: any) => ({
    ...p,
    status: p.disable === true || p.status !== "ACTIVE" ? "Disabled" : "Active",
  }));

  const handleVerify = async (id: string) => {
    if (!id) return;
    setIsVerifying(true);
    try {
      await verifyProduct({ id, body: { varified: true } }).unwrap();
      toast.success("Product verified successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to verify product");
    } finally {
      setIsVerifying(false);
    }
  };

  const openUnverifyDialog = (id: string) => {
    setUnverifyProductId(id);
    setUnverifyReason("");
    setUnverifyDialogOpen(true);
  };

  const handleUnverify = async () => {
    if (!unverifyProductId || !unverifyReason.trim()) {
      toast.error("Please provide a reason for unverification");
      return;
    }
    setIsVerifying(true);
    try {
      await verifyProduct({
        id: unverifyProductId,
        body: { varified: false, reason: unverifyReason.trim() },
      }).unwrap();
      toast.success("Product unverified successfully");
      setUnverifyDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to unverify product");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    if (!id) return;
    setUpdatingStatusId(id);
    try {
      await toggleStatus(id).unwrap();
      toast.success("Product status updated");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update product status");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const openViewDialog = (product: any) => {
    setSelectedProduct(product);
    setViewDialogOpen(true);
  };

  const getDefaultVariant = (product: any) => {
    return product?.defaultVariant?.[0] || {};
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const columns = [
    {
      key: "name",
      label: "Product",
      render: (value: string, row: any) => (
        <div className="flex flex-col">
          <span className="font-medium">{value || "N/A"}</span>
          <span className="text-[10px] text-muted-foreground uppercase">
            {row.slug}
          </span>
        </div>
      ),
    },
    {
      key: "brandId",
      label: "Brand",
      render: (value: any) => (
        <Badge
          variant="outline"
          className="text-[10px] min-w-[70px] justify-center bg-primary/5 text-primary border-primary/20"
        >
          {value?.name || "N/A"}
        </Badge>
      ),
    },
    {
      key: "defaultVariant",
      label: "Price",
      render: (_: any, row: any) => {
        const variant = getDefaultVariant(row);
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-sm">
              {variant.price ? formatPrice(variant.price) : "N/A"}
            </span>
            {variant.mrp && variant.mrp !== variant.price && (
              <span className="text-[10px] text-muted-foreground line-through">
                MRP: {formatPrice(variant.mrp)}
              </span>
            )}
            {variant.discount > 0 && (
              <Badge className="w-fit mt-0.5 text-[9px] px-1.5 py-0 h-4 bg-success/10 text-success border-success/20 rounded-full">
                {variant.discount}% OFF
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      key: "defaultVariant",
      label: "Type",
      render: (_: any, row: any) => {
        const variant = getDefaultVariant(row);
        const typeColors: Record<string, string> = {
          RETAIL: "bg-blue-50 text-blue-700 border-blue-200",
          BULK: "bg-amber-50 text-amber-700 border-amber-200",
        };
        return (
          <Badge
            variant="outline"
            className={`text-[10px] min-w-[70px] justify-center ${typeColors[variant.Type] || "bg-gray-50 text-gray-600 border-gray-200"}`}
          >
            {variant.Type || "N/A"}
          </Badge>
        );
      },
    },
    {
      key: "sold",
      label: "Sold",
      render: (value: number) => (
        <span className="text-sm font-medium">{value || 0}</span>
      ),
    },
    {
      key: "vendorCompany",
      label: "Vendor",
      render: (value: any) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {value?.companyName || "N/A"}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {value?.businessCategory}
          </span>
        </div>
      ),
    },
    {
      key: "varified",
      label: "Verification",
      render: (value: boolean) => (
        <Badge
          variant="outline"
          className={`text-[10px] min-w-[80px] justify-center ${
            value 
              ? "bg-green-50 text-green-700 border-green-200" 
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}
        >
          {value ? "Verified" : "Pending"}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (_: any, row: any) => {
        const isDisabled = row.status === "Disabled";
        return (
          <div
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Badge
              variant="outline"
              className={`text-[10px] min-w-[70px] justify-center ${
                isDisabled
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-green-50 text-green-700 border-green-200"
              }`}
            >
              {isDisabled ? "Disabled" : "Active"}
            </Badge>
            <Switch
              checked={!isDisabled}
              onCheckedChange={() => handleToggleStatus(row._id)}
              disabled={updatingStatusId === row._id}
            />
            {updatingStatusId === row._id && (
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
            )}
          </div>
        );
      },
    },
  ];

  // View Dialog Detail Row helper
  const DetailRow = ({
    icon: Icon,
    label,
    value,
    className = "",
  }: {
    icon: any;
    label: string;
    value: React.ReactNode;
    className?: string;
  }) => (
    <div className={`flex items-start gap-3 py-2.5 ${className}`}>
      <div className="flex-shrink-0 mt-0.5 h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
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
        title="Products"
        description="Manage marketplace products, verification, and status"
      />
      <DataTable
        columns={columns}
        data={products}
        isLoading={isLoading}
        extraActions={(row) => (
          <>
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={() => openViewDialog(row)}
            >
              <Eye className="h-3.5 w-3.5" /> View Product
            </DropdownMenuItem>
            {row.varified ? (
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => openUnverifyDialog(row._id)}
              >
                <ShieldX className="h-3.5 w-3.5 text-warning" /> Unverify Product
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => handleVerify(row._id)}
              >
                <ShieldCheck className="h-3.5 w-3.5 text-success" /> Verify Product
              </DropdownMenuItem>
            )}
          </>
        )}
      />

      {/* View Product Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Product Details
            </DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-5 pt-2">
              {/* Product Header */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-muted/50 border">
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-bold">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedProduct.metaData?.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedProduct.metaData?.keywords?.map(
                      (kw: string, i: number) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-[9px] px-1.5 py-0 h-4.5 bg-primary/10 text-primary border-primary/20"
                        >
                          {kw}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <Badge
                    className={`rounded-full ${selectedProduct.varified ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"}`}
                  >
                    {selectedProduct.varified ? "Verified" : "Pending"}
                  </Badge>
                  <Badge
                    className={`rounded-full ${selectedProduct.disable ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-success/10 text-success border-success/20"}`}
                  >
                    {selectedProduct.disable ? "Disabled" : "Active"}
                  </Badge>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="space-y-1">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider px-1">
                  Pricing & Variant
                </h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-0 p-4 rounded-xl border bg-card">
                  <DetailRow
                    icon={IndianRupee}
                    label="Price"
                    value={
                      getDefaultVariant(selectedProduct).price
                        ? formatPrice(
                            getDefaultVariant(selectedProduct).price
                          )
                        : "N/A"
                    }
                  />
                  <DetailRow
                    icon={Tag}
                    label="MRP"
                    value={
                      getDefaultVariant(selectedProduct).mrp
                        ? formatPrice(
                            getDefaultVariant(selectedProduct).mrp
                          )
                        : "N/A"
                    }
                  />
                  <DetailRow
                    icon={Tag}
                    label="Discount"
                    value={
                      getDefaultVariant(selectedProduct).discount
                        ? `${getDefaultVariant(selectedProduct).discount}%`
                        : "No discount"
                    }
                  />
                  <DetailRow
                    icon={Package}
                    label="Type"
                    value={getDefaultVariant(selectedProduct).Type}
                  />
                  <DetailRow
                    icon={Weight}
                    label="Package Weight"
                    value={
                      getDefaultVariant(selectedProduct).packageWeight
                        ? `${getDefaultVariant(selectedProduct).packageWeight} kg`
                        : "N/A"
                    }
                  />
                  <DetailRow
                    icon={Box}
                    label="Dimensions"
                    value={
                      getDefaultVariant(selectedProduct).packageDimensions ||
                      "N/A"
                    }
                  />
                </div>
              </div>

              {/* Product Info Section */}
              <div className="space-y-1">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider px-1">
                  Product Info
                </h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-0 p-4 rounded-xl border bg-card">
                  <DetailRow
                    icon={Tag}
                    label="Brand"
                    value={selectedProduct.brandId?.name}
                  />
                  <DetailRow
                    icon={Package}
                    label="Measurement Unit"
                    value={selectedProduct.measurementUnit}
                  />
                  <DetailRow
                    icon={Clock}
                    label="Lead Time"
                    value={selectedProduct.leadTime}
                  />
                  <DetailRow
                    icon={Truck}
                    label="Delivery Charges"
                    value={
                      selectedProduct.deliveryCharges === "fixedCharge"
                        ? `Fixed: ${formatPrice(selectedProduct.shippingCharges?.fixed || 0)}`
                        : selectedProduct.deliveryCharges
                    }
                  />
                  <DetailRow
                    icon={Undo2}
                    label="Return Policy"
                    value={selectedProduct.returnPolicy}
                  />
                  <DetailRow
                    icon={Shield}
                    label="Warranty"
                    value={selectedProduct.warrantyPeriod}
                  />
                  <DetailRow
                    icon={Star}
                    label="Avg Rating"
                    value={
                      selectedProduct.avgRating
                        ? `${selectedProduct.avgRating} ★ (${selectedProduct.reviewCount || 0} reviews)`
                        : `No ratings (${selectedProduct.reviewCount || 0} reviews)`
                    }
                  />
                  <DetailRow
                    icon={Package}
                    label="Units Sold"
                    value={selectedProduct.sold || 0}
                  />
                </div>
              </div>

              {/* Specification */}
              {selectedProduct.specification && (
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider px-1">
                    Specification
                  </h4>
                  <div className="p-4 rounded-xl border bg-card">
                    <p className="text-sm text-muted-foreground">
                      {selectedProduct.specification}
                    </p>
                  </div>
                </div>
              )}

              {/* Vendor Section */}
              {selectedProduct.vendorCompany && (
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider px-1">
                    Vendor Information
                  </h4>
                  <div className="p-4 rounded-xl border bg-card space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-sm">
                          {selectedProduct.vendorCompany.companyName}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-info/10 text-info border-info/20 rounded-full"
                      >
                        {selectedProduct.vendorCompany.companyType}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProduct.vendorCompany?.badges?.map(
                        (b: string) => {
                          const badgeColors: Record<string, string> = {
                            "TOP VENDOR":
                              "bg-warning/10 text-warning border-warning/20",
                            "MOST SOLD":
                              "bg-success/10 text-success border-success/20",
                            "FAST DELIVERY":
                              "bg-info/10 text-info border-info/20",
                            "HIGH RATING":
                              "bg-primary/10 text-primary border-primary/20",
                          };
                          return (
                            <Badge
                              key={b}
                              variant="outline"
                              className={`text-[9px] px-1.5 py-0 h-4.5 uppercase font-bold tracking-tighter ${badgeColors[b] || "bg-primary/5"}`}
                            >
                              {b}
                            </Badge>
                          );
                        }
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Contact: {selectedProduct.vendorCompany.contactNumber} •
                      GST: {selectedProduct.vendorCompany.gstNumber}
                    </div>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1 pb-2">
                <span>
                  Created:{" "}
                  {new Date(selectedProduct.createdAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </span>
                <span>
                  Updated:{" "}
                  {new Date(selectedProduct.updatedAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Unverify Reason Dialog */}
      <Dialog open={unverifyDialogOpen} onOpenChange={setUnverifyDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldX className="h-5 w-5 text-amber-500" />
              Unverify Product
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Please provide a reason for unverifying this product. This will be recorded and the vendor will be notified.
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason <span className="text-destructive">*</span></label>
              <Textarea
                placeholder="Enter reason for unverification..."
                value={unverifyReason}
                onChange={(e) => setUnverifyReason(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setUnverifyDialogOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUnverify}
              disabled={isVerifying || !unverifyReason.trim()}
              variant="destructive"
              className="rounded-xl px-8"
            >
              {isVerifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Unverify Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

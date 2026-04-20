import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { 
  useGetVendorsQuery, 
  useVerifyVendorMutation, 
  useToggleVendorStatusMutation,
  useAssignVendorBadgesMutation,
  useRemoveVendorBadgesMutation
} from "../Redux/apiSlice";
import { Button } from "@/components/ui/button";
import { Plus, Eye, ShieldCheck, ShieldX, Ban, CheckCircle2, Award, Loader2, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

const AVAILABLE_BADGES = [
  "TOP VENDOR",
  "MOST SOLD",
  "FAST DELIVERY",
  "HIGH RATING",
  "TRUSTED SELLER",
  "ADMIN PICK",
];

export default function Vendors() {
  const navigate = useNavigate();
  const { data: response, isLoading } = useGetVendorsQuery(undefined);
  const [verifyVendor] = useVerifyVendorMutation();
  const [toggleStatus] = useToggleVendorStatusMutation();
  const [assignBadge] = useAssignVendorBadgesMutation();
  const [removeBadge] = useRemoveVendorBadgesMutation();

  const [badgeDialogOpen, setBadgeDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [isUpdatingBadges, setIsUpdatingBadges] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  const vendors = (response?.data || []).map((v: any) => {
    const vData = v?.vendor || v?.vendorId;
    const isDisabled = vData?.isDisabled || vData?.disable;
    return {
      ...v,
      status: isDisabled ? "Disabled" : "Active"
    };
  });

  // Robust helper to get vendor object from either 'vendor' or 'vendorId'
  const getVendorData = (row: any) => row?.vendor || row?.vendorId;

  const handleVerify = async (id: string) => {
    if (!id) return;
    try {
      await verifyVendor(id).unwrap();
      toast.success("Vendor verification status updated");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to verify vendor");
    }
  };

  const handleToggleStatus = async (id: string) => {
    if (!id) return;
    setUpdatingStatusId(id);
    try {
      await toggleStatus(id).unwrap();
      toast.success("Vendor status updated");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update vendor status");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const openBadgeDialog = (vendor: any) => {
    setSelectedVendor(vendor);
    setSelectedBadges(vendor.badges || []);
    setBadgeDialogOpen(true);
  };

  const handleBadgeToggle = (badge: string) => {
    setSelectedBadges(prev => 
      prev.includes(badge) ? prev.filter(b => b !== badge) : [...prev, badge]
    );
  };

  const handleSaveBadges = async () => {
    const vendorObj = getVendorData(selectedVendor);
    if (!selectedVendor || !vendorObj?._id) return;
    
    setIsUpdatingBadges(true);
    try {
      const currentBadges = selectedVendor.badges || [];
      const toAdd = selectedBadges.filter(b => !currentBadges.includes(b));
      const toRemove = currentBadges.filter(b => !selectedBadges.includes(b));

      if (toAdd.length > 0) {
        await assignBadge({ id: vendorObj._id, badges: toAdd }).unwrap();
      }
      if (toRemove.length > 0) {
        await removeBadge({ id: vendorObj._id, badges: toRemove }).unwrap();
      }
      
      toast.success("Badges updated successfully");
      setBadgeDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update badges");
    } finally {
      setIsUpdatingBadges(false);
    }
  };

  const columns = [
    { 
      key: "shopName", 
      label: "Shop",
      render: (value: string, row: any) => (
        <div className="flex flex-col">
          <span className="font-medium">{value || row.companyName || "N/A"}</span>
          <span className="text-[10px] text-muted-foreground uppercase">{row.businessCategory}</span>
        </div>
      )
    },
    { 
      key: "vendor", 
      label: "Vendor",
      render: (_: any, row: any) => {
        const v = getVendorData(row);
        return v?.name || (v?.firstName ? `${v.firstName} ${v.lastName}` : "N/A");
      }
    },
    { 
      key: "vendor", 
      label: "Contact",
      render: (_: any, row: any) => getVendorData(row)?.phoneNumber || getVendorData(row)?.contactNumber || "N/A"
    },
    { 
      key: "createdAt", 
      label: "Joined",
      render: (value: string) => value ? new Date(value).toLocaleDateString() : "N/A"
    },
    {
      key: "totalReviews",
      label: "Reviews",
      render: (value: number) => (
        <div className="flex items-center gap-1.5">
          <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
          <span className="text-sm font-medium">{value || 0}</span>
        </div>
      )
    },
    {
      key: "badges",
      label: "Badges",
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1 max-w-[180px]">
          {value?.map(b => {
             const badgeColors: Record<string, string> = {
              "TOP VENDOR": "bg-amber-50 text-amber-700 border-amber-200",
              "MOST SOLD": "bg-green-50 text-green-700 border-green-200",
              "FAST DELIVERY": "bg-blue-50 text-blue-700 border-blue-200",
              "HIGH RATING": "bg-indigo-50 text-indigo-700 border-indigo-200",
              "TRUSTED SELLER": "bg-teal-50 text-teal-700 border-teal-200",
              "ADMIN PICK": "bg-rose-50 text-rose-700 border-rose-200",
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
          })}
          {(!value || value.length === 0) && <span className="text-[10px] text-muted-foreground italic">No badges</span>}
        </div>
      )
    },
    { 
      key: "vendor", 
      label: "Verification",
      render: (_: any, row: any) => {
        const v = getVendorData(row);
        const verified = v?.isAdminVerified;
        return (
          <Badge 
            variant="outline" 
            className={`text-[10px] min-w-[75px] justify-center gap-1 ${
              verified 
                ? "bg-green-50 text-green-700 border-green-200" 
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
             {verified ? <ShieldCheck className="h-3 w-3" /> : <ShieldX className="h-3 w-3" />}
             {verified ? "Verified" : "Pending"}
          </Badge>
        );
      }
    },
    { 
      key: "status", 
      label: "Status",
      render: (value: string, row: any) => {
        const v = getVendorData(row);
        const isActive = value === "Active";
        return (
          <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <Badge 
              variant="outline" 
              className={`text-[10px] min-w-[70px] justify-center ${
                !isActive 
                  ? "bg-red-50 text-red-700 border-red-200" 
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}
            >
              {value}
            </Badge>
            <Switch
              checked={isActive}
              onCheckedChange={() => handleToggleStatus(v?._id)}
              disabled={updatingStatusId === v?._id}
            />
            {updatingStatusId === v?._id && (
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
            )}
          </div>
        );
      }
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendors"
        description="Manage marketplace vendors, verification, and badges"
      />
      <DataTable
        columns={columns}
        data={vendors}
        isLoading={isLoading}
        onRowClick={(row) => navigate(`/marketplace/vendors/${getVendorData(row)?._id}`)}
        extraActions={(row) => {
          const v = getVendorData(row);
          return (
            <>
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate(`/marketplace/vendors/${v?._id}`)}>
                <Eye className="h-3.5 w-3.5" /> View Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleVerify(v?._id)}>
                {v?.isAdminVerified ? (
                  <><ShieldX className="h-3.5 w-3.5 text-amber-500" /> Unverify Vendor</>
                ) : (
                  <><ShieldCheck className="h-3.5 w-3.5 text-green-500" /> Verify Vendor</>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => openBadgeDialog(row)}>
                <Award className="h-3.5 w-3.5 text-primary" /> Manage Badges
              </DropdownMenuItem>
            </>
          );
        }}
      />

      <Dialog open={badgeDialogOpen} onOpenChange={setBadgeDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Manage Vendor Badges
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold">{selectedVendor?.shopName || selectedVendor?.companyName}</span>
              <p className="text-xs text-muted-foreground">Select badges to assign or remove</p>
            </div>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {AVAILABLE_BADGES.map((badge) => (
                <div key={badge} className="flex items-center space-x-3 p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all">
                  <Checkbox 
                    id={`badge-${badge}`} 
                    checked={selectedBadges.includes(badge)}
                    onCheckedChange={() => handleBadgeToggle(badge)}
                    className="h-5 w-5"
                  />
                  <label htmlFor={`badge-${badge}`} className="text-sm font-medium leading-none cursor-pointer flex-1">
                    {badge}
                  </label>
                  {selectedBadges.includes(badge) && (
                    <Badge variant="default" className="text-[10px] h-5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">Active</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setBadgeDialogOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSaveBadges} disabled={isUpdatingBadges} className="rounded-xl px-8">
              {isUpdatingBadges ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

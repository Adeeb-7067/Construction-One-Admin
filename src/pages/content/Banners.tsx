import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { BannerForm } from "./components/BannerForm";
import { 
  useGetBannersQuery, 
  useDeleteBannerMutation, 
  useToggleBannerStatusMutation 
} from "../Redux/apiSlice";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-hot-toast";
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

export default function Banners() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: bannersData, isLoading } = useGetBannersQuery(undefined);
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();
  const [toggleStatus] = useToggleBannerStatusMutation();

  const handleEdit = (banner: any) => {
    setSelectedBanner(banner);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedBanner(null);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteBanner(deleteId).unwrap();
      toast.success("Banner deleted successfully");
      setDeleteId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete banner");
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatus(id).unwrap();
      toast.success("Status updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const columns = [
    { 
      key: "image", 
      label: "Image",
      render: (val: string) => (
        <div className="h-12 w-24 rounded overflow-hidden bg-muted flex items-center justify-center">
          {val ? <img src={val} alt="Banner" className="h-full w-full object-cover" /> : "No Image"}
        </div>
      )
    },
    { key: "title", label: "Title" },
    { key: "page", label: "Page" },
    { key: "position", label: "Position" },
    { key: "order", label: "Order" },
    { 
      key: "status", 
      label: "Status",
      render: (value: string, row: any) => {
        const isActive = value === "Active";
        return (
          <div className="flex items-center gap-3">
            <Badge 
              variant={isActive ? "default" : "secondary"} 
              className={`text-[10px] min-w-[60px] justify-center ${
                isActive 
                  ? "bg-green-50 text-green-700 border-green-200" 
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {value}
            </Badge>
            <Switch 
              checked={isActive} 
              onCheckedChange={() => handleToggleStatus(row._id)} 
            />
          </div>
        );
      }
    },
  ];

  const bannersDataList = bannersData?.data?.banners || bannersData?.data || [];
  const banners = Array.isArray(bannersDataList) ? bannersDataList.map((b: any) => ({
    ...b,
    status: b.isActive ? "Active" : "Inactive"
  })) : [];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Banners" 
        description="Manage promotional banners" 
        actions={
          <Button size="sm" onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-1" /> Add Banner
          </Button>
        } 
      />
      
      <DataTable 
        columns={columns} 
        data={banners} 
        isLoading={isLoading} 
        onEdit={handleEdit}
        onDelete={(row) => setDeleteId(row._id)}
      />

      <BannerForm 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        banner={selectedBanner} 
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the banner.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


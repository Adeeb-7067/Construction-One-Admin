import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useGetBrandsQuery, useUpdateBrandStatusMutation, useDeleteBrandMutation } from "../Redux/apiSlice";
import { BrandForm } from "./components/BrandForm";
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

export default function Brands() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<any>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  const { data: brandsResponse, isLoading } = useGetBrandsQuery(undefined);
  const [updateBrandStatus] = useUpdateBrandStatusMutation();
  const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation();

  const handleToggleStatus = async (id: string) => {
    setUpdatingStatusId(id);
    try {
      await updateBrandStatus(id).unwrap();
      toast.success("Status updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleDeleteClick = (brand: any) => {
    setBrandToDelete(brand);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!brandToDelete) return;
    try {
      await deleteBrand(brandToDelete._id).unwrap();
      toast.success("Brand deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete brand");
    } finally {
      setDeleteDialogOpen(false);
      setBrandToDelete(null);
    }
  };

  const handleCreate = () => {
    setSelectedBrand(null);
    setFormOpen(true);
  };

  const handleEdit = (brand: any) => {
    setSelectedBrand(brand);
    setFormOpen(true);
  };

  const columns = [
    {
      key: "logo",
      label: "Logo",
      render: (value: string, row: any) => (
        <div className="h-10 w-10 rounded-lg border bg-muted/50 p-1">
          {value ? (
            <img src={value} alt={row.name} className="h-full w-full object-contain" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-[10px] font-bold text-muted-foreground uppercase">
              {row.name?.substring(0, 2)}
            </div>
          )}
        </div>
      ),
    },
    { key: "name", label: "Brand", fontMedium: true },
    {
      key: "status",
      label: "Status",
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          <Badge 
            variant={value === "active" ? "default" : "secondary"} 
            className={`text-[10px] min-w-[70px] justify-center capitalize ${
              value === "active" 
                ? "bg-green-50 text-green-700 border-green-200" 
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {value}
          </Badge>
          <Switch
            checked={value === "active"}
            onCheckedChange={() => handleToggleStatus(row._id)}
            disabled={updatingStatusId === row._id}
          />
          {updatingStatusId === row._id && (
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
          )}
        </div>
      ),
    },
  ];

  const brands = brandsResponse?.data?.brands || [];

  return (
    <div>
      <PageHeader
        title="Brands"
        description="Manage product brands"
        actions={<Button size="sm" onClick={handleCreate}><Plus className="h-4 w-4 mr-1" /> Add Brand</Button>}
      />
      
      <DataTable 
        columns={columns} 
        data={brands} 
        isLoading={isLoading}
        onDelete={handleDeleteClick}
        onEdit={handleEdit}
      />

      <BrandForm 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        brand={selectedBrand} 
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the brand
              <span className="font-semibold text-foreground mx-1">"{brandToDelete?.name}"</span>
              and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

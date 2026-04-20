import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, User, Loader2, Trash2, Edit } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { 
  useGetSubAdminsQuery, 
  useCreateSubAdminMutation, 
  useUpdateSubAdminMutation, 
  useDeleteSubAdminMutation,
  useToggleSubAdminStatusMutation
} from "../Redux/apiSlice";
import { SubAdminForm } from "./SubAdminForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { toast } from "react-hot-toast";

export default function SubAdmin() {
  const [formOpen, setFormOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedSubAdmin, setSelectedSubAdmin] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subAdminToDelete, setSubAdminToDelete] = useState<any>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const { data, isLoading } = useGetSubAdminsQuery({});
  const [createSubAdmin, { isLoading: isCreating }] = useCreateSubAdminMutation();
  const [updateSubAdmin, { isLoading: isUpdating }] = useUpdateSubAdminMutation();
  const [deleteSubAdmin, { isLoading: isDeleting }] = useDeleteSubAdminMutation();
  const [toggleStatus] = useToggleSubAdminStatusMutation();
  
  const subAdmins = data?.subAdmins?.map((admin: any) => ({
    ...admin,
    status: admin.isDisabled ? "Disabled" : "Active"
  })) || [];

  const handleCreate = async (formData: any) => {
    try {
      await createSubAdmin({ ...formData, role: "SUB_ADMIN" }).unwrap();
      toast.success("Sub-Admin created successfully");
      setFormOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create sub-admin");
    }
  };

  const handleUpdate = async (formData: any) => {
    try {
      await updateSubAdmin({ id: selectedSubAdmin._id, data: formData }).unwrap();
      toast.success("Sub-Admin updated successfully");
      setFormOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update sub-admin");
    }
  };

  const handleDelete = async () => {
    if (!subAdminToDelete) return;
    try {
      await deleteSubAdmin(subAdminToDelete._id).unwrap();
      toast.success("Sub-Admin deleted successfully");
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete sub-admin");
    }
  };

  const handleToggleStatus = async (id: string) => {
    setTogglingId(id);
    try {
      await toggleStatus(id).unwrap();
      toast.success("Status updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to toggle status");
    } finally {
      setTogglingId(null);
    }
  };

  const openCreateModal = () => {
    setIsEdit(false);
    setSelectedSubAdmin(null);
    setFormOpen(true);
  };

  const openEditModal = (subAdmin: any) => {
    setIsEdit(true);
    setSelectedSubAdmin(subAdmin);
    setFormOpen(true);
  };

  const openDeleteDialog = (subAdmin: any) => {
    setSubAdminToDelete(subAdmin);
    setDeleteDialogOpen(true);
  };

  const columns = [
    { 
      key: "name", 
      label: "Name",
      render: (_: any, row: any) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-semibold text-foreground">{row.firstName} {row.lastName}</div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-tight">ID: {row._id?.slice(-8)}</div>
          </div>
        </div>
      )
    },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "gender", label: "Gender" },
    { 
      key: "role", 
      label: "Role",
      render: (value: string) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground capitalize">
          {value.replace('_', ' ').toLowerCase()}
        </span>
      )
    },
    { 
      key: "status", 
      label: "Status",
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium ${row.isDisabled ? "text-destructive" : "text-green-600"}`}>
            {value}
          </span>
          <Switch 
            checked={!row.isDisabled} 
            onCheckedChange={() => handleToggleStatus(row._id)}
            disabled={togglingId === row._id}
          />
          {togglingId === row._id && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Sub Admins" 
        description="Manage and monitor sub-admin accounts and their permissions" 
        actions={
          <Button onClick={openCreateModal} size="sm" className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" /> 
            Add Sub Admin
          </Button>
        } 
      />
      <DataTable 
        columns={columns} 
        data={subAdmins} 
        isLoading={isLoading}
        searchable={true}
        onEdit={openEditModal}
        onDelete={openDeleteDialog}
      />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Sub-Admin" : "Create New Sub-Admin"}</DialogTitle>
          </DialogHeader>
          <SubAdminForm 
            isEdit={isEdit}
            initialData={selectedSubAdmin}
            isLoading={isCreating || isUpdating}
            onSubmit={isEdit ? handleUpdate : handleCreate}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the sub-admin account for
              <span className="font-semibold text-foreground mx-1">
                "{subAdminToDelete?.firstName} {subAdminToDelete?.lastName}"
              </span>
              and revoke all access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              {isDeleting ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

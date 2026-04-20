import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { useGetPlatformModulesQuery, useDeletePlatformModuleMutation, useUpdateModuleStatusMutation, useUpdateModuleVisibilityMutation } from "../Redux/apiSlice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModuleForm } from "./components/ModuleForm";
import { toast } from "react-hot-toast";
import { Loader2, Plus } from "lucide-react";

import { Switch } from "@/components/ui/switch";
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

const Module = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<any>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [updatingVisibilityId, setUpdatingVisibilityId] = useState<string | null>(null);

  const { data, isLoading, error } = useGetPlatformModulesQuery(undefined);
  const [deletePlatformModule, { isLoading: isDeleting }] = useDeletePlatformModuleMutation();
  const [updateModuleStatus] = useUpdateModuleStatusMutation();
  const [updateModuleVisibility] = useUpdateModuleVisibilityMutation();

  const handleToggleStatus = async (id: string) => {
    setUpdatingStatusId(id);
    try {
      await updateModuleStatus(id).unwrap();
      toast.success(`Module status updated successfully`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleToggleVisibility = async (id: string) => {
    setUpdatingVisibilityId(id);
    try {
      await updateModuleVisibility(id).unwrap();
      toast.success(`Module visibility updated successfully`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update visibility");
    } finally {
      setUpdatingVisibilityId(null);
    }
  };

  const columns = [
    {
      key: "title",
      label: "Module",
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          {row.icon && (
            <div className="h-10 w-10 rounded-lg border bg-muted/50 p-1">
              <img src={row.icon} alt={value} className="h-full w-full object-contain" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{value}</span>
            <span className="text-[11px] text-muted-foreground uppercase">{row.slug}</span>
          </div>
        </div>
      ),
    },
    { key: "type", label: "Type" },
    { key: "routePath", label: "Route Path" },
    { key: "order", label: "Order", sortable: true },
    {
      key: "isActive",
      label: "Status",
      render: (value: boolean, row: any) => (
        <div className="flex gap-2">
          <Badge variant={value ? "default" : "secondary"} className={`text-[10px] ${value ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
            {value ? "Active" : "Inactive"}
          </Badge>
          <Badge variant={row.isVisible ? "outline" : "secondary"} className={`text-[10px] ${row.isVisible ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
            {row.isVisible ? "Visible" : "Hidden"}
          </Badge>
        </div>
      ),
    },
    {
      key: "status_toggle",
      label: "Toggle Status",
      render: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.isActive}
            onCheckedChange={() => handleToggleStatus(row._id)}
            disabled={updatingStatusId === row._id}
          />
          {updatingStatusId === row._id && (
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
          )}
        </div>
      ),
    },
    {
      key: "visibility_toggle",
      label: "Toggle Visibility",
      render: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.isVisible}
            onCheckedChange={() => handleToggleVisibility(row._id)}
            disabled={updatingVisibilityId === row._id}
          />
          {updatingVisibilityId === row._id && (
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
          )}
        </div>
      ),
    },
  ];

  const handleCreate = () => {
    setSelectedModule(null);
    setFormOpen(true);
  };

  const handleEdit = (module: any) => {
    setSelectedModule(module);
    setFormOpen(true);
  };

  const handleDeleteClick = (module: any) => {
    setModuleToDelete(module);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!moduleToDelete) return;
    try {
      await deletePlatformModule(moduleToDelete._id).unwrap();
      toast.success("Module deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete module");
    } finally {
      setDeleteDialogOpen(false);
      setModuleToDelete(null);
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Platform Modules" description="Manage system modules and their availability" />
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-destructive">
          Error loading modules. Please try again later.
        </div>
      </div>
    );
  }

  const modules = data?.data?.modules || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Modules"
        description="Manage system modules and their availability"
        actions={
          <Button onClick={handleCreate} size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Add Module
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={modules}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        isLoading={isLoading}
      />

      <ModuleForm
        open={formOpen}
        onOpenChange={setFormOpen}
        module={selectedModule}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the module
              <span className="font-semibold text-foreground mx-1">"{moduleToDelete?.title}"</span>
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

export default Module
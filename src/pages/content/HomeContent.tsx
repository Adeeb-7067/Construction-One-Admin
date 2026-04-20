import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { 
  useGetHomeSectionsQuery,
  useDeleteHomeSectionMutation,
  useToggleHomeSectionStatusMutation,
  useGetPlatformModulesQuery
} from "../Redux/apiSlice";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2, Power } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HomeSectionForm } from "./components/HomeSectionForm";
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
import { Switch } from "@/components/ui/switch";

export default function HomeContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: sectionsRes, isLoading } = useGetHomeSectionsQuery(undefined);
  const { data: modulesRes } = useGetPlatformModulesQuery(undefined);
  const [deleteSection] = useDeleteHomeSectionMutation();
  const [toggleStatus] = useToggleHomeSectionStatusMutation();

  const handleOpenAdd = () => {
    setEditingSection(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (section: any) => {
    setEditingSection(section);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteSection(deletingId).unwrap();
      toast.success("Section deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete section");
    } finally {
      setDeletingId(null);
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

  const moduleMap = modulesRes?.data?.modules?.reduce((acc: any, module: any) => {
    acc[module._id] = module.title;
    return acc;
  }, {}) || {};

  const columns = [
    { 
      key: "title", 
      label: "Title",
      render: (val: string, row: any) => (
        <div className="flex flex-col">
          <span className="font-medium">{val || "No Title"}</span>
          <span className="text-[10px] text-muted-foreground">{row.key}</span>
        </div>
      )
    },
    { 
      key: "moduleId", 
      label: "Module",
      render: (val: string) => <span className="text-xs">{moduleMap[val] || val}</span>
    },
    { 
      key: "type", 
      label: "Type",
      render: (val: string) => (
        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-medium">
          {val?.replace("_", " ") || val}
        </span>
      )
    },
    { key: "limit", label: "Limit" },
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

  const sectionsData = sectionsRes?.data?.sections || [];
  const sections = sectionsData.map((s: any) => ({
    ...s,
    status: s.isActive ? "Active" : "Inactive"
  }));

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Home Page Content" 
        description="Manage sections and layouts of the home page"
        actions={
          <Button onClick={handleOpenAdd} className="gap-2">
            <Plus className="h-4 w-4" /> Add Section
          </Button>
        }
      />

      <DataTable 
        columns={columns} 
        data={sections} 
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={(row) => setDeletingId(row._id)}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingSection ? "Edit Section" : "Add New Section"}</DialogTitle>
          </DialogHeader>
          <HomeSectionForm 
            initialData={editingSection} 
            onSuccess={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the section from the home page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


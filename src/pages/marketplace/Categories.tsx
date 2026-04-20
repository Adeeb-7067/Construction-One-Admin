import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryForm } from "./components/CategoryForm";
import { 
  useGetCategoryTreeQuery, 
  useDeleteParentCategoryMutation, 
  useUpdateParentCategoryStatusMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryStatusMutation,
  useDeleteSubCategoryMutation,
  useUpdateSubCategoryStatusMutation,
  useDeleteProductTypeMutation,
  useUpdateProductTypeStatusMutation
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

export default function Categories() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"parent" | "category" | "sub" | "productType">("parent");

  const { data: treeResponse, isLoading: isLoadingTree } = useGetCategoryTreeQuery(undefined);
  
  const [deleteParent, { isLoading: isDeletingParent }] = useDeleteParentCategoryMutation();
  const [deleteCat, { isLoading: isDeletingCat }] = useDeleteCategoryMutation();
  const [deleteSub, { isLoading: isDeletingSub }] = useDeleteSubCategoryMutation();

  const [updateParentStatus] = useUpdateParentCategoryStatusMutation();
  const [updateCatStatus] = useUpdateCategoryStatusMutation();
  const [updateSubStatus] = useUpdateSubCategoryStatusMutation();
  const [updateProductTypeStatus] = useUpdateProductTypeStatusMutation();

  const handleToggleStatus = async (id: string, level: "parent" | "category" | "sub" | "productType") => {
    setUpdatingStatusId(id);
    try {
      if (level === "parent") await updateParentStatus(id).unwrap();
      else if (level === "category") await updateCatStatus(id).unwrap();
      else if (level === "sub") await updateSubStatus(id).unwrap();
      else await updateProductTypeStatus(id).unwrap();
      toast.success("Status updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleDeleteClick = (category: any) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      if (activeTab === "parent") await deleteParent(categoryToDelete._id).unwrap();
      else if (activeTab === "category") await deleteCat(categoryToDelete._id).unwrap();
      else if (activeTab === "sub") await deleteSub(categoryToDelete._id).unwrap();
      else await deleteProductType(categoryToDelete._id).unwrap();
      toast.success("Category deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete category");
    } finally {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setFormOpen(true);
  };

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setFormOpen(true);
  };


  const [deleteProductType, { isLoading: isDeletingPT }] = useDeleteProductTypeMutation();
  const isDeleting = isDeletingParent || isDeletingCat || isDeletingSub || isDeletingPT;

  const getColumns = (level: "parent" | "category" | "sub" | "productType") => [
    {
      key: level === "productType" ? "typeName" : "name",
      label: "Name",
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          {row.image && (
            <div className="h-10 w-10 rounded-lg border bg-muted/50 p-1">
              <img src={row.image} alt={value} className="h-full w-full object-contain" />
            </div>
          )}
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    { key: "order", label: "Order", sortable: true, hidden: level === "productType" },
    {
      key: "status",
      label: "Status",
      render: (value: string, row: any) => {
        const isActive = value === "Active";
        return (
          <div className="flex items-center gap-3">
            <Badge 
              variant={isActive ? "default" : "secondary"} 
              className={`text-[10px] min-w-[75px] justify-center ${
                isActive 
                  ? "bg-green-50 text-green-700 border-green-200" 
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {value}
            </Badge>
            <Switch
              checked={isActive}
              onCheckedChange={() => handleToggleStatus(row._id, level)}
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

  const parents = (treeResponse?.data || []).map((p: any) => ({
    ...p,
    status: p.isActive ? "Active" : "Inactive"
  }));
  
  const midCategories = parents.flatMap((parent: any) => 
    (parent.categories || []).map((cat: any) => ({
      ...cat,
      status: cat.isActive ? "Active" : "Inactive",
      parentName: parent.name,
    }))
  );

  const subs = parents.flatMap((parent: any) => 
    (parent.categories || []).flatMap((cat: any) => 
      (cat.subCategories || []).map((sub: any) => ({
        ...sub,
        status: sub.isActive ? "Active" : "Inactive",
        parentName: cat.name,
        grandParentName: parent.name,
      }))
    )
  );

  const productTypes = parents.flatMap((parent: any) => 
    (parent.categories || []).flatMap((cat: any) => 
      (cat.subCategories || []).flatMap((sub: any) => 
        (sub.productTypes || []).map((pt: any) => ({
          ...pt,
          status: pt.status ? "Active" : "Inactive", // Convert boolean status to string
          subCategoryName: sub.name,
          categoryName: cat.name,
          parentName: parent.name,
        }))
      )
    )
  );



  return (
    <div>
      <PageHeader
        title="Categories"
        description="Manage hierarchical product categories"
        actions={<Button size="sm" onClick={handleCreate}><Plus className="h-4 w-4 mr-1" /> Add Category</Button>}
      />
      <Tabs defaultValue="parent" className="w-full" onValueChange={(v: any) => setActiveTab(v)}>
        <TabsList>
          <TabsTrigger value="parent">Parent Categories</TabsTrigger>
          <TabsTrigger value="category">Categories</TabsTrigger>
          <TabsTrigger value="sub">Sub Categories</TabsTrigger>
          <TabsTrigger value="productType">Product Types</TabsTrigger>
        </TabsList>

        <TabsContent value="parent" className="mt-4">
          <DataTable 
            columns={getColumns("parent")} 
            data={parents} 
            isLoading={isLoadingTree}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </TabsContent>

        <TabsContent value="category" className="mt-4">
          <DataTable 
            columns={[
              ...getColumns("category").slice(0, 1),
              { key: "parentName", label: "Parent Category", render: (v: string) => <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">{v}</Badge> },
              ...getColumns("category").slice(1)
            ]} 
            data={midCategories} 
            isLoading={isLoadingTree}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </TabsContent>

        <TabsContent value="sub" className="mt-4">
          <DataTable 
            columns={[
              ...getColumns("sub").slice(0, 1),
              { key: "parentName", label: "Category", render: (v: string) => <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">{v}</Badge> },
              ...getColumns("sub").slice(1)
            ]} 
            data={subs} 
            isLoading={isLoadingTree}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </TabsContent>

        <TabsContent value="productType" className="mt-4">
          <DataTable 
            columns={[
              ...getColumns("productType").slice(0, 1),
              { key: "subCategoryName", label: "Sub Category", render: (v: string) => <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">{v}</Badge> },
              { key: "categoryName", label: "Category", render: (v: string) => <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">{v}</Badge> },
              ...getColumns("productType").slice(1).filter(c => !c.hidden)
            ]} 
            data={productTypes} 
            isLoading={isLoadingTree}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </TabsContent>
      </Tabs>

      <CategoryForm 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        category={selectedCategory} 
        level={activeTab}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the 
              <span className="font-semibold text-foreground mx-1">"{categoryToDelete?.name || categoryToDelete?.typeName}"</span>
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

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { 
  useGetCountriesQuery, 
  useDeleteCountryMutation, 
  useUpdateCountryStatusMutation 
} from "../Redux/apiSlice";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { CountryForm } from "./components/CountryForm";
import { toast } from "react-hot-toast";
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
import { Badge } from "@/components/ui/badge";

export default function Countries() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState<any>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { data, isLoading } = useGetCountriesQuery(undefined);
  const [deleteCountry, { isLoading: isDeleting }] = useDeleteCountryMutation();
  const [updateStatus] = useUpdateCountryStatusMutation();

  const handleToggleStatus = async (id: string) => {
    setUpdatingId(id);
    try {
      await updateStatus(id).unwrap();
      toast.success("Status updated successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteClick = (country: any) => {
    setCountryToDelete(country);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!countryToDelete) return;
    try {
      await deleteCountry(countryToDelete._id).unwrap();
      toast.success("Country deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete country");
    } finally {
      setDeleteDialogOpen(false);
      setCountryToDelete(null);
    }
  };

  const handleEdit = (country: any) => {
    setSelectedCountry(country);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedCountry(null);
    setFormOpen(true);
  };

  const columns = [
    { key: "name", label: "Country" },
    { key: "code", label: "Code" },
    { 
      key: "status", 
      label: "Status",
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          <Badge 
            variant="outline" 
            className={`text-[10px] min-w-[70px] justify-center capitalize font-medium ${
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
            disabled={updatingId === row._id}
          />
          {updatingId === row._id && (
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
          )}
        </div>
      )
    },
  ];

  const countries = data?.data?.countries || [];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Countries" 
        description="Manage countries" 
        actions={
          <Button onClick={handleCreate} size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Add Country
          </Button>
        } 
      />
      
      <DataTable 
        columns={columns} 
        data={countries} 
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        isLoading={isLoading}
      />

      <CountryForm 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        country={selectedCountry} 
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the country
              <span className="font-semibold text-foreground mx-1">"{countryToDelete?.name}"</span>
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

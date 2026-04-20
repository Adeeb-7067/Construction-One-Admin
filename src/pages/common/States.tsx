import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import {
  useGetStatesQuery,
  useDeleteStateMutation,
  useUpdateStateStatusMutation,
  useGetCountriesQuery
} from "../Redux/apiSlice";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { StateForm } from "./components/StateForm";
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

export default function States() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stateToDelete, setStateToDelete] = useState<any>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { data, isLoading } = useGetStatesQuery(undefined);
  const { data: countriesData } = useGetCountriesQuery(undefined);
  const [deleteState, { isLoading: isDeleting }] = useDeleteStateMutation();
  const [updateStatus] = useUpdateStateStatusMutation();

  const getCountryName = (country: any) => {
    if (!country) return "N/A";
    if (typeof country === "object") return country.name || "N/A";

    const countryObj = countriesData?.data?.countries?.find((c: any) => c._id === country);
    return countryObj?.name || country; // Fallback to ID if not found and still loading
  };

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

  const handleDeleteClick = (state: any) => {
    setStateToDelete(state);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!stateToDelete) return;
    try {
      await deleteState(stateToDelete._id).unwrap();
      toast.success("State deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete state");
    } finally {
      setDeleteDialogOpen(false);
      setStateToDelete(null);
    }
  };

  const handleEdit = (state: any) => {
    setSelectedState(state);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedState(null);
    setFormOpen(true);
  };

  const columns = [
    { key: "name", label: "State" },
    { key: "code", label: "Code" },
    {
      key: "countryId",
      label: "Country",
      render: (country: any) => getCountryName(country)
    },
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
      ),
    },
  ];

  const states = data?.data?.states || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="States"
        description="Manage states"
        actions={
          <Button onClick={handleCreate} size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Add State
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={states}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        isLoading={isLoading}
      />

      <StateForm
        open={formOpen}
        onOpenChange={setFormOpen}
        state={selectedState}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the state
              <span className="font-semibold text-foreground mx-1">"{stateToDelete?.name}"</span>
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

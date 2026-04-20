import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import {
  useGetCitiesQuery,
  useDeleteCityMutation,
  useUpdateCityStatusMutation,
  useGetStatesQuery,
  useGetCountriesQuery
} from "../Redux/apiSlice";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { CityForm } from "./components/CityForm";
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

export default function Cities() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cityToDelete, setCityToDelete] = useState<any>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { data, isLoading } = useGetCitiesQuery(undefined);
  const { data: statesData } = useGetStatesQuery(undefined);
  const { data: countriesData } = useGetCountriesQuery(undefined);

  const [deleteCity, { isLoading: isDeleting }] = useDeleteCityMutation();
  const [updateStatus] = useUpdateCityStatusMutation();

  const getCountryName = (country: any) => {
    if (!country) return "N/A";
    if (typeof country === "object") return country.name || "N/A";
    const countryObj = countriesData?.data?.countries?.find((c: any) => c._id === country);
    return countryObj?.name || country;
  };

  const getStateName = (state: any) => {
    if (!state) return "N/A";
    if (typeof state === "object") return state.name || "N/A";
    const stateObj = statesData?.data?.states?.find((s: any) => s._id === state);
    return stateObj?.name || state;
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

  const handleDeleteClick = (city: any) => {
    setCityToDelete(city);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!cityToDelete) return;
    try {
      await deleteCity(cityToDelete._id).unwrap();
      toast.success("City deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete city");
    } finally {
      setDeleteDialogOpen(false);
      setCityToDelete(null);
    }
  };

  const handleEdit = (city: any) => {
    setSelectedCity(city);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedCity(null);
    setFormOpen(true);
  };

  const columns = [
    { key: "name", label: "City" },
    {
      key: "stateId",
      label: "State",
      render: (state: any) => getStateName(state)
    },
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

  const cities = data?.data?.cities || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cities"
        description="Manage cities"
        actions={
          <Button onClick={handleCreate} size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Add City
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={cities}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        isLoading={isLoading}
      />

      <CityForm
        open={formOpen}
        onOpenChange={setFormOpen}
        city={selectedCity}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the city
              <span className="font-semibold text-foreground mx-1">"{cityToDelete?.name}"</span>
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

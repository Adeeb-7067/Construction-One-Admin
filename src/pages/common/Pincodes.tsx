import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import {
  useGetPincodesQuery,
  useDeletePincodeMutation,
  useUpdatePincodeStatusMutation,
  useGetCitiesQuery,
  useGetStatesQuery,
  useGetCountriesQuery
} from "../Redux/apiSlice";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { PincodeForm } from "./components/PincodeForm";
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

export default function Pincodes() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPincode, setSelectedPincode] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pincodeToDelete, setPincodeToDelete] = useState<any>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { data, isLoading } = useGetPincodesQuery(undefined);
  const { data: citiesData } = useGetCitiesQuery(undefined);
  const { data: statesData } = useGetStatesQuery(undefined);
  const { data: countriesData } = useGetCountriesQuery(undefined);

  const [deletePincode, { isLoading: isDeleting }] = useDeletePincodeMutation();
  const [updateStatus] = useUpdatePincodeStatusMutation();

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

  const getCityName = (city: any) => {
    if (!city) return "N/A";
    if (typeof city === "object") return city.name || "N/A";
    const cityObj = citiesData?.data?.cities?.find((c: any) => c._id === city);
    return cityObj?.name || city;
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

  const handleDeleteClick = (pincode: any) => {
    setPincodeToDelete(pincode);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pincodeToDelete) return;
    try {
      await deletePincode(pincodeToDelete._id).unwrap();
      toast.success("Pincode deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete pincode");
    } finally {
      setDeleteDialogOpen(false);
      setPincodeToDelete(null);
    }
  };

  const handleEdit = (pincode: any) => {
    setSelectedPincode(pincode);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedPincode(null);
    setFormOpen(true);
  };

  const columns = [
    { key: "code", label: "Pincode" },
    {
      key: "cityId",
      label: "City",
      render: (cityId: any) => getCityName(cityId)
    },
    {
      key: "stateId",
      label: "State",
      render: (stateId: any) => getStateName(stateId)
    },
    {
      key: "countryId",
      label: "Country",
      render: (countryId: any) => getCountryName(countryId)
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
      )
    },
  ];

  const pincodes = data?.data?.pincodes || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pincodes"
        description="Manage pincodes"
        actions={
          <Button onClick={handleCreate} size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Add Pincode
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={pincodes}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        isLoading={isLoading}
      />

      <PincodeForm
        open={formOpen}
        onOpenChange={setFormOpen}
        pincode={selectedPincode}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the pincode
              <span className="font-semibold text-foreground mx-1">"{pincodeToDelete?.code}"</span>
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

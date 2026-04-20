import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { 
  useCreatePincodeMutation, 
  useUpdatePincodeMutation, 
  useGetCountriesQuery,
  useGetStatesQuery,
  useGetCitiesQuery
} from "../../Redux/apiSlice";

const schema = z.object({
  pincodes: z.string().min(4, "Enter at least one pincode"),
  countryId: z.string().min(1, "Country selection is required"),
  stateId: z.string().min(1, "State selection is required"),
  cityId: z.string().min(1, "City selection is required"),
});

type FormData = z.infer<typeof schema>;

interface PincodeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pincode?: any; 
}

export function PincodeForm({ open, onOpenChange, pincode }: PincodeFormProps) {
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const [selectedStateId, setSelectedStateId] = useState<string>("");

  const { data: countriesData, isLoading: isLoadingCountries } = useGetCountriesQuery(undefined);
  
  const { data: statesData, isLoading: isLoadingStates } = useGetStatesQuery(selectedCountryId, {
    skip: !selectedCountryId,
  });

  const { data: citiesData, isLoading: isLoadingCities } = useGetCitiesQuery(selectedStateId, {
    skip: !selectedStateId,
  });

  const [createPincode, { isLoading: isCreating }] = useCreatePincodeMutation();
  const [updatePincode, { isLoading: isUpdating }] = useUpdatePincodeMutation();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      pincodes: "",
      countryId: "",
      stateId: "",
      cityId: "",
    },
  });

  useEffect(() => {
    if (pincode && open) {
      const countryId = pincode.countryId?._id || pincode.countryId || "";
      const stateId = pincode.stateId?._id || pincode.stateId || "";
      const cityId = pincode.cityId?._id || pincode.cityId || "";
      
      setSelectedCountryId(countryId);
      setSelectedStateId(stateId);
      
      form.reset({
        pincodes: pincode.code || "",
        countryId,
        stateId,
        cityId,
      });
    } else if (!open) {
      setSelectedCountryId("");
      setSelectedStateId("");
      form.reset({
        pincodes: "",
        countryId: "",
        stateId: "",
        cityId: "",
      });
    }
  }, [pincode, open, form]);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        pincodes: data.pincodes.split(",").map((p: string) => p.trim()).filter((p: string) => p !== ""),
      };

      if (pincode) {
        await updatePincode({ id: pincode._id, data: payload }).unwrap();
        toast.success("Pincode updated successfully");
      } else {
        await createPincode(payload).unwrap();
        toast.success("Pincodes created successfully");
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save pincode");
    }
  };

  const countries = countriesData?.data?.countries || [];
  const states = statesData?.data?.states || [];
  const cities = citiesData?.data?.cities || [];
  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{pincode ? "Edit Pincode" : "Add New Pincode"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="countryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select 
                    onValueChange={(val) => {
                      field.onChange(val);
                      setSelectedCountryId(val);
                      setSelectedStateId("");
                      form.setValue("stateId", "");
                      form.setValue("cityId", "");
                    }} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingCountries ? "Loading..." : "Select country"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[200px]">
                      {countries.map((country: any) => (
                        <SelectItem key={country._id} value={country._id}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select 
                    onValueChange={(val) => {
                      field.onChange(val);
                      setSelectedStateId(val);
                      form.setValue("cityId", "");
                    }} 
                    defaultValue={field.value}
                    value={field.value}
                    disabled={!selectedCountryId || isLoadingStates}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          !selectedCountryId ? "Select country first" : 
                          isLoadingStates ? "Loading states..." : 
                          "Select state"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[200px]">
                      {states.map((state: any) => (
                        <SelectItem key={state._id} value={state._id}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                    disabled={!selectedStateId || isLoadingCities}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          !selectedStateId ? "Select state first" : 
                          isLoadingCities ? "Loading cities..." : 
                          "Select city"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[200px]">
                      {cities.map((city: any) => (
                        <SelectItem key={city._id} value={city._id}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pincodes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pincode(s) / Zip Code(s)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 462001, 462002 (comma separated)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {pincode ? "Update Pincode" : "Create Pincode"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

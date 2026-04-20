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
  useCreateCityMutation, 
  useUpdateCityMutation, 
  useGetCountriesQuery,
  useGetStatesQuery
} from "../../Redux/apiSlice";

const schema = z.object({
  name: z.string().min(2, "City name must be at least 2 characters"),
  countryId: z.string().min(1, "Country selection is required"),
  stateId: z.string().min(1, "State selection is required"),
});

type FormData = z.infer<typeof schema>;

interface CityFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  city?: any; 
}

export function CityForm({ open, onOpenChange, city }: CityFormProps) {
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");

  const { data: countriesData, isLoading: isLoadingCountries } = useGetCountriesQuery(undefined);
  // Fetch states filtered by countryId
  const { data: statesData, isLoading: isLoadingStates } = useGetStatesQuery(selectedCountryId, {
    skip: !selectedCountryId,
  });

  const [createCity, { isLoading: isCreating }] = useCreateCityMutation();
  const [updateCity, { isLoading: isUpdating }] = useUpdateCityMutation();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      countryId: "",
      stateId: "",
    },
  });

  useEffect(() => {
    if (city && open) {
      const cId = city.countryId?._id || city.countryId || "";
      setSelectedCountryId(cId);
      form.reset({
        name: city.name || "",
        countryId: cId,
        stateId: city.stateId?._id || city.stateId || "",
      });
    } else if (!open) {
      setSelectedCountryId("");
      form.reset({
        name: "",
        countryId: "",
        stateId: "",
      });
    }
  }, [city, open, form]);

  const onSubmit = async (data: FormData) => {
    try {
      if (city) {
        await updateCity({ id: city._id, data }).unwrap();
        toast.success("City updated successfully");
      } else {
        await createCity(data).unwrap();
        toast.success("City created successfully");
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save city");
    }
  };

  const countries = countriesData?.data?.countries || [];
  const states = statesData?.data?.states || [];
  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{city ? "Edit City" : "Add New City"}</DialogTitle>
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
                      form.setValue("stateId", ""); // Reset state when country changes
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
                    onValueChange={field.onChange} 
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Bhopal" {...field} />
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
                {city ? "Update City" : "Create City"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

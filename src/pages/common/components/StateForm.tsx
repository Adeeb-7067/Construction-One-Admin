import { useEffect } from "react";
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
  useCreateStateMutation, 
  useUpdateStateMutation, 
  useGetCountriesQuery 
} from "../../Redux/apiSlice";

const schema = z.object({
  name: z.string().min(2, "State name must be at least 2 characters"),
  code: z.string().min(1, "Code is required").max(5, "Code is too long"),
  countryId: z.string().min(1, "Country selection is required"),
});

type FormData = z.infer<typeof schema>;

interface StateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  state?: any; 
}

export function StateForm({ open, onOpenChange, state }: StateFormProps) {
  const { data: countriesData, isLoading: isLoadingCountries } = useGetCountriesQuery(undefined);
  const [createState, { isLoading: isCreating }] = useCreateStateMutation();
  const [updateState, { isLoading: isUpdating }] = useUpdateStateMutation();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      code: "",
      countryId: "",
    },
  });

  useEffect(() => {
    if (state && open) {
      form.reset({
        name: state.name || "",
        code: state.code || "",
        countryId: state.countryId?._id || state.countryId || "",
      });
    } else if (!open) {
      form.reset({
        name: "",
        code: "",
        countryId: "",
      });
    }
  }, [state, open, form]);

  const onSubmit = async (data: FormData) => {
    try {
      if (state) {
        await updateState({ id: state._id, data }).unwrap();
        toast.success("State updated successfully");
      } else {
        await createState(data).unwrap();
        toast.success("State created successfully");
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save state");
    }
  };

  const countries = countriesData?.data?.countries || [];
  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{state ? "Edit State" : "Add New State"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="countryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Country</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingCountries ? "Loading..." : "Select country"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Madhya Pradesh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. MP" {...field} />
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
                {state ? "Update State" : "Create State"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

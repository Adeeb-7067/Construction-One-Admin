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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useCreateCountryMutation, useUpdateCountryMutation } from "../../Redux/apiSlice";

const schema = z.object({
  name: z.string().min(2, "Country name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters").max(5, "Code is too long"),
});

type FormData = z.infer<typeof schema>;

interface CountryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  country?: any; 
}

export function CountryForm({ open, onOpenChange, country }: CountryFormProps) {
  const [createCountry, { isLoading: isCreating }] = useCreateCountryMutation();
  const [updateCountry, { isLoading: isUpdating }] = useUpdateCountryMutation();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  useEffect(() => {
    if (country && open) {
      form.reset({
        name: country.name || "",
        code: country.code || "",
      });
    } else if (!open) {
      form.reset({
        name: "",
        code: "",
      });
    }
  }, [country, open, form]);

  const onSubmit = async (data: FormData) => {
    try {
      if (country) {
        await updateCountry({ id: country._id, formData: data }).unwrap();
        toast.success("Country updated successfully");
      } else {
        await createCountry(data).unwrap();
        toast.success("Country created successfully");
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save country");
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{country ? "Edit Country" : "Add New Country"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. India" {...field} />
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
                  <FormLabel>Country Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. IND" {...field} />
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
                {country ? "Update Country" : "Create Country"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  useGetPlatformModulesQuery,
  useCreateHomeSectionMutation,
  useUpdateHomeSectionMutation 
} from "../../Redux/apiSlice";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  moduleId: z.string().min(1, "Module is required"),
  key: z.string().min(1, "Key is required"),
  title: z.string().optional(),
  type: z.enum(["BANNER", "FLASH_SALE", "CATEGORY_LIST", "PRODUCT_LIST", "BRAND_LIST", "VENDOR_LIST"]),
  sourceType: z.enum(["ALL", "FEATURED"]),
  limit: z.number().min(1, "Limit must be at least 1"),
  order: z.number().min(1, "Order must be at least 1"),
  isActive: z.boolean().default(true),
});

type HomeSectionFormValues = z.infer<typeof formSchema>;

interface HomeSectionFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function HomeSectionForm({ initialData, onSuccess, onCancel }: HomeSectionFormProps) {
  const { data: modulesRes } = useGetPlatformModulesQuery(undefined);
  const [createHomeSection, { isLoading: isCreating }] = useCreateHomeSectionMutation();
  const [updateHomeSection, { isLoading: isUpdating }] = useUpdateHomeSectionMutation();

  const form = useForm<HomeSectionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      moduleId: initialData?.moduleId || "",
      key: initialData?.key || "",
      title: initialData?.title || "",
      type: initialData?.type || "BANNER",
      sourceType: initialData?.sourceType || "ALL",
      limit: initialData?.limit || 5,
      order: initialData?.order || 1,
      isActive: initialData?.isActive ?? true,
    },
  });

  const onSubmit = async (values: HomeSectionFormValues) => {
    try {
      if (initialData) {
        await updateHomeSection({ id: initialData._id, data: values }).unwrap();
        toast.success("Home section updated successfully");
      } else {
        await createHomeSection(values).unwrap();
        toast.success("Home section created successfully");
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="moduleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Module</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a module" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {modulesRes?.data?.modules?.map((module: any) => (
                      <SelectItem key={module._id} value={module._id}>
                        {module.title}
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
            name="key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. hero-banners" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Top Banners" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BANNER">Banner</SelectItem>
                    <SelectItem value="FLASH_SALE">Flash Sale</SelectItem>
                    <SelectItem value="CATEGORY_LIST">Category List</SelectItem>
                    <SelectItem value="PRODUCT_LIST">Product List</SelectItem>
                    <SelectItem value="BRAND_LIST">Brand List</SelectItem>
                    <SelectItem value="VENDOR_LIST">Vendor List</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sourceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ALL">All</SelectItem>
                    <SelectItem value="FEATURED">Featured</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Limit</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Active Status</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Section" : "Create Section"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

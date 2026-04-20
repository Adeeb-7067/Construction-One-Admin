import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload } from "lucide-react";
import { toast } from "react-hot-toast";
import { 
  useGetPlatformModulesQuery, 
  useGetParentCategoriesQuery,
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation
} from "../../Redux/apiSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  name: z.string().min(2, "Brand name must be at least 2 characters"),
  moduleId: z.string().min(1, "Module is required"),
  pcategoryId: z.string().min(1, "Parent Category is required"),
  categoryId: z.string().min(1, "Category is required"),
  subcategoryId: z.string().min(1, "Sub-Category is required"),
  description: z.string().optional(),
  logo: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

interface BrandFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand?: any;
}

export function BrandForm({ open, onOpenChange, brand }: BrandFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      moduleId: "",
      pcategoryId: "",
      categoryId: "",
      subcategoryId: "",
      description: "",
    },
  });

  // Watch for dependent selections to trigger API refetches
  const selectedModuleId = useWatch({ control: form.control, name: "moduleId" });
  const selectedPCatId = useWatch({ control: form.control, name: "pcategoryId" });
  const selectedCatId = useWatch({ control: form.control, name: "categoryId" });

  // API Queries with dependencies
  const { data: modulesResponse } = useGetPlatformModulesQuery(undefined, { skip: !open });
  const { data: pCatsResponse } = useGetParentCategoriesQuery(selectedModuleId, { skip: !selectedModuleId || !open });
  const { data: categoriesResponse } = useGetCategoriesQuery(selectedPCatId, { skip: !selectedPCatId || !open });
  const { data: subCatsResponse } = useGetSubCategoriesQuery(selectedCatId, { skip: !selectedCatId || !open });
  
  const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();

  useEffect(() => {
    if (open) {
      if (brand) {
        form.reset({
          name: brand.name || "",
          moduleId: brand.moduleId || "",
          pcategoryId: brand.pcategoryId || "",
          categoryId: brand.categoryId || "",
          subcategoryId: brand.subcategoryId || "",
          description: brand.description || "",
        });
        setLogoPreview(brand.logo || null);
      } else {
        form.reset({
          name: "",
          moduleId: "",
          pcategoryId: "",
          categoryId: "",
          subcategoryId: "",
          description: "",
        });
        setLogoPreview(null);
      }
    }
  }, [brand, open, form]);

  // Handle data extraction from API responses (supporting both nested data.data and flat data)
  const modules = modulesResponse?.data?.modules || [];
  const pCategories = pCatsResponse?.data?.data || pCatsResponse?.data || [];
  const categories = categoriesResponse?.data?.data || categoriesResponse?.data || [];
  const subCategories = subCatsResponse?.data?.data || subCatsResponse?.data || [];

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("moduleId", data.moduleId);
    formData.append("pcategoryId", data.pcategoryId);
    formData.append("categoryId", data.categoryId);
    formData.append("subcategoryId", data.subcategoryId);
    formData.append("description", data.description || "");

    if (data.logo instanceof File) {
      formData.append("logo", data.logo);
    }

    try {
      if (brand) {
        await updateBrand({ id: brand._id, formData }).unwrap();
        toast.success("Brand updated successfully");
      } else {
        await createBrand(formData).unwrap();
        toast.success("Brand created successfully");
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save brand");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("logo", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{brand ? "Edit Brand" : "Add New Brand"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Brand Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. UltraTech Cement" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="moduleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Module</FormLabel>
                    <Select 
                      onValueChange={(val) => {
                        field.onChange(val);
                        form.setValue("pcategoryId", "");
                        form.setValue("categoryId", "");
                        form.setValue("subcategoryId", "");
                      }} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select module" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {modules.map((m: any) => (
                          <SelectItem key={m._id} value={m._id}>{m.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pcategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Category</FormLabel>
                    <Select 
                      onValueChange={(val) => {
                        field.onChange(val);
                        form.setValue("categoryId", "");
                        form.setValue("subcategoryId", "");
                      }} 
                      value={field.value}
                      disabled={!selectedModuleId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pCategories.map((c: any) => (
                          <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={(val) => {
                        field.onChange(val);
                        form.setValue("subcategoryId", "");
                      }} 
                      value={field.value}
                      disabled={!selectedPCatId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((c: any) => (
                          <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subcategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={!selectedCatId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sub-category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subCategories.map((c: any) => (
                          <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about this brand..." 
                        className="resize-none h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2 space-y-4">
                <FormLabel>Brand Logo</FormLabel>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group h-40 w-full rounded-xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 flex items-center justify-center overflow-hidden bg-muted/30 transition-all">
                    {logoPreview ? (
                      <div className="relative h-full w-full">
                        <img src={logoPreview} alt="Preview" className="h-full w-full object-contain p-2" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <p className="text-white text-xs font-medium">Click to change</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-3 rounded-full bg-primary/10">
                          <Upload className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-xs text-muted-foreground">Click to upload brand logo</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="bg-background pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating} className="min-w-[120px]">
                {isCreating || isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  brand ? "Update Brand" : "Create Brand"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

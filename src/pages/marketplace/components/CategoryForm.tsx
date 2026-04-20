import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Loader2, Upload, Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useCreateParentCategoryMutation,
  useUpdateParentCategoryMutation,
  useGetPlatformModulesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useGetParentCategoriesQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
  useCreateProductTypeMutation,
  useUpdateProductTypeMutation
} from "../../Redux/apiSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  name: z.string().optional(),
  relationId: z.string().min(1, "Selection is required"),
  order: z.string().or(z.number()).transform(v => String(v)),
  image: z.any().optional(),
  typeNames: z.array(z.object({ value: z.string().min(1, "Name is required") })).optional(),
}).refine((data) => {
  // If not creating multiple product types, name is required
  if (!data.typeNames || data.typeNames.length === 0) {
    return !!data.name && data.name.length >= 2;
  }
  return true;
}, {
  message: "Title must be at least 2 characters",
  path: ["name"],
});

type FormData = z.infer<typeof schema>;

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: any; // If provided, we are in edit mode
  level: "parent" | "category" | "sub" | "productType";
}

export function CategoryForm({ open, onOpenChange, category, level }: CategoryFormProps) {
  const { data: modulesData } = useGetPlatformModulesQuery(undefined, { skip: level !== "parent" });
  const { data: parentsData } = useGetParentCategoriesQuery(undefined, { skip: level !== "category" });
  const { data: midCatsData } = useGetCategoriesQuery(undefined, { skip: level !== "sub" });
  const { data: subsData } = useGetSubCategoriesQuery(undefined, { skip: level !== "productType" });

  const [createParent, createParentStatus] = useCreateParentCategoryMutation();
  const [updateParent, updateParentStatus] = useUpdateParentCategoryMutation();
  const [createCat, createCatStatus] = useCreateCategoryMutation();
  const [updateCat, updateCatStatus] = useUpdateCategoryMutation();
  const [createSub, createSubStatus] = useCreateSubCategoryMutation();
  const [updateSub, updateSubStatus] = useUpdateSubCategoryMutation();
  const [createPT, createPTStatus] = useCreateProductTypeMutation();
  const [updatePT, updatePTStatus] = useUpdateProductTypeMutation();

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      relationId: "",
      order: "1",
      typeNames: [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "typeNames",
  });

  useEffect(() => {
    if (category) {
      let relationId = "";
      if (level === "parent") relationId = category.moduleId || "";
      else if (level === "category") relationId = category.pcategoryId || "";
      else if (level === "sub") relationId = category.categoryId || "";
      else if (level === "productType") relationId = category.subcategoryId || "";

      form.reset({
        name: category.name || category.typeName || "",
        relationId: relationId,
        order: String(category.order || "1"),
      });
      setImagePreview(category.image || null);
    } else {
      form.reset({
        name: "",
        relationId: "",
        order: "1",
        typeNames: [{ value: "" }],
      });
      setImagePreview(null);
    }
  }, [category, form, open, level]);

  const isLoading = 
    createParentStatus.isLoading || updateParentStatus.isLoading || 
    createCatStatus.isLoading || updateCatStatus.isLoading || 
    createSubStatus.isLoading || updateSubStatus.isLoading ||
    createPTStatus.isLoading || updatePTStatus.isLoading;

  const onSubmit = async (data: FormData) => {
    try {
      if (level === "productType") {
        if (category) {
          // Update product type - expects typeName
          await updatePT({ id: category._id, data: { typeName: data.name } }).unwrap();
        } else {
          // Create product type - expects subcategoryId and typeNames array
          const typeNames = data.typeNames?.map(n => n.value) || [data.name];
          await createPT({ 
            subcategoryId: data.relationId, 
            typeNames: typeNames 
          }).unwrap();
        }
      } else {
        const formData = new FormData();
        const parentField = 
          level === "parent" ? "moduleId" : 
          level === "category" ? "pcategoryId" : 
          "categoryId";

        formData.append("name", data.name);
        formData.append(parentField, data.relationId);
        formData.append("order", data.order);

        if (data.image instanceof File) {
          formData.append("image", data.image);
        }

        if (level === "parent") {
          if (category) await updateParent({ id: category._id, formData }).unwrap();
          else await createParent(formData).unwrap();
        } else if (level === "category") {
          if (category) await updateCat({ id: category._id, formData }).unwrap();
          else await createCat(formData).unwrap();
        } else if (level === "sub") {
          if (category) await updateSub({ id: category._id, formData }).unwrap();
          else await createSub(formData).unwrap();
        }
      }

      toast.success(`${level === "productType" ? "Product Type" : level.charAt(0).toUpperCase() + level.slice(1)} saved successfully`);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save category");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // isLoading is now calculated above onSubmit

  const getRelationData = () => {
    if (level === "parent") {
      const data = modulesData?.data?.modules;
      return Array.isArray(data) ? data : [];
    }
    if (level === "category") {
      const data = parentsData?.data?.data || parentsData?.data;
      return Array.isArray(data) ? data : [];
    }
    if (level === "sub") {
      const data = midCatsData?.data?.data || midCatsData?.data;
      return Array.isArray(data) ? data : [];
    }
    if (level === "productType") {
      const data = subsData?.data?.data || subsData?.data;
      return Array.isArray(data) ? data : [];
    }
    return [];
  };

  const relationLabel = 
    level === "parent" ? "Module" : 
    level === "category" ? "Parent Category" : 
    level === "sub" ? "Category" :
    "Sub Category";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Add New Category"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {level === "productType" && !category ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel>Product Type Names</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-[10px] gap-1"
                      onClick={() => append({ value: "" })}
                    >
                      <Plus className="h-3 w-3" /> Add Name
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 max-h-[200px] overflow-y-auto pr-2">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <FormField
                          control={form.control}
                          name={`typeNames.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder={`Type name ${index + 1}`} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-destructive hover:bg-destructive/10"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Plumbing & Sanitary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="relationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{relationLabel}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                        disabled={!!category}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${relationLabel.toLowerCase()}`} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[200px]">
                          {getRelationData().map((item: any) => (
                            <SelectItem key={item._id} value={item._id}>
                              {item.title || item.name}
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
                  name="order"
                  render={({ field }) => (
                    <FormItem className={level === "productType" ? "hidden" : ""}>
                      <FormLabel>Order</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className={`space-y-4 ${level === "productType" ? "hidden" : ""}`}>
                <FormLabel>Category Image</FormLabel>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group h-48 w-full rounded-xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 flex items-center justify-center overflow-hidden bg-muted/30 transition-all">
                    {imagePreview ? (
                      <div className="relative h-full w-full">
                        <img src={imagePreview} alt="Preview" className="h-full w-full object-contain" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white text-xs font-medium">Click to change</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-3 rounded-full bg-primary/10">
                          <Upload className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          Drop image here or click to upload
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      id="category-image"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  category ? "Update Category" : "Create Category"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

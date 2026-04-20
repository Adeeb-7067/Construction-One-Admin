import { useState, useEffect } from "react";
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
import { Loader2, Upload } from "lucide-react";
import { toast } from "react-hot-toast";
import { useCreatePlatformModuleMutation, useUpdatePlatformModuleMutation } from "../../Redux/apiSlice";

const schema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  type: z.string().min(2, "Type is required"),
  routePath: z.string().min(1, "Route path is required"),
  order: z.string().or(z.number()).transform(v => String(v)),
  image: z.any().optional(),
  icon: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

interface ModuleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  module?: any; // If provided, we are in edit mode
}

export function ModuleForm({ open, onOpenChange, module }: ModuleFormProps) {
  const [createModule, { isLoading: isCreating }] = useCreatePlatformModuleMutation();
  const [updateModule, { isLoading: isUpdating }] = useUpdatePlatformModuleMutation();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      type: "",
      routePath: "",
      order: "1",
    },
  });

  useEffect(() => {
    if (module) {
      form.reset({
        title: module.title || "",
        type: module.type || "",
        routePath: module.routePath || "",
        order: String(module.order || "1"),
      });
      setImagePreview(module.image || null);
      setIconPreview(module.icon || null);
    } else {
      form.reset({
        title: "",
        type: "",
        routePath: "",
        order: "1",
      });
      setImagePreview(null);
      setIconPreview(null);
    }
  }, [module, form, open]);

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("type", data.type);
    formData.append("routePath", data.routePath);
    formData.append("order", data.order);

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }
    if (data.icon instanceof File) {
      formData.append("icon", data.icon);
    }

    try {
      if (module) {
        await updateModule({ id: module._id, formData }).unwrap();
        toast.success("Module updated successfully");
      } else {
        await createModule(formData).unwrap();
        toast.success("Module created successfully");
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save module");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "image" | "icon") => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue(field, file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === "image") setImagePreview(reader.result as string);
        else setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{module ? "Edit Module" : "Add New Module"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Materials" {...field} />
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
                    <FormControl>
                      <Input placeholder="e.g. MATERIAL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="routePath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route Path</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. /marketplace" {...field} />
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
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <FormLabel>Module Image</FormLabel>
                <div className="flex flex-col items-center gap-3">
                  <div className="relative h-24 w-full rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted/50">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-contain" />
                    ) : (
                      <Upload className="h-8 w-8 text-muted-foreground/50" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => handleFileChange(e, "image")}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center">Click to upload image</p>
                </div>
              </div>

              <div className="space-y-2">
                <FormLabel>Module Icon</FormLabel>
                <div className="flex flex-col items-center gap-3">
                  <div className="relative h-24 w-full rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted/50">
                    {iconPreview ? (
                      <img src={iconPreview} alt="Preview" className="h-full w-full object-contain" />
                    ) : (
                      <Upload className="h-8 w-8 text-muted-foreground/50" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => handleFileChange(e, "icon")}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center">Click to upload icon</p>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {module ? "Update Module" : "Create Module"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

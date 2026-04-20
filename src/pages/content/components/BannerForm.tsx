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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { toast } from "react-hot-toast";
import { 
  useCreateBannerMutation, 
  useUpdateBannerMutation, 
  useGetPlatformModulesQuery 
} from "../../Redux/apiSlice";

const schema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  moduleId: z.string().min(1, "Module is required"),
  page: z.string().min(1, "Page is required"),
  position: z.string().min(1, "Position is required"),
  order: z.string().or(z.number()).transform(v => String(v)),
  redirectUrl: z.string().optional(),
  image: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

interface BannerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner?: any; // If provided, we are in edit mode
}

export function BannerForm({ open, onOpenChange, banner }: BannerFormProps) {
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const { data: modulesData } = useGetPlatformModulesQuery({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      moduleId: "",
      page: "HOME",
      position: "TOP",
      order: "1",
      redirectUrl: "",
    },
  });

  useEffect(() => {
    if (banner) {
      form.reset({
        title: banner.title || "",
        moduleId: banner.moduleId || "",
        page: banner.page || "HOME",
        position: banner.position || "TOP",
        order: String(banner.order || "1"),
        redirectUrl: banner.redirectUrl || "",
      });
      setImagePreview(banner.image || null);
    } else {
      form.reset({
        title: "",
        moduleId: "",
        page: "HOME",
        position: "TOP",
        order: "1",
        redirectUrl: "",
      });
      setImagePreview(null);
    }
  }, [banner, form, open]);

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("moduleId", data.moduleId);
    formData.append("page", data.page);
    formData.append("position", data.position);
    formData.append("order", data.order);
    if (data.redirectUrl) formData.append("redirectUrl", data.redirectUrl);

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    try {
      if (banner) {
        await updateBanner({ id: banner._id, formData }).unwrap();
        toast.success("Banner updated successfully");
      } else {
        await createBanner(formData).unwrap();
        toast.success("Banner created successfully");
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save banner");
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

  const isLoading = isCreating || isUpdating;
  const modules = modulesData?.data?.modules || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{banner ? "Edit Banner" : "Add New Banner"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Banner Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="moduleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Module</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Module" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {modules.map((mod: any) => (
                          <SelectItem key={mod._id} value={mod._id}>
                            {mod.title}
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
                name="page"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Page" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="HOME">HOME</SelectItem>
                        <SelectItem value="SHOP">SHOP</SelectItem>
                        <SelectItem value="OFFER">OFFER</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TOP">TOP</SelectItem>
                        <SelectItem value="MIDDLE">MIDDLE</SelectItem>
                        <SelectItem value="BOTTOM">BOTTOM</SelectItem>
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
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="redirectUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Redirect URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Banner Image</FormLabel>
              <div className="flex flex-col items-center gap-3">
                <div className="relative h-40 w-full rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted/50">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-contain" />
                  ) : (
                    <Upload className="h-10 w-10 text-muted-foreground/50" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">Click to upload banner image</p>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {banner ? "Update Banner" : "Create Banner"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

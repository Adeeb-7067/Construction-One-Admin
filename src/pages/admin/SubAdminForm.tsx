import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

export const PERMISSIONS_GROUPS = [
  {
    section: "Main",
    permissions: ["DASHBOARD", "MODULE"]
  },
  {
    section: "Marketplace",
    permissions: [
      "MARKETPLACE_DASHBOARD",
      "MARKETPLACE_PRODUCTS",
      "MARKETPLACE_CATEGORIES",
      "MARKETPLACE_BRANDS",
      "MARKETPLACE_VENDORS",
      "MARKETPLACE_FLASH_SALE",
      "MARKETPLACE_RFQ",
      "MARKETPLACE_TRANSACTIONS",
      "MARKETPLACE_VENDOR_REQUESTS"
    ]
  },
  {
    section: "Services",
    permissions: [
      "SERVICES_DASHBOARD",
      "SERVICES_PROVIDERS",
      "SERVICES_BOOKINGS",
      "SERVICES_QUOTATIONS",
      "SERVICES_INSPECTIONS"
    ]
  },
  {
    section: "Rental Tool",
    permissions: [
      "RENTAL_DASHBOARD",
      "RENTAL_CATEGORIES",
      "RENTAL_EQUIPMENT",
      "RENTAL_BOOKINGS"
    ]
  },
  {
    section: "Planner",
    permissions: [
      "PLANNER_DASHBOARD",
      "PLANNER_SMART_BUILD",
      "PLANNER_ESTIMATIONS",
      "PLANNER_PROJECTS"
    ]
  },
  {
    section: "Common",
    permissions: ["COMMON_COUNTRY", "COMMON_STATE", "COMMON_CITY", "COMMON_PINCODE"]
  },
  {
    section: "Administration",
    permissions: ["ADMIN_COMPANY", "ADMIN_USERS", "ADMIN_SUB_ADMIN"]
  },
  {
    section: "Content Management",
    permissions: ["CONTENT_BANNER", "CONTENT_HOME", "CONTENT_FAQ"]
  }
];

const subAdminSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
  address: z.string().min(5, "Address is required"),
  gender: z.string().min(1, "Gender is required"),
  permissions: z.array(z.string()).min(1, "At least one permission is required"),
});

type SubAdminFormValues = z.infer<typeof subAdminSchema>;

interface SubAdminFormProps {
  initialData?: any;
  onSubmit: (data: SubAdminFormValues) => void;
  isLoading: boolean;
  isEdit?: boolean;
}

export function SubAdminForm({ initialData, onSubmit, isLoading, isEdit }: SubAdminFormProps) {
  const form = useForm<SubAdminFormValues>({
    resolver: zodResolver(subAdminSchema),
    defaultValues: initialData ? {
      firstName: initialData.firstName || "",
      lastName: initialData.lastName || "",
      email: initialData.email || "",
      phone: initialData.phone || "",
      password: "",
      address: initialData.address || "",
      gender: initialData.gender || "",
      permissions: initialData.permissions || [],
    } : {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      address: "",
      gender: "",
      permissions: [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col max-h-[80vh]">
        <div className="flex-1 overflow-y-auto px-4 space-y-6 scrollbar-thin pb-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="9876543210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {!isEdit && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="City, State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel className="text-base font-bold text-primary">Role Permissions</FormLabel>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="text-[10px] font-bold h-7 uppercase tracking-wider"
                onClick={() => {
                  const allPerms = PERMISSIONS_GROUPS.flatMap(g => g.permissions);
                  form.setValue("permissions", allPerms);
                }}
              >
                Select All
              </Button>
            </div>
            
            <div className="space-y-6">
              {PERMISSIONS_GROUPS.map((group) => (
                <div key={group.section} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{group.section}</span>
                    <div className="h-[1px] flex-1 bg-muted/50" />
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    {group.permissions.map((permission) => (
                      <FormField
                        key={permission}
                        control={form.control}
                        name="permissions"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={permission}
                              className="flex flex-row items-center space-x-3 space-y-0 p-2 rounded-lg hover:bg-muted/30 transition-colors"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(permission)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, permission])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== permission
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-xs font-medium cursor-pointer capitalize leading-none pt-0">
                                {permission.split('_').pop()?.toLowerCase()}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <FormMessage />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t mt-auto text-right">
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Update Changes" : "Create Sub-Admin"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

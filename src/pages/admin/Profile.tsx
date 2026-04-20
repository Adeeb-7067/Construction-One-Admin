import { useGetAdminMeQuery, useUpdateAdminProfileMutation } from "@/pages/Redux/apiSlice";
import { PageHeader } from "@/components/shared/PageHeader";
import { 
  Loader2, User as UserIcon, Mail, Phone, MapPin, 
  Calendar as CalendarIcon, Shield, UserCircle, Briefcase, 
  Clock, Hash, CheckCircle2, AlertCircle, Edit, Save
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  phone: z.string().min(10, "Invalid phone number"),
  address: z.string().optional(),
  gender: z.string().optional(),
  dob: z.date().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Profile() {
  const role = localStorage.getItem("role");
  const { data: response, isLoading } = useGetAdminMeQuery(role);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateAdminProfileMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const admin = response?.data?.admin || response?.admin || response?.data?.subAdmin || response?.subAdmin;
  const isAdmin = role === "ADMIN";

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (admin) {
      form.reset({
        firstName: admin.firstName || "",
        lastName: admin.lastName || "",
        phone: admin.phone || "",
        address: admin.address || "",
        gender: admin.gender || "Male",
        dob: admin.dob ? new Date(admin.dob) : undefined,
      });
    }
  }, [admin, form]);

  const onUpdateSubmit = async (values: ProfileFormValues) => {
    try {
      const payload: any = {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
      };

      if (isAdmin) {
        payload.address = values.address;
        payload.gender = values.gender;
        if (values.dob) payload.dob = format(values.dob, "yyyy-MM-dd");
      }

      await updateProfile({
        role,
        data: payload
      }).unwrap();
      toast.success("Profile updated successfully!");
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">Fetching your profile...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-bold">Profile Not Found</h2>
        <p className="text-muted-foreground">We couldn't retrieve your administrative details.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto">
      <PageHeader 
        title="Administrative Profile" 
        description="Manage your account details and view assigned permissions"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl shadow-lg shadow-primary/20 gap-2">
                <Edit className="h-4 w-4" /> Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-[30px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-black uppercase tracking-tight">Update Profile</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onUpdateSubmit)} className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl><Input placeholder="John" {...field} /></FormControl>
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
                          <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl><Input placeholder="+91 9876543210" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isAdmin && (
                    <>
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
                          name="dob"
                          render={({ field }) => (
                            <FormItem className="flex flex-col mt-2">
                              <FormLabel className="mb-1">Date of Birth</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl><Input placeholder="Full HQ address..." {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <div className="flex justify-end gap-3 pt-6">
                    <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isUpdating}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUpdating} className="gap-2">
                      {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="lg:col-span-1 border-none shadow-2xl bg-gradient-to-b from-card to-muted/20 rounded-[40px] overflow-hidden">
          <CardContent className="pt-10 pb-10 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <Avatar className="h-32 w-32 border-4 border-card shadow-xl relative">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-4xl font-black">
                  {admin.firstName?.[0]}{admin.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-green-500 h-8 w-8 rounded-full border-4 border-card flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-black tracking-tight">{admin.firstName} {admin.lastName}</h2>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                {admin.role?.replace('_', ' ')}
              </Badge>
              {admin.isVerified && (
                <Badge variant="outline" className="border-green-500/50 text-green-600 bg-green-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  Verified
                </Badge>
              )}
            </div>

            <Separator className="my-8 w-4/5 opacity-50" />

            <div className="w-full space-y-4 px-4 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="h-8 w-8 rounded-xl bg-card border flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="truncate">{admin.email}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="h-8 w-8 rounded-xl bg-card border flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <span>{admin.phone}</span>
              </div>
              {isAdmin && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="h-8 w-8 rounded-xl bg-card border flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="text-left">{admin.address}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* General Information */}
          <Card className="border-none shadow-xl rounded-[40px] overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-black tracking-tight uppercase">Account Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoItem icon={<Hash />} label="Internal ID" value={admin.id} />
              {isAdmin && (
                <>
                  <InfoItem icon={<UserIcon />} label="Gender" value={admin.gender} />
                  <InfoItem 
                    icon={<CalendarIcon />} 
                    label="Date of Birth" 
                    value={admin.dob ? format(new Date(admin.dob), 'PPP') : "Not set"} 
                  />
                </>
              )}
              <InfoItem icon={<Clock />} label="Last Updated" value={admin.updatedAt ? format(new Date(admin.updatedAt), 'PPP p') : "N/A"} />
              <InfoItem icon={<CalendarIcon />} label="Member Since" value={admin.createdAt ? format(new Date(admin.createdAt), 'PPP') : "N/A"} />
            </CardContent>
          </Card>

          {/* Permissions Section */}
          <Card className="border-none shadow-xl rounded-[40px] overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-black tracking-tight uppercase">Access Control</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-3xl bg-primary/5 border border-primary/10">
                <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Current Role: {admin.role?.replace('_', ' ')}</h4>
                  <p className="text-xs text-muted-foreground">Permissions are assigned by the central administrator.</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest px-1">Assigned Permissions</p>
                <div className="flex flex-wrap gap-2">
                  {admin.permissions?.includes('*') ? (
                    <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 px-4 py-2 rounded-2xl text-[11px] font-bold">
                      <Shield className="mr-2 h-3 w-3" /> FULL DOMAIN ACCESS (*)
                    </Badge>
                  ) : (
                    admin.permissions?.map((permission: string) => (
                      <Badge key={permission} variant="secondary" className="bg-muted text-muted-foreground border-border px-3 py-1.5 rounded-xl text-[10px] font-medium tracking-wide">
                        {permission.replace(/_/g, ' ')}
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 h-8 w-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">{label}</p>
        <p className="text-sm font-semibold text-foreground break-all">{value}</p>
      </div>
    </div>
  );
}

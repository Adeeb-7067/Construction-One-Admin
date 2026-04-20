import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { 
  useGetUsersQuery, 
  useUpdateUserStatusMutation, 
  useDeleteUserMutation 
} from "../Redux/apiSlice";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, ShieldX, User, Mail, Phone, MapPin, Calendar, Clock, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export default function AdminUsers() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { data: response, isLoading } = useGetUsersQuery(undefined);
  const [updateStatus] = useUpdateUserStatusMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleToggleStatus = async (id: string) => {
    setUpdatingId(id);
    try {
      await updateStatus(id).unwrap();
      toast.success("User status updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteClick = (user: any) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleViewClick = (user: any) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete._id).unwrap();
      toast.success("User deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete user");
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const columns = [
    { 
      key: "name", 
      label: "Name",
      render: (value: any, row: any) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{row.firstName} {row.lastName}</span>
          <span className="text-[10px] text-muted-foreground font-mono">{row._id}</span>
        </div>
      )
    },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { 
      key: "role", 
      label: "Role",
      render: (value: string) => (
        <Badge 
          variant="outline" 
          className={`text-[10px] min-w-[70px] justify-center ${
            value === "ADMIN" 
              ? "bg-indigo-50 text-indigo-700 border-indigo-200" 
              : "bg-slate-50 text-slate-700 border-slate-200"
          }`}
        >
          {value}
        </Badge>
      )
    },
    { 
      key: "isVerified", 
      label: "Verified",
      render: (value: boolean) => (
        <Badge 
          variant="outline" 
          className={`text-[10px] min-w-[85px] justify-center gap-1 ${
            value 
              ? "bg-green-50 text-green-700 border-green-200" 
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}
        >
          {value ? <ShieldCheck className="h-3 w-3" /> : <ShieldX className="h-3 w-3" />}
          {value ? "Verified" : "Pending"}
        </Badge>
      )
    },
    { 
      key: "status", 
      label: "Account Status",
      render: (value: string, row: any) => {
        const isActive = value === "Active";
        return (
          <div className="flex items-center gap-3">
            <Badge 
              variant="outline" 
              className={`text-[10px] min-w-[80px] justify-center ${
                isActive 
                  ? "bg-green-50 text-green-700 border-green-200" 
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {value}
            </Badge>
            <Switch
              checked={!isActive}
              onCheckedChange={() => handleToggleStatus(row._id)}
              disabled={updatingId === row._id}
            />
            {updatingId === row._id && (
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
            )}
          </div>
        );
      }
    },
  ];

  const users = (response?.data || []).map((u: any) => ({
    ...u,
    status: u.isDisabled ? "Suspended" : "Active"
  }));

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Users" 
        description="Manage platform users and roles" 
      />
      
      <DataTable 
        columns={columns} 
        data={users} 
        onView={handleViewClick}
        onDelete={handleDeleteClick}
        isLoading={isLoading}
      />

      {/* User Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <User className="h-6 w-6 text-primary" />
              Complete User Profile
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 py-6">
            {/* Primary Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Primary Info</h4>
              <DetailItem icon={<User className="h-4 w-4" />} label="Full Name" value={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : "N/A"} />
              <DetailItem icon={<Mail className="h-4 w-4" />} label="Email Address" value={selectedUser?.email || "N/A"} />
              <DetailItem icon={<Phone className="h-4 w-4" />} label="Phone Number" value={selectedUser?.phone || "N/A"} />
              <DetailItem icon={<MapPin className="h-4 w-4" />} label="Residential Address" value={selectedUser?.address || "N/A"} />
            </div>
            
            {/* Personal & Metadata */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Additional Details</h4>
              <DetailItem icon={<Info className="h-4 w-4" />} label="Gender" value={selectedUser?.gender || "N/A"} />
              <DetailItem icon={<Calendar className="h-4 w-4" />} label="Date of Birth" value={selectedUser?.dob ? new Date(selectedUser.dob).toLocaleDateString() : "N/A"} />
              <DetailItem icon={<Clock className="h-4 w-4" />} label="Registration Date" value={selectedUser?.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : "N/A"} />
              <DetailItem icon={<Clock className="h-4 w-4" />} label="Profile Last Updated" value={selectedUser?.updatedAt ? new Date(selectedUser.updatedAt).toLocaleString() : "N/A"} />
            </div>
          </div>

          <Separator className="bg-muted/50" />
          
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <div className="flex gap-2">
              <Badge variant={selectedUser?.role === "ADMIN" ? "default" : "secondary"} className="rounded-full px-4 border-none shadow-sm capitalize">
                {selectedUser?.role?.toLowerCase()} Account
              </Badge>
              <Badge variant="outline" className={`${selectedUser?.isVerified ? "text-green-600 bg-green-50 border-green-200" : "text-amber-600 bg-amber-50 border-amber-200"} rounded-full px-4 shadow-sm`}>
                {selectedUser?.isVerified ? "ID Verified" : "Verification Pending"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 bg-muted/30 px-4 py-1.5 rounded-full border border-muted/50 shadow-inner">
              <span className="text-xs font-medium text-muted-foreground">Account Status:</span>
              <span className={`text-[11px] font-bold uppercase tracking-widest ${selectedUser?.isDisabled ? "text-destructive" : "text-green-600"}`}>
                {selectedUser?.isDisabled ? "Suspended" : "Active"}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              <span className="font-semibold text-foreground mx-1">
                "{userToDelete?.firstName} {userToDelete?.lastName}"
              </span>
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3 items-start p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
      <div className="mt-0.5 text-primary p-1.5 bg-background rounded-md shadow-sm">{icon}</div>
      <div className="flex flex-col">
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{label}</span>
        <span className="text-sm font-medium text-foreground break-words">{value}</span>
      </div>
    </div>
  );
}

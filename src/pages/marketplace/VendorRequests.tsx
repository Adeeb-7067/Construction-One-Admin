import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Eye, Loader2 } from "lucide-react";
import { 
  useGetWithdrawalsQuery, 
  useApproveWithdrawalMutation 
} from "../Redux/apiSlice";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const columns = [
  // ... (keep existing columns)
  { 
    key: "vendorId", 
    label: "Vendor",
    render: (vendor: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{vendor?.firstName} {vendor?.lastName}</span>
        <span className="text-[11px] text-muted-foreground">{vendor?.phoneNumber}</span>
      </div>
    )
  },
  { 
    key: "amount", 
    label: "Amount",
    render: (val: number) => `₹${val.toLocaleString()}`
  },
  { 
    key: "status", 
    label: "Status",
    render: (val: string) => {
      const colors: Record<string, string> = {
        PENDING: "bg-amber-50 text-amber-700 border-amber-200",
        APPROVED: "bg-green-50 text-green-700 border-green-200",
        REJECTED: "bg-red-50 text-red-700 border-red-200",
      };
      const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
        PENDING: "secondary",
        APPROVED: "default",
        REJECTED: "destructive",
      };
      return (
        <Badge 
          variant={variants[val] || "outline"}
          className={`text-[10px] min-w-[70px] justify-center ${colors[val] || ""}`}
        >
          {val}
        </Badge>
      );
    }
  },
  { 
    key: "bankAccountId", 
    label: "Bank Name",
    render: (bank: any) => bank?.bankName || "—"
  },
  { 
    key: "createdAt", 
    label: "Date",
    render: (val: string) => format(new Date(val), "dd MMM yyyy, hh:mm a")
  },
];

export default function VendorRequests() {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [approvingRequest, setApprovingRequest] = useState<any>(null);
  const [txId, setTxId] = useState("");

  const { data: withdrawalsRes, isLoading } = useGetWithdrawalsQuery(undefined);
  const [approveWithdrawal, { isLoading: isApproving }] = useApproveWithdrawalMutation();
  
  const withdrawals = withdrawalsRes?.data || [];

  const handleApprove = async () => {
    if (!txId.trim()) return toast.error("Please enter a Transaction ID");
    try {
      await approveWithdrawal({ id: approvingRequest._id, transactionId: txId }).unwrap();
      toast.success("Request approved successfully");
      setApprovingRequest(null);
      setTxId("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to approve request");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Vendor Requests" description="View all marketplace vendor requests" />
      <DataTable 
        columns={columns} 
        data={withdrawals} 
        isLoading={isLoading}
        onView={(row) => setSelectedRequest(row)}
        extraActions={(row) => (
          row.status === 'PENDING' && (
            <DropdownMenuItem 
              className="gap-2 text-emerald-600 focus:text-emerald-600 cursor-pointer"
              onClick={() => {
                setApprovingRequest(row);
                setTxId("");
              }}
            >
              <CheckCircle className="h-3.5 w-3.5" /> Approve
            </DropdownMenuItem>
          )
        )}
      />

      {/* View Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Withdrawal Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Status</p>
                  <Badge 
                    variant={
                      selectedRequest.status === 'APPROVED' ? 'default' : 
                      selectedRequest.status === 'REJECTED' ? 'destructive' : 'secondary'
                    }
                  >
                    {selectedRequest.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Amount</p>
                  <p className="text-sm font-medium">₹{selectedRequest.amount.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Vendor</p>
                  <p className="text-sm font-medium">{selectedRequest.vendorId.firstName} {selectedRequest.vendorId.lastName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Date</p>
                  <p className="text-sm font-medium">{format(new Date(selectedRequest.createdAt), "dd MMM yyyy, hh:mm a")}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <p className="text-xs font-bold">Bank Account Details</p>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 bg-muted/30 p-4 rounded-lg border border-muted">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground italic tracking-tight">Account Holder</p>
                    <p className="text-xs font-medium uppercase">{selectedRequest.bankAccountId.accountHolderName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground italic tracking-tight">Bank Name</p>
                    <p className="text-xs font-medium">{selectedRequest.bankAccountId.bankName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground italic tracking-tight">Account Number</p>
                    <p className="text-xs font-medium">{selectedRequest.bankAccountId.accountNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground italic tracking-tight">IFSC Code</p>
                    <p className="text-xs font-medium uppercase font-mono">{selectedRequest.bankAccountId.ifscCode}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground italic tracking-tight">Account Type</p>
                    <p className="text-xs font-medium">{selectedRequest.bankAccountId.accountType}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={!!approvingRequest} onOpenChange={(open) => !open && setApprovingRequest(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Withdrawal Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Please enter the Transaction ID to confirm that the amount of 
              <span className="font-bold text-foreground mx-1">₹{approvingRequest?.amount.toLocaleString()}</span> 
              has been sent to 
              <span className="font-bold text-foreground ml-1">{approvingRequest?.vendorId.firstName}</span>.
            </p>
            <div className="space-y-2">
              <label className="text-xs font-medium">Transaction ID</label>
              <Input 
                placeholder="Enter Transaction ID"
                value={txId}
                onChange={(e) => setTxId(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setApprovingRequest(null)} disabled={isApproving}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={isApproving}>
              {isApproving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}



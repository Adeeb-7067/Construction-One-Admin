import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { useGetTransactionsQuery } from "../Redux/apiSlice";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const columns = [
  { 
    key: "vendor", 
    label: "Vendor",
    render: (vendor: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{vendor.name}</span>
        <span className="text-[11px] text-muted-foreground">{vendor.email}</span>
      </div>
    )
  },
  { 
    key: "type", 
    label: "Type",
    render: (val: string) => (
      <Badge 
        variant="outline" 
        className={`text-[10px] min-w-[80px] justify-center ${
          val === 'WITHDRAWAL' 
            ? 'bg-amber-50 text-amber-700 border-amber-200' 
            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
        }`}
      >
        {val}
      </Badge>
    )
  },
  { 
    key: "amount", 
    label: "Amount",
    render: (val: number) => `₹${val.toLocaleString()}`
  },
  { 
    key: "netAmount", 
    label: "Net Amount",
    render: (val: number) => `₹${val.toLocaleString()}`
  },
  { key: "description", label: "Description" },
  { 
    key: "bank", 
    label: "Bank Account",
    render: (bank: any) => bank ? (
      <div className="flex flex-col">
        <span className="text-xs">{bank.bankName}</span>
        <span className="text-[11px] text-muted-foreground">{bank.accountNumber}</span>
      </div>
    ) : "—"
  },
  { 
    key: "createdAt", 
    label: "Date",
    render: (val: string) => format(new Date(val), "dd MMM yyyy, hh:mm a")
  },
  { 
    key: "status", 
    label: "Status",
    render: (val: string) => (
      <Badge 
        variant="outline" 
        className={`text-[10px] min-w-[80px] justify-center capitalize ${
          val?.toLowerCase() === 'completed' || val?.toLowerCase() === 'success'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : val?.toLowerCase() === 'pending'
            ? 'bg-amber-50 text-amber-700 border-amber-200'
            : 'bg-red-50 text-red-700 border-red-200'
        }`}
      >
        {val || "N/A"}
      </Badge>
    )
  },
];

export default function Transactions() {
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const { data: transactionsRes, isLoading } = useGetTransactionsQuery(undefined);
  const transactions = (transactionsRes?.data || []).map((txn: any) => {
    const rawStatus = txn.status || txn.transferStatus || txn.type || "N/A";
    const status = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();
    
    return {
      ...txn,
      status
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Transactions" description="View all marketplace transactions" />
      <DataTable 
        columns={columns} 
        data={transactions} 
        isLoading={isLoading}
        onView={(row) => setSelectedTransaction(row)}
      />

      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Type</p>
                  <Badge 
                    variant="outline" 
                    className={`text-[10px] min-w-[80px] justify-center ${
                      selectedTransaction.type === 'WITHDRAWAL' 
                        ? 'bg-amber-50 text-amber-700 border-amber-200' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}   
                  >    
                    {selectedTransaction.type}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Amount</p>
                  <p className="text-sm font-medium">₹{selectedTransaction.amount.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Net Amount</p>
                  <p className="text-sm font-medium">₹{selectedTransaction.netAmount.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Date</p>
                  <p className="text-sm font-medium">{format(new Date(selectedTransaction.createdAt), "dd MMM yyyy, hh:mm a")}</p>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t text-sm">
                 <p className="text-[10px] uppercase font-bold text-muted-foreground">Description</p>
                 <p>{selectedTransaction.description}</p>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <p className="text-xs font-bold">Bank Details</p>
                <div className="grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-lg border border-muted">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground italic">Holder Name</p>
                    <p className="text-xs font-medium">{selectedTransaction.bank?.accountHolderName || "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground italic">Bank</p>
                    <p className="text-xs font-medium">{selectedTransaction.bank?.bankName || "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground italic">Account Number</p>
                    <p className="text-xs font-medium">{selectedTransaction.bank?.accountNumber || "—"}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Reference ID</p>
                <code className="text-[11px] bg-muted px-1 rounded">{selectedTransaction.referenceId}</code>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}



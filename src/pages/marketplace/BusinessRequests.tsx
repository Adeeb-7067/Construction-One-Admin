import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { useGetBusinessRequestsQuery } from "../Redux/apiSlice";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const columns = [
  { 
    key: "businessName", 
    label: "Business Name",
    render: (val: string) => <span className="font-medium">{val || "—"}</span>
  },
  { 
    key: "name", 
    label: "Contact Person",
    render: (val: string, row: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{val || "—"}</span>
        <span className="text-[11px] text-muted-foreground">{row?.email}</span>
        <span className="text-[11px] text-muted-foreground">{row?.phone}</span>
      </div>
    )
  },
  { 
    key: "city", 
    label: "City",
    render: (val: string) => val || "—"
  },
  { 
    key: "sellType", 
    label: "Categories to Sell",
    render: (sellTypes: any[]) => {
      if (!sellTypes || sellTypes.length === 0) return "—";
      return (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {sellTypes.slice(0, 2).map((type: any) => (
            <Badge key={type._id} variant="secondary" className="text-[10px] font-normal truncate max-w-[120px]">
              {type.name}
            </Badge>
          ))}
          {sellTypes.length > 2 && (
            <Badge variant="outline" className="text-[10px]">
              +{sellTypes.length - 2} more
            </Badge>
          )}
        </div>
      );
    }
  }
];

export default function BusinessRequests() {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const { data: businessRequestsRes, isLoading } = useGetBusinessRequestsQuery(undefined);
  
  const requests = businessRequestsRes?.requests || [];

  return (
    <div className="space-y-6">
      <PageHeader title="Business Requests" description="View inquiries from potential businesses looking to join the platform." />
      
      <DataTable 
        columns={columns} 
        data={requests} 
        isLoading={isLoading}
        onView={(row) => setSelectedRequest(row)}
      />

      {/* View Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Business Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Business Name</p>
                  <p className="text-sm font-medium">{selectedRequest.businessName || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Contact Person</p>
                  <p className="text-sm font-medium">{selectedRequest.name || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{selectedRequest.email || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{selectedRequest.phone || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">City</p>
                  <p className="text-sm font-medium">{selectedRequest.city || "—"}</p>
                </div>
              </div>

              {selectedRequest.sellType && selectedRequest.sellType.length > 0 && (
                <div className="space-y-3 pt-4 border-t">
                  <p className="text-xs font-bold uppercase text-muted-foreground">Categories to Sell</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.sellType.map((type: any) => (
                      <Badge key={type._id} variant="secondary">
                        {type.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedRequest.description && (
                <div className="space-y-3 pt-4 border-t">
                  <p className="text-xs font-bold uppercase text-muted-foreground">Description</p>
                  <ScrollArea className="h-[100px] w-full rounded-md border p-4 bg-muted/30">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {selectedRequest.description}
                    </p>
                  </ScrollArea>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

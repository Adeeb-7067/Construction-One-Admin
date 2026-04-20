import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import {
  useGetFAQsQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} from "../Redux/apiSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  Plus,
  Edit,
  Trash2,
  Loader2,
  HelpCircle,
  MessageCircle,
} from "lucide-react";

export default function MarketplaceFAQ() {
  const { data: response, isLoading } = useGetFAQsQuery(undefined);
  const [createFAQ] = useCreateFAQMutation();
  const [updateFAQ] = useUpdateFAQMutation();
  const [deleteFAQ] = useDeleteFAQMutation();

  // Form dialog state
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<any>(null);
  const [formData, setFormData] = useState({ question: "", answer: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingFAQ, setDeletingFAQ] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const faqs = response?.data?.faqs || [];

  const openCreateDialog = () => {
    setEditingFAQ(null);
    setFormData({ question: "", answer: "" });
    setFormDialogOpen(true);
  };

  const openEditDialog = (faq: any) => {
    setEditingFAQ(faq);
    setFormData({ question: faq.question, answer: faq.answer });
    setFormDialogOpen(true);
  };

  const openDeleteDialog = (faq: any) => {
    setDeletingFAQ(faq);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error("Please fill in both question and answer");
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingFAQ) {
        await updateFAQ({
          id: editingFAQ._id,
          data: formData,
        }).unwrap();
        toast.success("FAQ updated successfully");
      } else {
        await createFAQ(formData).unwrap();
        toast.success("FAQ created successfully");
      }
      setFormDialogOpen(false);
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          `Failed to ${editingFAQ ? "update" : "create"} FAQ`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingFAQ) return;
    setIsDeleting(true);
    try {
      await deleteFAQ(deletingFAQ._id).unwrap();
      toast.success("FAQ deleted successfully");
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete FAQ");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      key: "question",
      label: "Question",
      render: (value: string) => (
        <div className="flex items-start gap-2 max-w-[350px]">
          <HelpCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <span className="font-medium text-sm line-clamp-2">{value}</span>
        </div>
      ),
    },
    {
      key: "answer",
      label: "Answer",
      render: (value: string) => (
        <div className="flex items-start gap-2 max-w-[400px]">
          <MessageCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <span className="text-sm text-muted-foreground line-clamp-2">
            {value}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: boolean | string) => {
        const isActive = typeof value === "boolean" ? value : value === "Active";
        return (
          <Badge
            variant="outline"
            className={`text-[10px] min-w-[80px] justify-center ${
              isActive
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value: string) =>
        value
          ? new Date(value).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "N/A",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="FAQ"
        description="Manage frequently asked questions"
        actions={
          <Button size="sm" onClick={openCreateDialog} className="rounded-xl">
            <Plus className="h-4 w-4 mr-1" /> Add FAQ
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={faqs}
        isLoading={isLoading}
        extraActions={(row) => (
          <>
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={() => openEditDialog(row)}
            >
              <Edit className="h-3.5 w-3.5" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 cursor-pointer text-destructive"
              onClick={() => openDeleteDialog(row)}
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </DropdownMenuItem>
          </>
        )}
      />

      {/* Create / Edit FAQ Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              {editingFAQ ? "Edit FAQ" : "Add New FAQ"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Question <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Enter the question..."
                value={formData.question}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, question: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Answer <span className="text-destructive">*</span>
              </label>
              <Textarea
                placeholder="Enter the answer..."
                value={formData.answer}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, answer: e.target.value }))
                }
                className="min-h-[120px] resize-none"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setFormDialogOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !formData.question.trim() ||
                !formData.answer.trim()
              }
              className="rounded-xl px-8"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {editingFAQ ? "Update FAQ" : "Create FAQ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete FAQ</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this FAQ? This action cannot be
              undone.
              {deletingFAQ && (
                <span className="block mt-2 font-medium text-foreground">
                  "{deletingFAQ.question}"
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

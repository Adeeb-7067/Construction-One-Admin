import { PageHeader } from "@/components/shared/PageHeader";

export default function Quotations() {
  return (
    <div>
      <PageHeader title="Quotations" description="Manage service quotations" />
      <div className="rounded-lg border bg-card p-10 text-center text-muted-foreground">
        <p className="text-sm">No quotations yet. Quotations will appear here once created.</p>
      </div>
    </div>
  );
}

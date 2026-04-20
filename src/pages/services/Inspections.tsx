import { PageHeader } from "@/components/shared/PageHeader";

export default function Inspections() {
  return (
    <div>
      <PageHeader title="Inspections" description="Manage service inspections" />
      <div className="rounded-lg border bg-card p-10 text-center text-muted-foreground">
        <p className="text-sm">No inspections scheduled. Create one to get started.</p>
      </div>
    </div>
  );
}

import { Project } from "@/types/project"
import { getProgress, statusConfig } from "./project-card"
import { StatusPill, TONES } from "@/components/ui/status-pill"

// Helper for currency formatting
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

interface ProjectCardsProps {
  project: Project | null
}

export function SectionCards({ project }: ProjectCardsProps) {
  // --- 1. Project Status Logic ---
  const config = statusConfig[project?.status || "IN_PROGRESS"]
  const progressValue = getProgress(project?.status || "IN_PROGRESS")

  // --- 2. Deliverables Logic ---
  const deliverables = project?.deliverables || []
  const totalDeliverables = deliverables.length
  const approvedDeliverables = deliverables.filter(d => d.status === "approved").length
  const pendingDeliverables = deliverables.filter(d => d.status === "pending_review").length

  // Calculate completion percentage based on approved items
  const deliverableCompletion = totalDeliverables > 0
    ? Math.round((approvedDeliverables / totalDeliverables) * 100)
    : 0

  // --- 3. Invoices Logic ---
  const invoices = project?.invoices || []
  const totalInvoicedAmount = invoices.reduce((acc, inv) => acc + inv.amount, 0)
  const totalPaidAmount = invoices
    .filter(inv => inv.status === "PAID")
    .reduce((acc, inv) => acc + inv.amount, 0)

  const overdueCount = invoices.filter(inv => inv.status === "OVERDUE").length
  const hasOverdue = overdueCount > 0

  return (
    <div className="grid w-full grid-cols-1 divide-y divide-border rounded-xl border border-border bg-card md:grid-cols-3 md:divide-x md:divide-y-0">

      {/* Overall status */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">Project status</p>
          <StatusPill tone={config.tone}>{config.label}</StatusPill>
        </div>
        <p className="text-xl font-semibold tabular-nums">{progressValue}% complete</p>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className={`h-full rounded-full ${config.tone.dot}`} style={{ width: `${progressValue ?? 0}%` }} />
        </div>
        <p className="text-xs text-muted-foreground">
          Updated {project?.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : "never"}
        </p>
      </div>

      {/* Deliverables */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">Deliverables</p>
          <StatusPill tone={pendingDeliverables > 0 ? TONES.amber : TONES.neutral}>
            {pendingDeliverables > 0 ? `${pendingDeliverables} pending` : "All reviewed"}
          </StatusPill>
        </div>
        <p className="text-xl font-semibold tabular-nums">
          {totalDeliverables} <span className="text-sm font-normal text-muted-foreground">files</span>
        </p>
        <p className="mt-auto text-xs text-muted-foreground">
          {approvedDeliverables} approved &middot; {deliverableCompletion}% approval rate
        </p>
      </div>

      {/* Invoices */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">Paid so far</p>
          <StatusPill tone={hasOverdue ? TONES.red : TONES.emerald}>
            {hasOverdue ? `${overdueCount} overdue` : "Good standing"}
          </StatusPill>
        </div>
        <p className="text-xl font-semibold tabular-nums">{formatCurrency(totalPaidAmount)}</p>
        <p className="mt-auto text-xs text-muted-foreground">
          {formatCurrency(totalInvoicedAmount)} invoiced across {invoices.length} {invoices.length === 1 ? "invoice" : "invoices"}
        </p>
      </div>
    </div>
  )
}

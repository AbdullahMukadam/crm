import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Project } from "@/types/project"
import { getProgress, statusConfig } from "./project-card"
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp
} from "lucide-react"

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
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* CARD 1: OVERALL STATUS */}
      <Card className="flex flex-col justify-between h-full">
        <CardHeader className="w-full pb-2">
          <div className="flex justify-between items-start">
            <CardDescription>Project Status</CardDescription>
            <Badge variant="outline" className={`${config.color} bg-opacity-10`}>
              {config.label}
            </Badge>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums pt-2">
            {progressValue}% Complete
          </CardTitle>
          <div className="pt-2">
            <Progress value={progressValue} className="h-2 w-full" />
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm text-muted-foreground pt-0">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              Updated {project?.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : "Never"}
            </span>
          </div>
        </CardFooter>
      </Card>

      {/* CARD 2: DELIVERABLES */}
      <Card className="flex flex-col justify-between h-full">
        <CardHeader className="w-full pb-2">
          <div className="flex justify-between items-start">
            <CardDescription>Deliverables</CardDescription>
            <Badge variant="outline" className={pendingDeliverables > 0 ? "text-orange-500 border-orange-200" : "text-slate-500"}>
              {pendingDeliverables > 0 ? `${pendingDeliverables} Pending` : "All Reviewed"}
            </Badge>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums flex items-baseline gap-2 pt-2">
            {totalDeliverables} <span className="text-sm font-normal text-muted-foreground">files</span>
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm pt-0">
          <div className="flex items-center gap-2 font-medium text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            {approvedDeliverables} Approved
          </div>
          <div className="text-muted-foreground text-xs">
            {deliverableCompletion}% approval rate
          </div>
        </CardFooter>
      </Card>

      {/* CARD 3: INVOICES & REVENUE */}
      <Card className="flex flex-col justify-between h-full">
        <CardHeader className="w-full pb-2">
          <div className="flex justify-between items-start">
            <CardDescription>Total Revenue (Paid)</CardDescription>
            {hasOverdue ? (
              <Badge variant="destructive" className="flex gap-1">
                <AlertCircle className="h-3 w-3" /> {overdueCount} Overdue
              </Badge>
            ) : (
              <Badge variant={"outline"} className="text-green-600">
                Good Standing
              </Badge>
            )}
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums pt-2">
            {formatCurrency(totalPaidAmount)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm pt-0">
          <div className="flex items-center gap-2 font-medium">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Total Invoiced: <span className="text-foreground">{formatCurrency(totalInvoicedAmount)}</span>
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {invoices.length} invoices generated
          </div>
        </CardFooter>
      </Card>

    </div>
  )
}
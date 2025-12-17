import { Download, Search, CheckCircle2, Clock, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const invoices = [
  {
    id: "INV-2023-008",
    date: "Sep 15, 2023",
    amount: "$1,250.00",
    status: "overdue" as const,
  },
  {
    id: "INV-2023-009",
    date: "Oct 01, 2023",
    amount: "$3,200.00",
    status: "pending" as const,
  },
  {
    id: "INV-2023-007",
    date: "Aug 28, 2023",
    amount: "$4,500.00",
    status: "paid" as const,
  },
  {
    id: "INV-2023-006",
    date: "Aug 05, 2023",
    amount: "$8,000.00",
    status: "paid" as const,
  },
  {
    id: "INV-2023-005",
    date: "Jul 22, 2023",
    amount: "$12,000.00",
    status: "paid" as const,
  },
]

const statusConfig = {
  paid: {
    label: "Paid",
    className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  },
  overdue: {
    label: "Overdue",
    className: "bg-rose-100 text-rose-700 hover:bg-rose-100",
  },
}

export default function Invoices() {
  return (
    <div className="min-h-screen bg-background font-brcolage-grotesque">
      <div className="mx-auto max-w-7xl p-6 md:p-8 lg:p-12">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Invoices & Payments
            </h1>
            <p className="mt-2 text-pretty text-muted-foreground">
              Manage your billing history and settle outstanding invoices securely.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Paid</p>
                  <p className="text-3xl font-bold tracking-tight">$24,500.00</p>
                  <p className="text-xs text-muted-foreground">Lifetime payments</p>
                </div>
                <div className="rounded-full bg-emerald-100 p-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Pending Amount</p>
                  <p className="text-3xl font-bold tracking-tight">$3,200.00</p>
                  <p className="text-xs text-muted-foreground">Due within 30 days</p>
                </div>
                <div className="rounded-full bg-amber-100 p-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card sm:col-span-2 lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Next Due Date</p>
                  <p className="text-3xl font-bold tracking-tight">Oct 31, 2023</p>
                  <p className="text-xs text-muted-foreground">Invoice #INV-2023-009</p>
                </div>
                <div className="rounded-full bg-indigo-100 p-2">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoices Table */}
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            {/* Search and Filters */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search by invoice ID..." className="pl-9" />
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">
                  All Invoices
                </Button>
                <Button size="sm" variant="ghost">
                  Paid
                </Button>
                <Button size="sm" variant="ghost">
                  Pending
                </Button>
                <Button size="sm" variant="ghost">
                  Overdue
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold text-muted-foreground">INVOICE ID</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">DATE</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">AMOUNT</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">STATUS</TableHead>
                    <TableHead className="text-right font-semibold text-muted-foreground">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono font-medium">{invoice.id}</TableCell>
                      <TableCell className="text-muted-foreground">{invoice.date}</TableCell>
                      <TableCell className="font-semibold">{invoice.amount}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={statusConfig[invoice.status].className}>
                          {statusConfig[invoice.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{" "}
                <span className="font-medium">12</span> results
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

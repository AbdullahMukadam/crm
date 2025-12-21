"use client"
import { Download, Search, CheckCircle2, Clock, Calendar, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { useCallback, useEffect, useState } from "react"
import { fetchProjects } from "@/lib/store/features/projectSlice"
import { useInvoices } from "@/hooks/useInvoices"
import { format } from "date-fns"
import { CreateInvoice } from "../common/create-invoice"

const statusConfig: Record<string, { label: string; className: string }> = {
  PAID: {
    label: "Paid",
    className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200",
  },
  SENT: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200",
  },
  DRAFT: {
    label: "Draft",
    className: "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200",
  },
  OVERDUE: {
    label: "Overdue",
    className: "bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200",
  },
}

export default function Invoices() {
  const { projects, isLoading } = useAppSelector((state) => state.projects)
  const dispatch = useAppDispatch()
  const [searchQuery, setsearchQuery] = useState("")
  const [isOpen, setisOpen] = useState(false)

  // Use the hook to get real processed data
  const { invoices, stats, handleSearchInvoices } = useInvoices({ projects })

  useEffect(() => {
    // Only fetch if we don't have projects loaded (or you might want to refetch on mount)
    if (projects.length === 0) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length]);

 

  useEffect(() => {
    let timerId = setTimeout(() => {
      handleSearchInvoices(searchQuery)
    }, 2000);

    return () => clearTimeout(timerId)
  }, [searchQuery])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  if (isLoading) {
    return (
      <div className="w-full h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-background text-muted-foreground gap-2">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <p>Loading invoices...</p>
      </div>
    );
  }

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
              Manage your billing history and track revenue.
            </p>
          </div>
          <Button className="gap-2" onClick={() => setisOpen(true)}>
            <Plus className="h-4 w-4" /> Create Invoice
          </Button>
        </div>

        {/* Stats Cards - Now using Real Data */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* Total Paid Card */}
          <Card className="border-border bg-card shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Paid</p>
                  <p className="text-3xl font-bold tracking-tight">{formatCurrency(stats.totalPaid)}</p>
                  <p className="text-xs text-muted-foreground">Lifetime earnings</p>
                </div>
                <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/30">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Amount Card */}
          <Card className="border-border bg-card shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Pending Amount</p>
                  <p className="text-3xl font-bold tracking-tight">{formatCurrency(stats.pendingAmount)}</p>
                  <p className="text-xs text-muted-foreground">Due from clients</p>
                </div>
                <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900/30">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Due Date Card */}
          <Card className="border-border bg-card shadow-sm sm:col-span-2 lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Next Due Date</p>
                  <p className="text-3xl font-bold tracking-tight truncate">
                    {stats.nextDueDate || "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stats.nextDueInvoiceNumber ? `Invoice #${stats.nextDueInvoiceNumber}` : "All clear"}
                  </p>
                </div>
                <div className="rounded-full bg-indigo-100 p-2 dark:bg-indigo-900/30">
                  <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoices Table */}
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-6">
            {/* Search and Filters */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={searchQuery} onChange={(e) => setsearchQuery(e.target.value)} placeholder="Search by invoice ID..." className="pl-9" />
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary">All</Button>
                <Button size="sm" variant="ghost">Paid</Button>
                <Button size="sm" variant="ghost">Pending</Button>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-semibold text-muted-foreground">INVOICE ID</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">ISSUED</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">DUE</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">AMOUNT</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">STATUS</TableHead>
                    <TableHead className="text-right font-semibold text-muted-foreground">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.length > 0 ? (
                    invoices.map((invoice) => {
                      const status = statusConfig[invoice.status] || statusConfig.DRAFT;
                      return (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-mono font-medium text-indigo-600">
                            {invoice.invoiceNumber}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(invoice.createdAt), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell className="font-semibold">
                            {formatCurrency(Number(invoice.amount))}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={status.className}>
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No invoices found. Create one to get started!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <CreateInvoice 
      onOpenChange={setisOpen}
      open={isOpen}
      isUpdateLoading={false}
      projects={projects}

      />
    </div>
  )
}
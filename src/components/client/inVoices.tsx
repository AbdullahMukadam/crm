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
import { InvoiceStatus } from "@/types/project"
import DownloadInvoiceBtn from "../ui/downloadInvoiceBtn"

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

const InvoicesStatus = [
  { id: "PAID", label: "Paid" },
  { id: "SENT", label: "Sent" },
  { id: "DRAFT", label: "Draft" },
  { id: "OVERDUE", label: "Overdue" },
]

export default function Invoices() {
  const { projects, isLoading, isInvoiceLoading } = useAppSelector((state) => state.projects)
  const dispatch = useAppDispatch()
  const [searchQuery, setsearchQuery] = useState("")
  // const [isOpen, setisOpen] = useState(false) // Unused state removed for cleanup

  // Use the hook to get real processed data
  const { invoices, stats, handleSearchInvoices, handleFilterInvoices } = useInvoices({ projects })

  useEffect(() => {
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
      {/* Responsive Padding: p-4 on mobile, p-8 on tablet/desktop */}
      <div className="mx-auto w-full p-4 md:p-8 lg:p-12">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-balance text-2xl md:text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
              Invoices & Payments
            </h1>
            <p className="mt-2 text-sm md:text-base text-pretty text-muted-foreground">
              Manage your billing history and track revenue.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        {/* Using grid-cols-1 for mobile, 2 for tablet, 3 for large screens */}
        <div className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

          {/* Total Paid Card */}
          <Card className="border-border bg-card shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Paid</p>
                  <p className="text-2xl md:text-3xl font-bold tracking-tight">{formatCurrency(stats.totalPaid)}</p>
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
                  <p className="text-2xl md:text-3xl font-bold tracking-tight">{formatCurrency(stats.pendingAmount)}</p>
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
                  <p className="text-2xl md:text-3xl font-bold tracking-tight truncate">
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

        {/* Invoices Table Section */}
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-4 md:p-6">
            
            {/* Search and Filters - Stack vertically on mobile, row on tablet */}
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  value={searchQuery} 
                  onChange={(e) => setsearchQuery(e.target.value)} 
                  placeholder="Search by invoice ID..." 
                  className="pl-9 w-full" 
                />
              </div>
              
              {/* Filter Buttons: flex-wrap ensures they don't squash on mobile */}
              <div className="flex flex-wrap gap-2">
                {InvoicesStatus.map((inv) => (
                  <Button 
                    key={inv.id} 
                    size="sm" 
                    variant="secondary" 
                    className="flex-grow sm:flex-grow-0"
                    onClick={() => handleFilterInvoices(inv.id as InvoiceStatus)}
                  >
                    {inv.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Table Container - overflow-x-auto allows scrolling on mobile */}
            <div className="rounded-md border border-border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-semibold text-muted-foreground whitespace-nowrap">INVOICE ID</TableHead>
                    {/* Hiding Date columns on small screens to prioritize ID, Amount, Status */}
                    <TableHead className="font-semibold text-muted-foreground whitespace-nowrap hidden md:table-cell">ISSUED</TableHead>
                    <TableHead className="font-semibold text-muted-foreground whitespace-nowrap hidden sm:table-cell">DUE</TableHead>
                    <TableHead className="font-semibold text-muted-foreground whitespace-nowrap">AMOUNT</TableHead>
                    <TableHead className="font-semibold text-muted-foreground whitespace-nowrap">STATUS</TableHead>
                    <TableHead className="text-right font-semibold text-muted-foreground whitespace-nowrap">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.length > 0 ? (
                    invoices.map((invoice) => {
                      const status = statusConfig[invoice.status] || statusConfig.DRAFT;
                      return (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-mono font-medium text-indigo-600 whitespace-nowrap">
                            {invoice.invoiceNumber}
                          </TableCell>
                          
                          {/* Matching Header visibility logic */}
                          <TableCell className="text-muted-foreground whitespace-nowrap hidden md:table-cell">
                            {format(new Date(invoice.createdAt), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap hidden sm:table-cell">
                            {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                          </TableCell>
                          
                          <TableCell className="font-semibold whitespace-nowrap">
                            {formatCurrency(Number(invoice.amount))}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge variant="outline" className={status.className}>
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right whitespace-nowrap">
                            <DownloadInvoiceBtn invoice={invoice} onDownload={() => {
                              console.log(`Invoice ${invoice.invoiceNumber} downloaded`);
                            }} />
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
    </div>
  )
}
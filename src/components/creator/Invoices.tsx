"use client"

import { Search, CheckCircle2, Clock, Calendar, Loader2, Plus, MoreHorizontal, Pencil, Trash, Check, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { useEffect, useState } from "react"
import { deleteInvoiceSlice, editInvoiceSlice, fetchProjects } from "@/lib/store/features/projectSlice"
import { useInvoices } from "@/hooks/useInvoices"
import { format } from "date-fns"
import { CreateInvoice } from "../common/create-invoice"
import { EditInvoiceRequest, InvoiceStatus } from "@/types/project"
import DownloadInvoiceBtn from "../ui/downloadInvoiceBtn"
import { toast } from "sonner"
import { EditInvoice } from "@/components/common/edit-invoice"
// import emailjs from '@emailjs/browser'; 

const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
  PAID: {
    label: "Paid",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900",
    icon: CheckCircle2
  },
  SENT: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900",
    icon: Clock
  },
  DRAFT: {
    label: "Draft",
    className: "bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800",
    icon: FileText
  },
  OVERDUE: {
    label: "Overdue",
    className: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900",
    icon: Clock
  },
}

const InvoicesStatus = [
  { id: "PAID", label: "Paid" },
  { id: "SENT", label: "Sent" },
  { id: "DRAFT", label: "Draft" },
  { id: "OVERDUE", label: "Overdue" },
]

export default function Invoices() {
  const { projects, isLoading, isInvoiceLoading, isDeletingInvoice, isEditingInvoice } = useAppSelector((state) => state.projects)
  const dispatch = useAppDispatch()
  const [searchQuery, setsearchQuery] = useState("")
  const [isOpen, setisOpen] = useState(false)
  const [isEditInvoiceOpen, setisEditInvoiceOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)

  const { invoices, stats, handleSearchInvoices, handleFilterInvoices } = useInvoices({ projects })

  useEffect(() => {
    if (projects.length === 0) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length]);

  useEffect(() => {
    let timerId = setTimeout(() => {
      handleSearchInvoices(searchQuery)
    }, 500);
    return () => clearTimeout(timerId)
  }, [searchQuery])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  const handleMarkAsPaid = async (invoiceId: string) => {
    try {
      const data: Partial<EditInvoiceRequest> = {
        id: invoiceId,
        status: "PAID"
      }
      const response = await dispatch(editInvoiceSlice(data))

      if (editInvoiceSlice.fulfilled.match(response)) {
        toast.success("Invoice Updated Successfully")
      } else {
        toast.error("Failed to update invoice")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occured")
    }
  }

  const handleEditInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setisEditInvoiceOpen(true);
  }

  const handleDeleteInvoice = async (id: string) => {
    try {
      const response = await dispatch(deleteInvoiceSlice({ id }))
      if (deleteInvoiceSlice.fulfilled.match(response)) {
        toast.success("Invoice deleted successfully")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error Occured")
    }
  }

  // Shared Action Menu Component to avoid code duplication between Mobile/Desktop views
  const InvoiceActions = ({ invoice }: { invoice: any }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        
        <DropdownMenuItem className="cursor-pointer" asChild>
          <div className="flex items-center w-full">
            <DownloadInvoiceBtn
              invoice={invoice}
              onDownload={() => console.log('downloaded')}
            />
          </div>
        </DropdownMenuItem>

        {(invoice.status === 'SENT' || invoice.status === 'OVERDUE') && (
          <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice.id)} className="cursor-pointer text-emerald-600 focus:text-emerald-700">
            <Check className="mr-2 h-4 w-4" /> Mark as Paid
          </DropdownMenuItem>
        )}

        {invoice.status === 'DRAFT' && (
          <DropdownMenuItem onClick={() => handleEditInvoice(invoice)} className="cursor-pointer">
            <Pencil className="mr-2 h-4 w-4" /> Edit Invoice
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
          onClick={() => handleDeleteInvoice(invoice.id)}
          disabled={isDeletingInvoice}
        >
          <Trash className="mr-2 h-4 w-4" /> 
          {isDeletingInvoice ? "Deleting..." : "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (isLoading) {
    return (
      <div className="w-full h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-background text-muted-foreground gap-3">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
        <p className="text-sm font-medium">Loading your financial data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-brcolage-grotesque">
      <div className="mx-auto w-full max-w-7xl p-4 md:p-8">

        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Invoices
            </h1>
            <p className="mt-1 text-sm text-muted-foreground md:text-base">
              Manage your billing, track payments, and view revenue.
            </p>
          </div>
          <Button size="lg" className="w-full sm:w-auto shadow-sm" onClick={() => setisOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid</CardTitle>
              <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/20">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalPaid)}</div>
              <p className="text-xs text-muted-foreground mt-1">Lifetime earnings</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900/20">
                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.pendingAmount)}</div>
              <p className="text-xs text-muted-foreground mt-1">Outstanding payments</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Next Due</CardTitle>
              <div className="rounded-full bg-indigo-100 p-2 dark:bg-indigo-900/20">
                <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate">
                {stats.nextDueDate || "All Caught Up"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.nextDueInvoiceNumber ? `Invoice #${stats.nextDueInvoiceNumber}` : "No pending invoices"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Card */}
        <Card className="border shadow-sm">
          <CardHeader className="p-4 md:p-6 border-b bg-muted/40">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search clients or invoice ID..."
                  className="w-full bg-background pl-9"
                  value={searchQuery}
                  onChange={(e) => setsearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                {InvoicesStatus.map((inv) => (
                  <Button
                    key={inv.id}
                    size="sm"
                    variant="outline"
                    className="whitespace-nowrap rounded-full px-4"
                    onClick={() => handleFilterInvoices(inv.id as InvoiceStatus)}
                  >
                    {inv.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Desktop Table View (Hidden on Mobile) */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.length > 0 ? (
                    invoices.map((invoice) => {
                      const status = statusConfig[invoice.status] || statusConfig.DRAFT;
                      return (
                        <TableRow key={invoice.id} className="hover:bg-muted/50">
                          <TableCell className="font-mono font-medium">{invoice.invoiceNumber}</TableCell>
                          <TableCell>
                            <div className="font-medium">{invoice.client?.username || "Unknown"}</div>
                            <div className="text-xs text-muted-foreground">{invoice.client?.email}</div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{invoice.project?.title || "General"}</TableCell>
                          <TableCell className="whitespace-nowrap text-muted-foreground">
                            {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell className="font-semibold">{formatCurrency(Number(invoice.amount))}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`rounded-full px-3 py-0.5 ${status.className}`}>
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <InvoiceActions invoice={invoice} />
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <FileText className="h-8 w-8 mb-2 opacity-20" />
                          <p>No invoices found matching your search.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile List View (Hidden on Desktop) */}
            <div className="md:hidden">
              {invoices.length > 0 ? (
                <div className="divide-y">
                  {invoices.map((invoice) => {
                    const status = statusConfig[invoice.status] || statusConfig.DRAFT;
                    return (
                      <div key={invoice.id} className="p-4 flex flex-col gap-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <span className="font-mono text-xs text-muted-foreground">#{invoice.invoiceNumber}</span>
                            <p className="font-semibold text-sm">{invoice.client?.username || "Unknown Client"}</p>
                            <p className="text-xs text-muted-foreground">{invoice.project?.title || "General"}</p>
                          </div>
                          <Badge variant="outline" className={`rounded-full ${status.className}`}>
                            {status.label}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-sm">
                            <span className="text-muted-foreground mr-2">Amount:</span>
                            <span className="font-bold">{formatCurrency(Number(invoice.amount))}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                                Due: {format(new Date(invoice.dueDate), 'MMM dd')}
                            </span>
                            <InvoiceActions invoice={invoice} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                   <FileText className="h-8 w-8 mx-auto mb-2 opacity-20" />
                   <p>No invoices found.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <CreateInvoice
        onOpenChange={setisOpen}
        open={isOpen}
        isInvoiceLoading={isInvoiceLoading}
        projects={projects}
      />

      <EditInvoice
        open={isEditInvoiceOpen}
        onOpenChange={setisEditInvoiceOpen}
        isInvoiceLoading={isEditingInvoice}
        projects={projects}
        invoice={selectedInvoice}
      />
    </div>
  )
}
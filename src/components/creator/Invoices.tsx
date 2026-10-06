"use client"

import { Search, Loader2, Plus, MoreHorizontal, Pencil, Trash, Check, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { EditInvoiceRequest } from "@/types/project"
import DownloadInvoiceBtn from "../ui/downloadInvoiceBtn"
import { toast } from "sonner"
import { EditInvoice } from "@/components/common/edit-invoice"
import { StatusPill, TONES, Tone } from "@/components/ui/status-pill"
import { PageHeader } from "@/components/ui/page-header"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import emailjs from '@emailjs/browser'; 

const statusConfig: Record<string, { label: string; tone: Tone }> = {
  DRAFT: { label: "Draft", tone: TONES.neutral },
  SENT: { label: "Pending", tone: TONES.amber },
  PAID: { label: "Paid", tone: TONES.emerald },
  OVERDUE: { label: "Overdue", tone: TONES.red },
}

export default function Invoices() {
  const { projects, isLoading, isInvoiceLoading, isDeletingInvoice, isEditingInvoice } = useAppSelector((state) => state.projects)
  const dispatch = useAppDispatch()
  const [searchQuery, setsearchQuery] = useState("")
  const [isOpen, setisOpen] = useState(false)
  const [isEditInvoiceOpen, setisEditInvoiceOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)

  const [statusFilter, setStatusFilter] = useState<"ALL" | keyof typeof statusConfig>("ALL")
  const { invoices: searchedInvoices, stats, handleSearchInvoices } = useInvoices({ projects })
  const invoices = statusFilter === "ALL" ? searchedInvoices : searchedInvoices.filter((inv) => inv.status === statusFilter)

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
          <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice.id)} className="cursor-pointer text-emerald-600 dark:text-emerald-400">
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
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">

        <PageHeader
          title="Invoices"
          description={`${stats.totalCount} ${stats.totalCount === 1 ? "invoice" : "invoices"}`}
          actions={
            <Button size="sm" className="gap-1.5" onClick={() => setisOpen(true)}>
              <Plus className="size-4" /> New invoice
            </Button>
          }
        >
          <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <TabsList variant="line" className="h-8 overflow-x-auto">
              <TabsTrigger value="ALL" className="flex-none px-2.5">All</TabsTrigger>
              {Object.entries(statusConfig).map(([key, st]) => (
                <TabsTrigger key={key} value={key} className="flex-none px-2.5">{st.label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Invoice number or amount..."
              className="h-8 pl-8"
              value={searchQuery}
              onChange={(e) => setsearchQuery(e.target.value)}
            />
          </div>
        </PageHeader>

        {/* Stats strip */}
        <div className="my-6 grid grid-cols-1 divide-y divide-border rounded-xl border border-border bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="p-4">
            <p className="text-xs text-muted-foreground">Total paid</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">{formatCurrency(stats.totalPaid)}</p>
          </div>
          <div className="p-4">
            <p className="text-xs text-muted-foreground">Outstanding</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">{formatCurrency(stats.pendingAmount)}</p>
          </div>
          <div className="p-4">
            <p className="text-xs text-muted-foreground">Next due</p>
            <p className="mt-1 truncate text-xl font-semibold">{stats.nextDueInvoiceNumber ? stats.nextDueDate : "All caught up"}</p>
            {stats.nextDueInvoiceNumber && <p className="mt-0.5 text-xs text-muted-foreground">Invoice #{stats.nextDueInvoiceNumber}</p>}
          </div>
        </div>

        <div>
            {/* Desktop Table View (Hidden on Mobile) */}
            <div className="hidden md:block rounded-xl border border-border bg-card overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="w-[100px] h-9 text-xs font-medium text-muted-foreground whitespace-nowrap">Invoice</TableHead>
                    <TableHead className="h-9 text-xs font-medium text-muted-foreground whitespace-nowrap">Client</TableHead>
                    <TableHead className="h-9 text-xs font-medium text-muted-foreground whitespace-nowrap">Project</TableHead>
                    <TableHead className="h-9 text-xs font-medium text-muted-foreground whitespace-nowrap">Due Date</TableHead>
                    <TableHead className="h-9 text-xs font-medium text-muted-foreground whitespace-nowrap">Amount</TableHead>
                    <TableHead className="h-9 text-xs font-medium text-muted-foreground whitespace-nowrap">Status</TableHead>
                    <TableHead className="text-right h-9 text-xs font-medium text-muted-foreground whitespace-nowrap">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.length > 0 ? (
                    invoices.map((invoice) => {
                      const status = statusConfig[invoice.status] || statusConfig.DRAFT;
                      return (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-mono font-medium whitespace-nowrap">{invoice.invoiceNumber}</TableCell>
                          <TableCell>
                            <div className="font-medium whitespace-nowrap">{invoice.client?.username || "Unknown"}</div>
                            <div className="text-xs text-muted-foreground">{invoice.client?.email}</div>
                          </TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap">{invoice.project?.title || "General"}</TableCell>
                          <TableCell className="whitespace-nowrap text-muted-foreground">
                            {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell className="font-semibold whitespace-nowrap">{formatCurrency(Number(invoice.amount))}</TableCell>
                          <TableCell>
                            <StatusPill tone={status.tone}>{status.label}</StatusPill>
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
            <div className="md:hidden rounded-xl border border-border bg-card">
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
                          <StatusPill tone={status.tone}>{status.label}</StatusPill>
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
        </div>
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
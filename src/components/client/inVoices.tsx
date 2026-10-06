"use client"

import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { StatusPill, TONES, Tone } from "@/components/ui/status-pill"
import { PageHeader } from "@/components/ui/page-header"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { useEffect, useState } from "react"
import { fetchProjects } from "@/lib/store/features/projectSlice"
import { useInvoices } from "@/hooks/useInvoices"
import { format } from "date-fns"
import DownloadInvoiceBtn from "../ui/downloadInvoiceBtn"

const statusConfig: Record<string, { label: string; tone: Tone }> = {
  SENT: { label: "Pending", tone: TONES.amber },
  PAID: { label: "Paid", tone: TONES.emerald },
  OVERDUE: { label: "Overdue", tone: TONES.red },
  DRAFT: { label: "Draft", tone: TONES.neutral },
}

export default function Invoices() {
  const { projects, isLoading, isInvoiceLoading } = useAppSelector((state) => state.projects)
  const dispatch = useAppDispatch()
  const [searchQuery, setsearchQuery] = useState("")

  // Use the hook to get real processed data
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

  if (isLoading) {
    return (
      <div className="w-full h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-background text-muted-foreground gap-2">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <p>Loading invoices...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">

        <PageHeader
          title="Invoices"
          description="Your billing history and payments."
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
              value={searchQuery}
              onChange={(e) => setsearchQuery(e.target.value)}
              placeholder="Invoice number or amount..."
              className="h-8 pl-8"
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
            <p className="text-xs text-muted-foreground">Amount due</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">{formatCurrency(stats.pendingAmount)}</p>
          </div>
          <div className="p-4">
            <p className="text-xs text-muted-foreground">Next due</p>
            <p className="mt-1 truncate text-xl font-semibold">{stats.nextDueInvoiceNumber ? stats.nextDueDate : "All clear"}</p>
            {stats.nextDueInvoiceNumber && <p className="mt-0.5 text-xs text-muted-foreground">Invoice #{stats.nextDueInvoiceNumber}</p>}
          </div>
        </div>

        <div>
            {/* Table Container - overflow-x-auto allows scrolling on mobile */}
            <div className="rounded-xl border border-border bg-card overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="h-9 text-xs font-medium text-muted-foreground whitespace-nowrap">Invoice</TableHead>
                    {/* Hiding Date columns on small screens to prioritize ID, Amount, Status */}
                    <TableHead className="h-9 text-xs font-medium text-muted-foreground whitespace-nowrap hidden md:table-cell">Issued</TableHead>
                    <TableHead className="h-9 text-xs font-medium text-muted-foreground whitespace-nowrap hidden sm:table-cell">Due</TableHead>
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
                          <TableCell className="font-mono font-medium whitespace-nowrap">
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
                            <StatusPill tone={status.tone}>{status.label}</StatusPill>
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
                        No invoices here yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
        </div>
      </div>
    </div>
  )
}
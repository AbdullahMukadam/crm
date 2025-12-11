"use client";

import { createProposalSlice, deleteProposal, fetchProposals } from "@/lib/store/features/proposalsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Plus, Loader2, Trash2, Search, FileInput, MoreHorizontal, Copy, Share2, ExternalLink, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, ChevronDown, CheckCircle2, XCircle, Clock, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { Proposal, ProposalStatus } from "@/types/proposal";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";

const statusStyles: Record<string, {
    label: string;
    icon: React.ElementType;
    color: string;
    borderColor: string;
    bgColor: string;
}> = {
    accepted: {
        label: "Accepted",
        icon: CheckCircle2,
        color: "text-emerald-500",
        borderColor: "border-emerald-500/20", // Low opacity border
        bgColor: "bg-emerald-500/10",         // Very low opacity background
    },
    rejected: {
        label: "Rejected",
        icon: XCircle,
        color: "text-red-500",
        borderColor: "border-red-500/20",
        bgColor: "bg-red-500/10",
    },
    draft: {
        label: "Draft",
        icon: Clock,
        color: "text-orange-500",
        borderColor: "border-orange-500/20",
        bgColor: "bg-orange-500/10",
    },
    sent: {
        label: "Sent",
        icon: Send, // or Loader2 for 'processing' look
        color: "text-blue-500",
        borderColor: "border-blue-500/20",
        bgColor: "bg-blue-500/10",
    },
};

const createColumns = (
    onDelete: (id: string) => void,
    onShare: (id: string) => void,
    onOpen: (id: string) => void,
    isDeleting: boolean
): ColumnDef<Proposal>[] => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="translate-y-[2px] border-[0.1px] border-zinc-600"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-[2px] border-[0.1px] border-zinc-600"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "id",
            header: "Proposal ID",
            cell: ({ row }) => (
                <span className="text-sm font-medium text-muted-foreground">
                    {row.getValue("id")}
                </span>
            ),
        },
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => (
                <span className="text-sm font-medium">{row.getValue("title")}</span>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Created Date",
            cell: ({ row }) => {
                const date = new Date(row.getValue("createdAt"));
                return (
                    <span className="text-sm text-muted-foreground">
                        {date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </span>
                );
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const data: string = row.getValue("status")
                const config = statusStyles[data.toLowerCase()] || statusStyles.draft;
                const Icon = config.icon;

                return (
                    <div className="flex items-center">
                        <span
                            className={`
              flex items-center gap-1.5 
              px-2.5 py-0.5 rounded-full text-xs font-medium border
              ${config.color} 
              ${config.borderColor} 
              ${config.bgColor}
            `}
                        >
                            {/* The Icon */}
                            <Icon className="h-3.5 w-3.5" />

                            {/* The Text */}
                            <span className="capitalize">{config.label}</span>
                        </span>
                    </div>
                );
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const proposal = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(proposal.id)}
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Proposal ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onShare(proposal.id)}
                            >
                                <Share2 className="mr-2 h-4 w-4" />
                                Share Link
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onOpen(proposal.id)}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Open Builder
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(proposal.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                {isDeleting ? "deleting" : "Delete"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];


function ProposalsClient() {
    const { proposals, isLoading, error } = useAppSelector((state) => state.proposal);
    const { id } = useAppSelector((state) => state.auth);
    const [isDialogOpen, setisDialogOpen] = useState(false);
    const [proposalTitle, setproposalTitle] = useState("");
    const [proposalDescription, setproposalDescription] = useState("");
    const [isProposalCreatedLoadind, setisProposalCreatedLoadind] = useState(false);
    const [isProposalDeletedLoading, setisProposalDeletedLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    useEffect(() => {
        if (proposals.length === 0) dispatch(fetchProposals());
    }, []);

    const filteredProposals = React.useMemo(() => {
        return proposals.filter((proposal) =>
            searchQuery === "" ||
            proposal.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            proposal.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [proposals, searchQuery]);

    const createProposal = useCallback(
        async () => {
            setisProposalCreatedLoadind(true);

            if (!proposalTitle || !id || !proposalDescription) {
                toast.error("Please enter a proposal title or description");
                setisProposalCreatedLoadind(false);
                return;
            }

            try {
                const response = await dispatch(createProposalSlice({
                    title: proposalTitle,
                    description : proposalDescription,
                    creatorId: id
                }))

                if (createProposalSlice.fulfilled.match(response)) {
                    dispatch(fetchProposals())
                    router.push(`/proposals/builder/${response.payload.id}`);
                } else if (createProposalSlice.rejected.match(response)) {
                    toast.error(response.payload as string || "Unable to create a proposal");
                }

            } catch (error) {
                toast.error("Unable to create a proposal");
            } finally {
                setisProposalCreatedLoadind(false);
            }
        },
        [proposalTitle, id]
    );

    const handleDeleteProposal = useCallback(async (proposalId: string) => {
        try {
            setisProposalDeletedLoading(true)

            const response = await dispatch(deleteProposal(proposalId))

            if (deleteProposal.fulfilled.match(response)) {
                dispatch(fetchProposals())
            } else if (deleteProposal.rejected.match(response)) {
                toast.error(response.payload as string || "Unable to delete a proposal");
            }

        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to delete the proposal")
        } finally {
            setisProposalDeletedLoading(false)
        }
    }, [])

    const handleCreateSharableLink = useCallback((proposalId: string) => {
        const url = process.env.NEXT_PUBLIC_APP_URL + `/proposals/viewer/${proposalId}`
        navigator.clipboard.writeText(url)
        toast.success("Link Coppied Successfully")
    }, [])

    const handleOpenBuilder = useCallback((proposalId: string) => {
        router.push(`/proposals/builder/${proposalId}`);
    }, []);

    const columns = React.useMemo(
        () => createColumns(
            handleDeleteProposal,
            handleCreateSharableLink,
            handleOpenBuilder,
            isProposalDeletedLoading
        ),
        [handleDeleteProposal, handleCreateSharableLink, handleOpenBuilder, isProposalDeletedLoading]
    );

    const table = useReactTable({
        data: filteredProposals,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        initialState: {
            pagination: {
                pageSize: 8,
            },
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    if (isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-zinc-950 text-zinc-300">
                <Loader2 className="animate-spin mr-2" /> Loading proposals...
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-background p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">Proposals</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage and organize your proposals
                        </p>
                    </div>
                    <Button onClick={() => setisDialogOpen(true)} className="gap-2">
                        <Plus size={18} />
                        New Proposal
                    </Button>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-border bg-card">
                    {/* Filters Bar */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-b border-border p-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative w-full md:w-auto">
                                <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search proposals..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8 h-9 w-full md:w-[700px] border border-zinc-800"
                                />
                            </div>
                        </div>

                        <Button variant="outline" size="sm" className="h-9 gap-2">
                            <FileInput className="size-4" />
                            Export
                        </Button>
                    </div>

                    {/* Table Content */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="bg-muted/50">
                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                className="text-muted-foreground font-medium bg-[#1E1E1E]"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border p-4">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-8"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <ChevronsLeft className="size-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-8"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <ChevronLeft className="size-4" />
                            </Button>

                            <div className="flex items-center gap-1">
                                {Array.from(
                                    { length: Math.min(5, table.getPageCount()) },
                                    (_, i) => {
                                        const pageIndex = i;
                                        const isActive =
                                            table.getState().pagination.pageIndex === pageIndex;
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => table.setPageIndex(pageIndex)}
                                                className={cn(
                                                    "size-8 rounded-lg text-sm font-semibold",
                                                    isActive
                                                        ? "bg-muted text-foreground"
                                                        : "text-foreground hover:bg-muted"
                                                )}
                                            >
                                                {pageIndex + 1}
                                            </button>
                                        );
                                    }
                                )}
                                {table.getPageCount() > 5 && (
                                    <>
                                        <span className="px-2 text-muted-foreground">...</span>
                                        <button
                                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                            className="size-8 rounded-lg text-sm font-semibold text-foreground hover:bg-muted"
                                        >
                                            {table.getPageCount()}
                                        </button>
                                    </>
                                )}
                            </div>

                            <Button
                                variant="outline"
                                size="icon"
                                className="size-8"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <ChevronRight className="size-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-8"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <ChevronsRight className="size-4" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                                Showing{" "}
                                {table.getState().pagination.pageIndex *
                                    table.getState().pagination.pageSize +
                                    1}{" "}
                                to{" "}
                                {Math.min(
                                    (table.getState().pagination.pageIndex + 1) *
                                    table.getState().pagination.pageSize,
                                    table.getFilteredRowModel().rows.length
                                )}{" "}
                                of {table.getFilteredRowModel().rows.length} entries
                            </span>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 gap-2">
                                        Show {table.getState().pagination.pageSize}
                                        <ChevronDown className="size-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {[5, 8, 10, 20, 50].map((size) => (
                                        <DropdownMenuItem
                                            key={size}
                                            onClick={() => table.setPageSize(size)}
                                        >
                                            Show {size}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Proposal Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setisDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">
                            Create New Proposal
                        </DialogTitle>
                        <DialogDescription>
                            Enter a title for your new proposal.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="Enter proposal title"
                                value={proposalTitle}
                                onChange={(e) => setproposalTitle(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 mt-2">
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Enter proposal description"
                                value={proposalDescription}
                                onChange={(e) => setproposalDescription(e.target.value)}
                                required
                                className="resize-none"
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="button"
                            onClick={createProposal}
                            disabled={isProposalCreatedLoadind}
                        >
                            {isProposalCreatedLoadind ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ProposalsClient;

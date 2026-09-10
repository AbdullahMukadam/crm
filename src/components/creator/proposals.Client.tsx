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
import { Proposal } from "@/types/proposal";
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
        borderColor: "border-emerald-500/20",
        bgColor: "bg-emerald-500/10",
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
        icon: Send,
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
                // Added max-width and truncate for mobile responsiveness
                <div className="text-sm font-medium max-w-[150px] sm:max-w-[250px] md:max-w-none truncate">
                    {row.getValue("title")}
                </div>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Created Date",
            cell: ({ row }) => {
                const date = new Date(row.getValue("createdAt"));
                return (
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
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
                            <Icon className="h-3.5 w-3.5" />
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
    const [proposalDescription, setProposalDescription] = useState("");
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
                    description: proposalDescription,
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
        [proposalTitle, id, proposalDescription]
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
            <div className="w-full h-screen flex items-center justify-center bg-background text-muted-foreground">
                <Loader2 className="animate-spin mr-2" /> Loading proposals...
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-background">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
                {/* Header - Stacks on mobile */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Proposals</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage and organize your proposals
                        </p>
                    </div>
                    <Button onClick={() => setisDialogOpen(true)} className="w-full sm:w-auto gap-2">
                        <Plus size={18} />
                        New Proposal
                    </Button>
                </div>

                {/* Table Container */}
                <div className="rounded-xl border border-border bg-card">
                    {/* Filters Bar - Stacks on mobile */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-b border-border p-4">
                        <div className="flex flex-1 items-center gap-2">
                            <div className="relative w-full md:max-w-md">
                                <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                        placeholder="Search proposals..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-8 h-9 w-full border-border"
                                    />
                            </div>
                        </div>
                    </div>

                    {/* Table Content */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="bg-muted/50">
                                        {headerGroup.headers.map((header) => {
                                            // Responsive Logic: Determine if column should be hidden
                                            const isHiddenOnMobile = header.id === 'createdAt' ? 'hidden md:table-cell' : '';
                                            const isHiddenOnTablet = header.id === 'id' ? 'hidden lg:table-cell' : '';

                                            return (
                                                <TableHead
                                                    key={header.id}
                                                    className={cn(
                                                        "text-muted-foreground font-medium",
                                                        isHiddenOnMobile,
                                                        isHiddenOnTablet
                                                    )}
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
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
                                            {row.getVisibleCells().map((cell) => {
                                                // Responsive Logic: Apply same hiding logic to cells
                                                const isHiddenOnMobile = cell.column.id === 'createdAt' ? 'hidden md:table-cell' : '';
                                                const isHiddenOnTablet = cell.column.id === 'id' ? 'hidden lg:table-cell' : '';

                                                return (
                                                    <TableCell
                                                        key={cell.id}
                                                        className={cn(isHiddenOnMobile, isHiddenOnTablet)}
                                                    >
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                )
                                            })}
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

                    {/* Pagination - Simplified on mobile */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border p-4">
                        <div className="flex items-center gap-2 sm:gap-4 w-full justify-between sm:justify-start">
                            <span className="text-xs sm:text-sm text-muted-foreground">
                                {table.getFilteredRowModel().rows.length} entries
                            </span>

                            <div className="flex items-center gap-1 sm:gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="size-8"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    <ChevronLeft className="size-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="size-8"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Hide advanced pagination on very small screens, show simple prev/next above */}
                        <div className="hidden sm:flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                            </span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 gap-2">
                                        {table.getState().pagination.pageSize} rows
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

            {/* Create Proposal Dialog - same layout as invoice dialogs */}
            <Dialog open={isDialogOpen} onOpenChange={setisDialogOpen}>
                <DialogContent className="bg-card border-border">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">Create New Proposal</DialogTitle>
                        <DialogDescription>Start with a title and description for your new proposal.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={(e) => { e.preventDefault(); createProposal(); }} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-foreground">Title</Label>
                            <Input
                                id="title"
                                placeholder="Enter proposal title"
                                value={proposalTitle}
                                onChange={(e) => setproposalTitle(e.target.value)}
                                className="bg-background border-border"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-foreground">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Enter proposal description"
                                value={proposalDescription}
                                onChange={(e) => setProposalDescription(e.target.value)}
                                required
                                className="bg-background border-border resize-none"
                            />
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline" className="border-border text-foreground hover:bg-muted">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={isProposalCreatedLoadind}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
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
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ProposalsClient;
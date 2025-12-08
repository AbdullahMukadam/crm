"use client";

import { FetchProposals } from "@/lib/store/features/proposalsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Plus, Loader2, Trash2, EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";
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
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import proposalService from "@/lib/api/proposalService";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";

function ProposalsClient() {
    const { proposals, isLoading } = useAppSelector((state) => state.proposal);
    const { id } = useAppSelector((state) => state.auth);
    const [isDialogOpen, setisDialogOpen] = useState(false);
    const [proposalTitle, setproposalTitle] = useState("");
    const [isProposalCreatedLoadind, setisProposalCreatedLoadind] = useState(false);
    const [isProposalDeletedLoading, setisProposalDeletedLoading] = useState(false)
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        if (proposals.length === 0) dispatch(FetchProposals());
    }, []);

    const createProposal = useCallback(
        async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setisProposalCreatedLoadind(true);

            if (!proposalTitle || !id) {
                toast.error("Please enter a proposal title");
                setisProposalCreatedLoadind(false);
                return;
            }

            try {
                const response = await proposalService.createProposal({
                    title: proposalTitle,
                    creatorId: id,
                });

                if (!response.success) {
                    toast.error(response.message || "Error from server");
                    return;
                }

                router.push(`/proposals/builder/${response.data?.proposal.id}`);
            } catch (error) {
                console.error(error);
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

            const response = await proposalService.deleteProposal(proposalId)
            if (response.success) {
                toast.success("Proposal Deleted Successfully")
                dispatch(FetchProposals())
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to deletd the proposal")
        } finally {
            setisProposalDeletedLoading(false)
        }
    }, [])

    const handleCreateSharableLink = useCallback((proposalId: string) => {
        const url = process.env.NEXT_PUBLIC_APP_URL + `/proposals/viewer/${proposalId}`
        navigator.clipboard.writeText(url)
        toast.success("Link Coppied Successfully")
    }, [])

    if (isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-zinc-950 text-zinc-300">
                <Loader2 className="animate-spin mr-2" /> Loading proposals...
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-zinc-950 text-zinc-100 p-6 font-brcolage-grotesque">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 flex-wrap gap-3">
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Your Proposals</h1>
                <Button
                    onClick={() => setisDialogOpen(true)}
                    className="flex items-center gap-2 border border-zinc-700"
                >
                    <Plus size={18} /> New Proposal
                </Button>
            </div>

            {/* Proposals List */}
            {proposals.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {proposals.map((proposal) => (
                        <Card
                            key={proposal.id}
                            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:shadow-md transition-all duration-200 group"
                        >
                            <CardHeader className="pb-2 flex items-center justify-between">
                                <CardTitle className="text-lg font-medium truncate text-white">
                                    {proposal.title}
                                </CardTitle>
                                <Menubar className="bg-transparent border-none p-0">
                                    <MenubarMenu>
                                        <MenubarTrigger>
                                            <EllipsisVertical size={16} color="white" />
                                        </MenubarTrigger>
                                        <MenubarContent>
                                            <MenubarItem onClick={()=> handleCreateSharableLink(proposal.id)}>Share</MenubarItem>
                                            <MenubarSeparator />
                                            <MenubarItem  onClick={() => handleDeleteProposal(proposal.id)}>{isProposalDeletedLoading ? <Loader2 className="animate-spin" /> : "Delete" }</MenubarItem>
                                        </MenubarContent>
                                    </MenubarMenu>
                                </Menubar>
                            </CardHeader>
                            <CardContent className="text-sm text-zinc-400 space-y-1">
                                <p>ID: {proposal.id}</p>
                                <p>
                                    Created:{" "}
                                    {proposal.createdAt
                                        ? new Date(proposal.createdAt).toLocaleDateString()
                                        : "N/A"}
                                </p>
                            </CardContent>
                            <CardFooter className="pt-3 flex justify-between items-center border-t border-zinc-800">
                                <Link
                                    href={`/proposals/builder/${proposal.id}`}
                                    className="text-sm text-zinc-300 hover:text-white transition-colors"
                                >
                                    Open
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-zinc-400 hover:text-red-500 transition-colors"
                                    onClick={() => handleDeleteProposal(proposal.id)}
                                >
                                    {isProposalDeletedLoading ? <Loader2 className="animate-spin" /> : <Trash2 size={16} />}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center mt-20">
                    <h2 className="text-xl font-medium text-zinc-200">No Proposals Found</h2>
                    <p className="text-zinc-400 mt-2 text-sm">
                        You haven’t created any proposals yet.
                    </p>
                    <Button
                        onClick={() => setisDialogOpen(true)}
                        className="mt-5 flex items-center gap-2 border border-zinc-700 hover:bg-zinc-800"
                    >
                        <Plus size={18} /> Create Proposal
                    </Button>
                </div>
            )}

            {/* Create Proposal Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setisDialogOpen}>
                <DialogContent className="sm:max-w-[400px] bg-zinc-900 text-zinc-100 border border-zinc-700">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">
                            Create New Proposal
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Enter a title for your new proposal.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={createProposal} className="mt-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Enter proposal title"
                                value={proposalTitle}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setproposalTitle(e.target.value)
                                }
                                required
                                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:ring-zinc-600"
                            />
                        </div>

                        <DialogFooter className="mt-6 flex justify-end gap-2">
                            <DialogClose asChild>
                                <Button type="button" variant="outline" className="py-4">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={isProposalCreatedLoadind}

                            >
                                {isProposalCreatedLoadind ? "Please wait..." : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ProposalsClient;

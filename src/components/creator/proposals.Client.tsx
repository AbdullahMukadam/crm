"use client";
import { FetchProposals } from "@/lib/store/features/proposalsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
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
                router.push(`/proposals/builder/${response.data?.id}`);
            } catch (error) {
                console.error(error);
                toast.error("Unable to create a proposal");
            } finally {
                setisProposalCreatedLoadind(false);
            }
        },
        [proposalTitle, id]
    );

    if (isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-background">
                <span className="text-lg text-muted-foreground animate-pulse">Loading proposals...</span>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-zinc-950 text-white p-6 font-brcolage-grotesque flex flex-col">
            <div className="flex justify-between items-center flex-wrap gap-3 mb-6">
                <h1 className="text-2xl sm:text-3xl font-semibold">Your Proposals</h1>
                <Button onClick={() => setisDialogOpen(true)} className="flex items-center gap-2 border border-gray-600">
                    <Plus size={18} /> New Proposal
                </Button>
            </div>

            {proposals.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {proposals.map((proposal) => (
                        <Link key={proposal.id} href={`/proposals/builder/${proposal.id}`}>
                            <Card className="hover:shadow-lg bg-zinc-900 text-white transition-shadow duration-200 cursor-pointer border border-gray-400">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold truncate">
                                        {proposal.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-zinc-300">ID: {proposal.id}</p>
                                </CardContent>
                                <CardFooter>
                                    <p className="text-xs text-zinc-400">
                                        Created At: {proposal.createdAt ? new Date(proposal.createdAt).toLocaleDateString() : "N/A"}
                                    </p>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center flex-1 text-center mt-12">
                    <h2 className="text-2xl font-semibold">No Proposals Found</h2>
                    <p className="text-muted-foreground mt-2">You haven’t created any proposals yet.</p>
                    <Button onClick={() => setisDialogOpen(true)} className="mt-4 flex items-center gap-2">
                        <Plus size={18} /> Create Proposal
                    </Button>
                </div>
            )}

            {/* Create Proposal Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setisDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Create New Proposal</DialogTitle>
                        <DialogDescription>Enter a title for your new proposal.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={createProposal} className="mt-3 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Enter proposal title"
                                value={proposalTitle}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setproposalTitle(e.target.value)}
                                required
                            />
                        </div>

                        <DialogFooter className="mt-5 flex justify-end gap-2">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isProposalCreatedLoadind}>
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

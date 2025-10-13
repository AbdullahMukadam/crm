"use client"
import { FetchProposals } from '@/lib/store/features/proposalsSlice'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { toast } from 'sonner'
import proposalService from '@/lib/api/proposalService'

function ProposalsClient() {
    const { proposals, isLoading } = useAppSelector((state) => state.proposal)
    const { id } = useAppSelector((state) => state.auth)
    const [isDialogOpen, setisDialogOpen] = useState(false)
    const [proposalTitle, setproposalTitle] = useState("")
    const [isProposalCreatedLoadind, setisProposalCreatedLoadind] = useState(false)
    const dispatch = useAppDispatch()
    const router = useRouter()

    useEffect(() => {
        if (proposals.length === 0) {
            dispatch(FetchProposals())
        }
    }, [])

    const createProposal = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation()
        setisProposalCreatedLoadind(true)
        console.log("is submited")

        if (!proposalTitle || !id) {
            toast.error("Please Enter the Proposal Title")
            setisProposalCreatedLoadind(false)
            return;
        }

        try {
            const response = await proposalService.createProposal({
                title: proposalTitle,
                creatorId: id
            })
            if (!response.success) {
                toast.error(response.message || "Error from Server")
                return;
            }
            router.push(`/proposals/builder/${response.data?.id}`)
        } catch (error) {
            console.log(error)
            toast.error(error instanceof Error ? error.message : "Unable to Create an Proposal")
        } finally {
            setisProposalCreatedLoadind(false)
        }

    }, [proposalTitle, id])

    return (
        <div className='w-full h-screen p-6 font-brcolage-grotesque'>
            {isLoading && (
                <div className='w-full flex items-center justify-center'>
                    <span className='text-white text-3xl animate-bounce'>Loading...</span>
                </div>)}
            {!isLoading && proposals.length > 0 ? (
                proposals.map((proposal) => (
                    <div className='w-1/3 bg-white text-black rounded-2xl'>
                        <h2 className='text-2xl'>{proposal.title}</h2>
                        <p className='text-xl'>{proposal.id}</p>
                    </div>
                ))
            ) : (
                <div className='w-full h-full p-2 flex flex-col items-center justify-center'>
                    <h1 className='text-3xl text-white'>No Proposals Found</h1>
                    <p className='text-white mt-2'>You have not created any proposals yet.</p>
                    <Button onClick={() => setisDialogOpen(prev => !prev)} variant="default" className='mt-3'>Create One <Plus /></Button>
                </div >
            )
            }
            <Dialog open={isDialogOpen} onOpenChange={setisDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create new Proposal</DialogTitle>
                        <DialogDescription>
                            This will create a new proposal
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={createProposal}>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={proposalTitle}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        setproposalTitle(e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter className="mt-4">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                className="cursor-pointer"
                                type="submit"
                                disabled={isProposalCreatedLoadind}
                            >
                                {isProposalCreatedLoadind ? "Please Wait" : "Save changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

        </div >
    )
}

export default ProposalsClient
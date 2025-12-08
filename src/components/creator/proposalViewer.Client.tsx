"use client"

import { useProposal } from '@/hooks/useProposal'
import React, { useCallback, useState } from 'react'
import { BlockRenderer } from './blockRenderer'
import { Loader2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Block } from '@/types/proposal'
import { toast } from 'sonner'
import brandingService from '@/lib/api/brandingService'
import proposalService from '@/lib/api/proposalService'

function ProposalViewerClient({ proposalId }: { proposalId: string }) {
    const { isLoading, proposalData } = useProposal({ proposalId })
    const [isProposalLoading, setisProposalLoading] = useState(false)

    // Dummy functions to disable editing
    const noop = () => { };


    const handleAcceptProposal = useCallback(async (status: string) => {
        try {
            setisProposalLoading(true)
            const data = {
                proposalId,
                status
            }
            const response = await proposalService.updateProposalStatus(data)
            if (response.success) {
                toast.success("Proposal Accepted Successfully")
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to Accept Proposal")
        } finally {
            setisProposalLoading(false)
        }
    }, [])

    const handleRejectProposal = useCallback(async (status : string) => {
        try {
            setisProposalLoading(true)
            const data = {
                proposalId,
                status
            }
            const response = await proposalService.updateProposalStatus(data)
            if (response.success) {
                toast.success("Proposal Rejected Successfully")
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to Reject Proposal")
        } finally {
            setisProposalLoading(false)
        }
    }, [])

    if (isLoading) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-100">
                <Loader2 className="animate-spin mb-4 h-8 w-8 text-zinc-400" />
                <p className="uppercase tracking-widest text-sm font-semibold text-zinc-500">Loading Proposal...</p>
            </div>
        )
    }

    if (!proposalData) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-zinc-950 text-zinc-500">
                <p>Proposal not found or deleted.</p>
            </div>
        )
    }

    return (
        // Added pb-32 to ensure content isn't hidden behind the fixed footer
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col items-center py-12 px-4 pb-32 sm:px-6">

            {/* --- Document Paper --- */}
            {/* Changed bg-white to bg-zinc-900 to match the Dark Theme requirement */}
            <div className="w-full max-w-4xl bg-white border border-zinc-800 shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="border-b border-zinc-800 p-8 bg-zinc-900">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {proposalData.title || "Untitled Proposal"}
                    </h1>
                    <p className="text-zinc-500 text-sm">
                        ID: <span className="font-mono">{proposalId}</span>
                    </p>
                </div>

                {/* Content Renderer */}
                <div className="p-8 space-y-6 min-h-[100vh]">
                    {proposalData.content && proposalData.content.length > 0 ? (
                        proposalData.content.map((block: Block) => (
                            <div key={block.id} className="relative pointer-events-none select-none">
                                <BlockRenderer
                                    block={block}
                                    updateBlockProps={noop}
                                    updateBlockPosition={noop}
                                    updateBlockSize={noop}
                                    deleteBlock={noop}
                                    uploadImage={async () => { return { url: "" } }}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-24 text-zinc-600 italic border-2 border-dashed border-zinc-800 rounded-lg">
                            No content available.
                        </div>
                    )}
                </div>
            </div>

            {/* --- Branding Footer (Optional) --- */}
            <div className="mt-8 text-zinc-700 text-xs uppercase tracking-widest font-semibold">
                Powered by Studio Flow
            </div>

            {/* --- Fixed Action Bar --- */}
            {/* Moved outside the document container to span full width */}
            <div className="fixed bottom-0 left-0 w-full border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-6 py-4 z-50">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

                    <div className="text-zinc-400 text-xs sm:text-sm text-center sm:text-left">
                        By accepting, you confirm you have read the proposal above.
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            className="flex-1 sm:flex-none border-zinc-800 bg-transparent hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                            onClick={() => handleRejectProposal("DECLINED")}
                            disabled={isProposalLoading}
                        >
                            <X className="w-4 h-4 mr-2" />
                            {isProposalLoading ? "Please Wait" : "Reject"}
                        </Button>

                        <Button
                            className="flex-1 sm:flex-none bg-white text-black hover:bg-zinc-200 border-none"
                            onClick={() => handleAcceptProposal("ACCEPTED")}
                            disabled={isProposalLoading}
                        >
                            <Check className="w-4 h-4 mr-2" />
                            {isProposalLoading ? "Please Wait" : "Accept Proposal"}
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ProposalViewerClient
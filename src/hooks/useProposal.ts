import proposalService from "@/lib/api/proposalService";
import { Proposal } from "@/types/proposal";
import { useCallback, useEffect, useState } from "react"

export function useProposal({ proposalId }: { proposalId: string }) {
    const [error, seterror] = useState("")
    const [isLoading, setisLoading] = useState(false)
    const [proposalData, setproposalData] = useState<Proposal | null>(null)

    const fetchProposalData = useCallback(async () => {
        if (!proposalId) return;
        seterror("")
        setisLoading(true)

        try {
            const response = await proposalService.getProposal(proposalId)
            console.log(response.data)
            if (response.success && response.data) {
                setproposalData(response.data.proposal)
            }
        } catch (error) {
            seterror(error instanceof Error ? error.message : "Unable to get the proposal Data")
        } finally {
            setisLoading(false)
        }

    }, [proposalId])

    useEffect(() => {
        fetchProposalData()
    }, [fetchProposalData]) // Fixed: added fetchProposalData to dependency array

    return {
        error,
        isLoading,
        proposalData
    }
}
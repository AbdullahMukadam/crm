import proposalService from "@/lib/api/proposalService";
import { fetchProposal } from "@/lib/store/features/proposalsSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { Proposal } from "@/types/proposal";
import { useCallback, useEffect, useState } from "react"

export function useProposal({ proposalId }: { proposalId: string }) {
    const [error, seterror] = useState("")
    const [isLoading, setisLoading] = useState(false)
    const [proposalData, setproposalData] = useState<Proposal | null>(null)
    const dispatch = useAppDispatch();

    const fetchProposalData = useCallback(async () => {
        if (!proposalId) return;
        seterror("")
        setisLoading(true)

        try {
            const response = await dispatch(fetchProposal(proposalId))

            if (fetchProposal.fulfilled.match(response)) {
                setproposalData(response.payload)
            } else if (fetchProposal.rejected.match(response)) {
                seterror("Unable to get the proposal Data")
            }

        } catch (error) {
            seterror(error instanceof Error ? error.message : "Unable to get the proposal Data")
        } finally {
            setisLoading(false)
        }

    }, [proposalId])

    useEffect(() => {
        fetchProposalData()
    }, [fetchProposalData])

    return {
        error,
        isLoading,
        proposalData
    }
}
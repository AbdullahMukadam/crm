
import { saveProposal } from "@/lib/store/features/proposalsSlice"
import { useAppDispatch } from "@/lib/store/hooks"
import { Block } from "@/types/proposal"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

interface useAutoSaveProps {
    AutoSaveInterval?: number
    autoSave: boolean
}

interface AutoSaveData {
    Blocks: Block[] | null,
    proposalIdState: string | null
}
export function useAutoSave({ AutoSaveInterval, autoSave }: useAutoSaveProps) {
    const INTERVAL = AutoSaveInterval || 3000
    const [autoSaveData, setautoSaveData] = useState<AutoSaveData>({
        Blocks: null,
        proposalIdState: null
    })
    const [error, seterror] = useState("")
    const dispatch = useAppDispatch()

    const saveProposalData = (blocksData: Block[], proposalId: string) => {
        if (!blocksData || !proposalId) {
            return;
        }
        setautoSaveData((prev) => ({
            ...prev,
            Blocks: blocksData,
            proposalIdState: proposalId
        }))

    }

    const hanldeAutoSave = useCallback(async () => {
        if (!autoSaveData.Blocks || !autoSaveData.proposalIdState) {
            return;
        }

        try {
            const response = await dispatch(saveProposal({
                blocks: autoSaveData.Blocks,
                proposalId: autoSaveData.proposalIdState
            }))

            if (saveProposal.fulfilled.match(response)) {
                toast.success("Data Saved Successfully")
            } else if (saveProposal.rejected.match(response)) {
                seterror("Unable to get the proposal Data")
            }
        } catch (error) {
            if (error instanceof Error) {
                seterror(error.message)
            } else {
                seterror("Unable to save the data")
            }
        }
    }, [autoSaveData])

    useEffect(() => {
        if (autoSave) {
            let timerId = setInterval(async () => {
                await hanldeAutoSave()
            }, INTERVAL);

            return () => {
                clearInterval(timerId)
            }
        }

    }, [autoSaveData, hanldeAutoSave])

    return {
        saveProposalData,
        error,
        hanldeAutoSave
    }
}
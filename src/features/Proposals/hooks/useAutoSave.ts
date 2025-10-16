import proposalService from "@/lib/api/proposalService"
import { Block } from "@/types/proposal"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

interface useAutoSaveProps {
    AutoSaveInterval?: number
}

interface AutoSaveData {
    Blocks: Block[] | null,
    proposalIdState: string | null
}
export function useAutoSave({ AutoSaveInterval }: useAutoSaveProps) {
    const INTERVAL = AutoSaveInterval || 3000
    const [autoSaveData, setautoSaveData] = useState<AutoSaveData>({
        Blocks: null,
        proposalIdState: null
    })
    const [error, seterror] = useState("")

    const saveProposalData = useCallback((blocksData: Block[], proposalId: string) => {
        if (!blocksData || !proposalId) {
            return;
        }
        setautoSaveData((prev) => ({
            ...prev,
            Blocks: blocksData,
            proposalIdState: proposalId
        }))

    }, [])

    const hanldeAutoSave = useCallback(async () => {
        if (!autoSaveData.Blocks || !autoSaveData.proposalIdState) {
            return;
        }

        try {
            const response = await proposalService.saveProposal({
                blocks: autoSaveData.Blocks,
                proposalId: autoSaveData.proposalIdState
            })
            if (response.success) {
                toast.success("Data Saved Successfully")
            }
        } catch (error) {
            if (error instanceof Error) {
                seterror(error.message)
            } else {
                seterror("Unable to save the data")
            }
        }
    }, [])

    useEffect(() => {
        let timerId = setInterval(async () => {
            await hanldeAutoSave()
        }, INTERVAL);

        return () => {
            clearInterval(timerId)
        }
    }, [])

    return {
        saveProposalData,
        error
    }
}
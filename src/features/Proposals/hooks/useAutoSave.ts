import proposalService from "@/lib/api/proposalService"
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

    const saveProposalData = (blocksData: Block[], proposalId: string) => {
        console.log("data", blocksData, proposalId)
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
        console.log("auto save data", autoSaveData.Blocks, autoSaveData.proposalIdState)
        if (!autoSaveData.Blocks || !autoSaveData.proposalIdState) {
            return;
        }

        try {
            const response = await proposalService.saveProposal({
                blocks: autoSaveData.Blocks,
                proposalId: autoSaveData.proposalIdState
            })
            if (response.success) {
                console.log("proposal saved data", autoSaveData.Blocks)
                toast.success("Data Saved Successfully")
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
        error
    }
}
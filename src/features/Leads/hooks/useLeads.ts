import brandingService from "@/lib/api/brandingService";
import { fetchLeadsSlice } from "@/lib/store/features/leadSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { LeadsDataForDashboard } from "@/types/branding";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useLeads() {
    const [leads, setLeads] = useState<LeadsDataForDashboard[]>([])
    const [error, setError] = useState("")
    const [loadind, setloadind] = useState(false)
    const dispatch = useAppDispatch()

    const fetchLeads = useCallback(async () => {
        try {
            setloadind(true)

            const response = await dispatch(fetchLeadsSlice())

            if (fetchLeadsSlice.fulfilled.match(response)) {
                setLeads(response.payload)
                toast.success("Leads fetched Successfully")
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : "An Error Occured")
            toast.error(error instanceof Error ? error.message : "An Error Occured")
        } finally {
            setloadind(false)
        }
    }, [leads])

    useEffect(() => {
        if(leads.length === 0) fetchLeads();
    }, [])


    return {
        loadind,
        error,
        leads
    }
}
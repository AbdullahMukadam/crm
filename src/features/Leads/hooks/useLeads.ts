import brandingService from "@/lib/api/brandingService";
import { LeadsDataForDashboard } from "@/types/branding";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useLeads() {
    const [leads, setLeads] = useState<LeadsDataForDashboard[]>([])
    const [error, setError] = useState("")
    const [loadind, setloadind] = useState(false)

    const fetchLeads = useCallback(async () => {
        try {
            setloadind(true)

            const response = await brandingService.fetchLeads()
            if (response.success && response.data?.leads) {
                console.log(response.data.leads)
                setLeads(response.data?.leads)
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
        fetchLeads()
    }, [])


    return {
        loadind,
        error,
        leads
    }
}
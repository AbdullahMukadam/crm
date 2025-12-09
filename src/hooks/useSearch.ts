import brandingService from "@/lib/api/brandingService"
import { LeadsDataForDashboard } from "@/types/branding"
import { useCallback, useState } from "react"
import { toast } from "sonner"

export function useSearch() {
    const [isLoading, setisLoading] = useState(false)
    const [searchResults, setsearchResults] = useState<LeadsDataForDashboard[]>([])

    const handleSearch = useCallback(async (query: string) => {
        if (typeof query.trim() !== "string") {
            return toast.error("Please enter only characters")
        }
        try {
            setisLoading(true)
            const response = await brandingService.searchLeads({
                query
            })
            if(response.success && response.data){
                setsearchResults(response.data)
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to Search the leads ")
        } finally {
            setisLoading(false)
        }
    }, [])

    return {
        isLoading,
        searchResults,
        handleSearch
    }
}
import brandingService from "@/lib/api/brandingService"
import { QUERY_KEYS } from "@/constants/query-keys"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import type { LeadsDataForDashboard } from "@/types/branding"
import { useCallback, useState } from "react"

export function useSearch() {
    const [searchTerm, setSearchTerm] = useState("")

    const searchQuery = useQuery({
        queryKey: QUERY_KEYS.leadSearch.results(searchTerm),
        queryFn: async () => {
            const response = await brandingService.searchLeads({ query: searchTerm })
            if (response.success && response.data) {
                return response.data
            }
            throw new Error("Failed to search leads")
        },
        enabled: searchTerm.trim().length > 0,
        placeholderData: keepPreviousData,
    })

    const handleSearch = useCallback((query: string) => {
        setSearchTerm(query)
    }, [])

    return {
        isLoading: searchQuery.isFetching,
        searchResults: searchQuery.data ?? ([] as LeadsDataForDashboard[]),
        handleSearch
    }
}
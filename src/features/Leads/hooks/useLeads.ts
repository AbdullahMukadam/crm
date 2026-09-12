import brandingService from "@/lib/api/brandingService";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { LeadsDataForDashboard } from "@/types/branding";
import { useQuery } from "@tanstack/react-query";

export function useLeads() {
    const query = useQuery({
        queryKey: QUERY_KEYS.leads.all,
        queryFn: async () => {
            const response = await brandingService.fetchLeads();
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error("Failed to fetch leads");
        },
    });

    return {
        loadind: query.isPending,
        error: query.isError && query.error instanceof Error ? query.error.message : "",
        leads: query.data ?? ([] as LeadsDataForDashboard[]),
    };
}
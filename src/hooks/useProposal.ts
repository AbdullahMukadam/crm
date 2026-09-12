import proposalService from "@/lib/api/proposalService";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useProposal({ proposalId }: { proposalId: string }) {
    const query = useQuery({
        queryKey: QUERY_KEYS.proposals.detail(proposalId),
        queryFn: async () => {
            const response = await proposalService.getProposal(proposalId);
            if (response.success && response.data) {
                return response.data.proposal;
            }
            throw new Error("Failed to get the proposal data");
        },
        enabled: !!proposalId,
    });

    return {
        error: query.isError && query.error instanceof Error ? query.error.message : "",
        isLoading: query.isPending,
        proposalData: query.data ?? null,
    };
}
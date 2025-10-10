import { CREATOR_API_ENDPOINTS } from "@/constants/creator";
import { FetchClient } from "./fetchClient";
import { APIResponse } from "@/types/auth";
import { Proposal } from "@/types/proposal";

class ProposalService {

    async getProposals() : Promise<APIResponse<Proposal>> {
        return FetchClient.makeRequest(CREATOR_API_ENDPOINTS.FETCH_PROPOSALS, {
            method: "GET",
        })
    }
}

const proposalService = new ProposalService();
export default proposalService;
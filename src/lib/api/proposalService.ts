import { CREATOR_API_ENDPOINTS } from "@/constants/creator";
import { FetchClient } from "./fetchClient";
import { APIResponse } from "@/types/auth";
import { CreatePropsalRequest, Proposal } from "@/types/proposal";

class ProposalService {

    async getProposals(): Promise<APIResponse<Proposal>> {
        return FetchClient.makeRequest(CREATOR_API_ENDPOINTS.FETCH_PROPOSALS, {
            method: "GET",
        })
    }

    async createProposal(data: CreatePropsalRequest) : Promise<APIResponse> {
        return FetchClient.makeRequest(CREATOR_API_ENDPOINTS.CREATE_PROPOSAL, {
            method: "POST",
            body: JSON.stringify(data)
        })
    }
}

const proposalService = new ProposalService();
export default proposalService;
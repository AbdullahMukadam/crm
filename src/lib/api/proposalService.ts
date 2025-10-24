import { CREATOR_API_ENDPOINTS } from "@/constants/creator";
import { FetchClient } from "./fetchClient";
import { APIResponse } from "@/types/auth";
import { CreateProposalResponse, CreatePropsalRequest, getProposal, Proposal, ProposalUpdateRequest } from "@/types/proposal";

class ProposalService {

    async getProposals(): Promise<APIResponse<Proposal[]>> {
        return FetchClient.makeRequest(CREATOR_API_ENDPOINTS.FETCH_PROPOSALS, {
            method: "GET",
        })
    }

    async getProposal(proposalId: string): Promise<APIResponse<getProposal>> {
        return FetchClient.makeRequest(`${CREATOR_API_ENDPOINTS.GET_PROPOSAL}/${proposalId}`, {
            method: "GET"
        })
    }

    async createProposal(data: CreatePropsalRequest): Promise<APIResponse<CreateProposalResponse>> {
        return FetchClient.makeRequest(CREATOR_API_ENDPOINTS.CREATE_PROPOSAL, {
            method: "POST",
            body: JSON.stringify(data)
        })
    }

    async saveProposal(data: ProposalUpdateRequest) {
        return FetchClient.makeRequest(CREATOR_API_ENDPOINTS.SAVE_PROPOSAL_DATA, {
            method: "POST",
            body: JSON.stringify(data)
        })
    }

    async deleteProposal(proposalId: string) : Promise<APIResponse> {
        return FetchClient.makeRequest(CREATOR_API_ENDPOINTS.DELETE_PROPOSAL, {
            method: "POST",
            body: JSON.stringify(proposalId)
        })
    }
}

const proposalService = new ProposalService();
export default proposalService;
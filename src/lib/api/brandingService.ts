import { CREATOR_API_ENDPOINTS } from "@/constants/creator";
import { FetchClient } from "./fetchClient";
import { createBrandingRequest, fetchBrandingResponse, LeadsDataForDashboard, LeadsResponseData } from "@/types/branding";
import { APIResponse } from "@/types/auth";
import { SelectedOption } from "@/components/creator/branding.Client";

class BrandingService {

    async createBranding(data: createBrandingRequest): Promise<APIResponse> {
        return FetchClient.makeRequest(CREATOR_API_ENDPOINTS.CREATE_BRANDING, {
            method: 'POST',
            body: JSON.stringify(data)
        })
    }

    async fetchBranding(): Promise<APIResponse<fetchBrandingResponse>> {
        return FetchClient.makeRequest(CREATOR_API_ENDPOINTS.FETCH_BRANDING, {
            method: 'GET',
        })
    }

    async createLead(formData: any): Promise<APIResponse> {
        return FetchClient.makeRequest(CREATOR_API_ENDPOINTS.CREATE_LEAD, {
            method: 'POST',
            body: JSON.stringify(formData)
        })
    }

    async generatePublicLeadFormUrl(data: SelectedOption) {
        return FetchClient.makeRequest(CREATOR_API_ENDPOINTS.GENERATE_URL, {
            method: 'POST',
            body: JSON.stringify(data)
        })
    }

    async fetchLeads(): Promise<APIResponse<LeadsDataForDashboard[]>> {
        return FetchClient.makeRequest(CREATOR_API_ENDPOINTS.FETCH_LEADS, {
            method: "GET"
        })
    }

    async deleteLead(id: string): Promise<APIResponse> {
        return FetchClient.makeRequest(CREATOR_API_ENDPOINTS.DELETE_LEAD, {
            method: "POST",
            body: JSON.stringify(id)
        })
    }

    async updateLeadStatus(leadId: string, status: string): Promise<APIResponse> {
        const url = `/api/creator/update-leads/${leadId}`
        return FetchClient.makeRequest(url, {
            method: "PATCH",
            body: JSON.stringify({ status })
        })
    }

}

const brandingService = new BrandingService()
export default brandingService
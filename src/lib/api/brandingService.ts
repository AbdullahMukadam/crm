import { CREATOR_API_ENDPOINTS } from "@/constants/creator";
import { FetchClient } from "./fetchClient";
import { createBrandingRequest, fetchBrandingResponse } from "@/types/branding";
import { APIResponse } from "@/types/auth";

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

}

const brandingService = new BrandingService()
export default brandingService
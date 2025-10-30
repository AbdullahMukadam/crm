import { CREATOR_API_ENDPOINTS } from "@/constants/creator";
import { FetchClient } from "./fetchClient";
import { createBrandingRequest } from "@/types/branding";

class BrandingService {

    async createBranding(data: createBrandingRequest){
        return FetchClient.makeRequest(CREATOR_API_ENDPOINTS.CREATE_BRANDING, {
            method : 'POST',
            body : JSON.stringify(data)
        })
    }


}

const brandingService = new BrandingService()
export default brandingService
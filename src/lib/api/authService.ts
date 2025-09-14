import { API_ENDPOINTS } from "@/constants/auth";
import { APIResponse, SigninCredentials, SigninResponse, SignupCredentials, SignupResponse } from "@/types/auth";
import { FetchClient } from "./fetchClient";


class AuthService {

    async signup(userCredentials: SignupCredentials): Promise<APIResponse<SignupResponse>> {
        return await FetchClient.makeRequest<SignupResponse>(API_ENDPOINTS.SIGNUP, {
            method: 'POST',
            body: JSON.stringify({
                userCredentials
            }),
        });
    }

    async signin(userCredentials: SigninCredentials): Promise<APIResponse<SigninResponse>> {
        return await FetchClient.makeRequest<SigninResponse>(API_ENDPOINTS.LOGIN, {
            method: 'POST',
            body: JSON.stringify({
                userCredentials
            }),
        });
    }

    async logout(): Promise<APIResponse> {
        return await FetchClient.makeRequest(API_ENDPOINTS.LOGOUT, {
            method: 'POST',
        });
    }
}

export const authService = new AuthService();
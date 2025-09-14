import {
    APIResponse
} from '@/types/auth';



class fetchClient {

    private baseURL: string;
    constructor() {
        this.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
    }

    async makeRequest<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<APIResponse<T>> {
        const url = `${endpoint}`;

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        // // Add auth token if available
        // if (typeof window !== 'undefined') {
        //     const token = localStorage.getItem('access_token');
        //     if (token) {
        //         config.headers = {
        //             ...config.headers,
        //             Authorization: `Bearer ${token}`,
        //         };
        //     }
        // }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Network error occurred');
        }
    }
}

export const FetchClient = new fetchClient();
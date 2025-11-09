

export interface FormDetails {
    id: string,
    label: string,
    mapping: string,
    type: string,
    required: boolean,
    order: number
}

export interface createBrandingRequest {
    feilds: FormDetails[]
}

export interface fetchBrandingResponse {
    id: string
    formFeilds: FormFeild[],
    creatorId: string,
    username: string,
    createdAt: string
    updatedAt: string
}

export interface FormFeild {
    id: string;
    label: string
    mapping: string
    order: number
    required: boolean
    type: string
}
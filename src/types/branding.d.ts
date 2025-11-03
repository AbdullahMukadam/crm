

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
    formFeilds: JSON,
    creatorId: string,
    username: string,
    createdAt: string
    updatedAt: string
}
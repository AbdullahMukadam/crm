

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


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

export interface LeadFormData {
    name: string,
    companyName: string,
    email: string,
    mobileNumber: string,
    note: data.note
}

export interface LeadsResponseData {
    leads: {
        id: string;
        email: string;
        note: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyName: string | null;
        mobileNumber: string | null;
        userId: string | null;
    }[];
}

export interface LeadsDataForDashboard {
    id: string;
    email: string;
    note: string | null;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    companyName: string | null;
    mobileNumber: string | null;
    userId: string | null;
    status : string;
}
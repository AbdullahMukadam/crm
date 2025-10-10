import { Project } from "./project";

export type ProposalStatus = 'draft' | 'sent' | 'accepted' | 'rejected';

export interface Proposal {
    id: string;
    title: string;
    content: string;
    project: Project;
    creatorId: string;
    clientId: string;
    amount: number;
    status: ProposalStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface Block {
    id: string;
    type: 'text' | 'image' | 'video' | 'file' | 'code' | 'chart';
    props: Record<string, any>;
}

export interface ImageUploadRequest {
    imageFile: File;
    userId: string;
}

export interface ProposalState {
    proposals: Proposal[];
    isLoading: boolean;
    error: string | null;
}
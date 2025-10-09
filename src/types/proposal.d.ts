import { Project } from "./project";

export type ProposalStatus = 'draft' | 'sent' | 'accepted' | 'rejected';

export interface Proposal {
    id: string;
    project: Project;
    creatorId: string;
    clientId: string;
    amount: number;
    status: ProposalStatus;
}

export interface Block {
    id: string;
    type: 'text' | 'image' | 'video' | 'file' | 'code' | 'chart';
    props: Record<string, any>;
}

export interface ImageUploadRequest{
    imageFile: File;
    userId: string;
}
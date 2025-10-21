import { Project } from "./project";

export type ProposalStatus = 'draft' | 'sent' | 'accepted' | 'rejected';

export interface Proposal {
    id: string;
    title: string;
    content: any;
    project?: Project;
    creatorId: string;
    clientId?: string;
    amount?: number;
    status: ProposalStatus;
    createdAt: Date;
    updatedAt: Date;
    creator: any;
}

export interface CreatePropsalRequest {
    title: string,
    creatorId: string
}

export interface CreateProposalResponse {
    proposal: {
        id: string,
        title: string
    }
}

export interface Block {
    id: string;
    type: 'text' | 'image' | 'video';
    props: Record<string, any>;
    size: {
        height: number,
        width: number
    };
    position: {
        x: number,
        y: number
    }
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

export interface ProposalUpdateRequest {
    blocks: Block[],
    proposalId: string
}

export interface getProposal {
    proposal: Proposal
}

